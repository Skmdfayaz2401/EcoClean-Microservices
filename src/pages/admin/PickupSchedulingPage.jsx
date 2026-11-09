import { useState, useEffect } from 'react';
import { 
  CalendarClock, Clock, AlertTriangle, CheckCircle, 
  MapPin, Truck, Calendar, User, Plus, Check, Zap, AlertCircle
} from 'lucide-react';
import { collectionService } from '../../services/collectionService.js';
import { driverService } from '../../services/driverService.js';
import { binService } from '../../services/binService.js';
import Badge from '../../components/common/Badge.jsx';

export default function PickupSchedulingPage() {
  const [collections, setCollections] = useState([]);
  const [bins, setBins] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    binId: '',
    driverId: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:30',
    priority: 'High',
    notes: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [colsData, binsData, driversData] = await Promise.all([
        collectionService.getCollections().catch(() => []),
        binService.getBins().catch(() => []),
        driverService.getDrivers().catch(() => [])
      ]);

      setCollections(colsData || []);
      setBins(binsData || []);
      setDrivers(driversData || []);

      if (binsData && binsData.length > 0 && !formData.binId) {
        setFormData(prev => ({ ...prev, binId: binsData[0].id }));
      }
    } catch (err) {
      console.error('Failed to load scheduling data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.binId) return;
    
    const selectedBin = bins.find(b => b.id === formData.binId);
    const selectedDriver = drivers.find(d => d.id === formData.driverId);
    
    try {
      const scheduledDateTime = `${formData.date}T${formData.time}:00Z`;
      const newCollection = await collectionService.createCollection({
        binId: formData.binId,
        binLocation: selectedBin?.location || 'Municipal Center',
        fillLevel: selectedBin?.fillLevel || 85,
        priority: formData.priority,
        assignedDriver: selectedDriver?.name || null,
        assignedDriverId: selectedDriver?.id || null,
        scheduledTime: scheduledDateTime,
        status: selectedDriver ? 'Assigned' : 'Pending',
        notes: formData.notes
      });

      triggerToast(`✅ Pickup scheduled successfully for Bin ${formData.binId} (${selectedBin?.location || ''}) on ${formData.date} at ${formData.time}!`);
      
      // Reset form notes
      setFormData(prev => ({ ...prev, notes: '' }));
      await loadData();
    } catch (err) {
      console.error(err);
      triggerToast('❌ Failed to schedule pickup. Please try again.');
    }
  };

  // Categorize collections
  const todayStr = new Date().toISOString().split('T')[0];

  const todayPickups = collections.filter(c => {
    if (c.status === 'Completed' || c.status === 'Cancelled') return false;
    if (!c.scheduledTime) return true;
    return c.scheduledTime.startsWith(todayStr);
  });

  const upcomingPickups = collections.filter(c => {
    if (c.status === 'Completed' || c.status === 'Cancelled') return false;
    if (!c.scheduledTime) return false;
    const itemDate = c.scheduledTime.split('T')[0];
    return itemDate > todayStr;
  });

  const overduePickups = collections.filter(c => {
    if (c.status === 'Completed' || c.status === 'Cancelled') return false;
    if (!c.scheduledTime) return false;
    const itemDate = c.scheduledTime.split('T')[0];
    return itemDate < todayStr;
  });

  const completedPickups = collections.filter(c => c.status === 'Completed');

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical': return <Badge variant="danger">{priority}</Badge>;
      case 'High': return <Badge variant="warning">{priority}</Badge>;
      case 'Medium': return <Badge variant="info">{priority}</Badge>;
      default: return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return <Badge variant="success">{status}</Badge>;
      case 'In-Progress': return <Badge variant="info">{status}</Badge>;
      case 'Assigned': return <Badge variant="primary">{status}</Badge>;
      case 'Pending': return <Badge variant="warning">{status}</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const renderPickupCard = (item, isOverdue = false) => (
    <div key={item.id} style={{
      padding: '1rem',
      background: isOverdue ? '#fef2f2' : 'var(--gray-50)',
      border: `1px solid ${isOverdue ? '#fee2e2' : 'var(--gray-200)'}`,
      borderRadius: 'var(--border-radius-xs)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: isOverdue ? 'var(--danger)' : 'var(--gray-900)' }}>
            {item.id}
          </span>
          <span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.85rem' }}>
            {item.binId}
          </span>
        </div>
        <div>
          {getPriorityBadge(item.priority)}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--gray-700)' }}>
        <MapPin size={14} style={{ color: 'var(--gray-400)', flexShrink: 0 }} />
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.binLocation || 'Municipal Sector'}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <User size={13} />
          <span>{item.assignedDriver || 'Unassigned'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Clock size={13} />
          <span>{item.scheduledTime ? new Date(item.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:00 AM'}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--gray-200)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: item.fillLevel >= 80 ? 'var(--danger)' : 'var(--gray-600)' }}>
          Fill: {item.fillLevel}%
        </span>
        {getStatusBadge(item.status)}
      </div>
    </div>
  );

  return (
    <div className="page-container">
      {/* Toast Alert */}
      {toastMsg && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 9999,
          background: 'var(--primary-dark)', color: 'white', padding: '1rem 1.25rem',
          borderRadius: 'var(--border-radius-xs)', boxShadow: 'var(--shadow-xl)',
          display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'slideUp 0.2s ease',
          fontSize: '0.875rem', fontWeight: 500
        }}>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <h1>Pickup Scheduling</h1>
        <p>Schedule municipal waste pickups, assign collection crews, and track dispatch schedules</p>
      </div>

      {/* Scheduling Form Card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header" style={{ background: 'var(--primary-50)', borderBottom: '1px solid var(--primary-100)' }}>
          <h3 style={{ color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarClock size={18} /> Schedule New Pickup Dispatch
          </h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleScheduleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Select Bin to Collect</label>
                <select 
                  className="form-input" 
                  value={formData.binId} 
                  onChange={e => setFormData({ ...formData, binId: e.target.value })}
                  required
                >
                  {bins.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.id} - {b.location} ({b.fillLevel}% - {b.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Select Driver</label>
                <select 
                  className="form-input" 
                  value={formData.driverId} 
                  onChange={e => setFormData({ ...formData, driverId: e.target.value })}
                >
                  <option value="">Leave Unassigned (Pending Driver Queue)</option>
                  {drivers.filter(d => d.active).map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.vehicle || 'Truck'}) - {d.status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={formData.date} 
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Target Time</label>
                <input 
                  type="time" 
                  className="form-input" 
                  value={formData.time} 
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select 
                  className="form-input" 
                  value={formData.priority} 
                  onChange={e => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Critical">Critical Priority (Immediate)</option>
                  <option value="High">High Priority (Within 4 hours)</option>
                  <option value="Medium">Medium Priority (Standard shift)</option>
                  <option value="Low">Low Priority (Routine)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Special Instructions / Notes</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.notes} 
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g. High commercial waste volume, lock code 4491"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary btn-lg">
                <Plus size={18} /> Schedule Pickup
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Schedule Category Views */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {/* Today's Pickups */}
        <div className="card">
          <div className="card-header" style={{ borderLeft: '4px solid var(--primary)' }}>
            <h3>Today's Pickups</h3>
            <span className="badge badge-primary">{todayPickups.length} Tasks</span>
          </div>
          <div className="card-body" style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem' }}>
            {todayPickups.length === 0 ? (
              <p style={{ color: 'var(--gray-400)', textAlign: 'center', padding: '2rem 0' }}>No scheduled pickups for today.</p>
            ) : (
              todayPickups.map(p => renderPickupCard(p))
            )}
          </div>
        </div>

        {/* Upcoming Pickups */}
        <div className="card">
          <div className="card-header" style={{ borderLeft: '4px solid var(--info)' }}>
            <h3>Upcoming Pickups</h3>
            <span className="badge badge-info">{upcomingPickups.length} Scheduled</span>
          </div>
          <div className="card-body" style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem' }}>
            {upcomingPickups.length === 0 ? (
              <p style={{ color: 'var(--gray-400)', textAlign: 'center', padding: '2rem 0' }}>No upcoming pickups scheduled.</p>
            ) : (
              upcomingPickups.map(p => renderPickupCard(p))
            )}
          </div>
        </div>

        {/* Overdue Pickups */}
        <div className="card">
          <div className="card-header" style={{ borderLeft: '4px solid var(--danger)' }}>
            <h3 style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertTriangle size={16} /> Overdue Pickups
            </h3>
            <span className="badge badge-danger">{overduePickups.length} Overdue</span>
          </div>
          <div className="card-body" style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem' }}>
            {overduePickups.length === 0 ? (
              <p style={{ color: 'var(--gray-400)', textAlign: 'center', padding: '2rem 0' }}>No overdue pickups! All caught up.</p>
            ) : (
              overduePickups.map(p => renderPickupCard(p, true))
            )}
          </div>
        </div>

        {/* Completed Pickups */}
        <div className="card">
          <div className="card-header" style={{ borderLeft: '4px solid var(--success)' }}>
            <h3>Completed Pickups</h3>
            <span className="badge badge-success">{completedPickups.length} Done</span>
          </div>
          <div className="card-body" style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem' }}>
            {completedPickups.length === 0 ? (
              <p style={{ color: 'var(--gray-400)', textAlign: 'center', padding: '2rem 0' }}>No completed collections yet.</p>
            ) : (
              completedPickups.map(p => renderPickupCard(p))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
