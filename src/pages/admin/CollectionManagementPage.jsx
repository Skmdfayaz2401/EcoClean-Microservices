import { useState, useEffect } from 'react';
import { 
  Search, Plus, Eye, UserPlus, CalendarClock, 
  CheckCircle, Clock, MapPin, Trash2, Truck, AlertTriangle, AlertCircle
} from 'lucide-react';
import { collectionService } from '../../services/collectionService.js';
import { driverService } from '../../services/driverService.js';
import { binService } from '../../services/binService.js';
import StatCard from '../../components/common/StatCard.jsx';
import Modal from '../../components/common/Modal.jsx';
import Badge from '../../components/common/Badge.jsx';

export default function CollectionManagementPage() {
  const [collections, setCollections] = useState([]);
  const [bins, setBins] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);

  // Forms
  const [createForm, setCreateForm] = useState({
    binId: '',
    driverId: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    priority: 'High',
    notes: ''
  });
  const [assignForm, setAssignForm] = useState({ driverId: '' });
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', time: '' });

  useEffect(() => {
    loadData();
  }, []);

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
    } catch (err) {
      console.error('Failed to load collections data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Summary counts
  const pendingCount = collections.filter(c => c.status === 'Pending').length;
  const assignedCount = collections.filter(c => c.status === 'Assigned').length;
  const inProgressCount = collections.filter(c => c.status === 'In-Progress').length;
  const completedCount = collections.filter(c => c.status === 'Completed').length;

  const tabs = ['All', 'Pending', 'Assigned', 'In-Progress', 'Completed', 'Cancelled'];

  const filteredCollections = collections.filter(c => {
    const matchesTab = activeTab === 'All' || c.status === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      c.id.toLowerCase().includes(q) || 
      (c.binId || '').toLowerCase().includes(q) || 
      (c.binLocation || '').toLowerCase().includes(q) ||
      (c.assignedDriver || '').toLowerCase().includes(q);
    const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;
    return matchesTab && matchesSearch && matchesPriority;
  });

  const handleOpenAssign = (col) => {
    setSelectedCollection(col);
    setAssignForm({ driverId: drivers[0]?.id || '' });
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCollection || !assignForm.driverId) return;
    const driverObj = drivers.find(d => d.id === assignForm.driverId);
    try {
      await collectionService.assignDriver(selectedCollection.id, assignForm.driverId, driverObj?.name || 'Assigned Driver');
      setIsAssignModalOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenReschedule = (col) => {
    setSelectedCollection(col);
    setRescheduleForm({
      date: new Date().toISOString().split('T')[0],
      time: '14:00'
    });
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCollection) return;
    try {
      const newTimeStr = `${rescheduleForm.date}T${rescheduleForm.time}:00Z`;
      await collectionService.reschedule(selectedCollection.id, newTimeStr);
      setIsRescheduleModalOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenDetail = (col) => {
    setSelectedCollection(col);
    setIsDetailModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const binObj = bins.find(b => b.id === createForm.binId);
    const driverObj = drivers.find(d => d.id === createForm.driverId);
    
    try {
      await collectionService.createCollection({
        binId: createForm.binId,
        binLocation: binObj?.location || 'Municipal Center',
        fillLevel: binObj?.fillLevel || 85,
        priority: createForm.priority,
        assignedDriver: driverObj?.name || null,
        assignedDriverId: driverObj?.id || null,
        scheduledTime: `${createForm.date}T${createForm.time}:00Z`,
        status: driverObj ? 'Assigned' : 'Pending',
        notes: createForm.notes
      });
      setIsCreateModalOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

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

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Collection Management</h1>
          <p>Manage garbage pickup tasks, driver dispatches, and collection workflows</p>
        </div>
        <button className="btn btn-primary" onClick={() => {
          setCreateForm({
            binId: bins[0]?.id || 'BIN-001',
            driverId: '',
            date: new Date().toISOString().split('T')[0],
            time: '11:00',
            priority: 'High',
            notes: 'High fill level reported by IoT sensor'
          });
          setIsCreateModalOpen(true);
        }}>
          <Plus size={16} /> Create Pickup Task
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="stats-grid">
        <StatCard title="Pending" value={pendingCount} icon={Clock} color="#f59e0b" />
        <StatCard title="Assigned" value={assignedCount} icon={Truck} color="#3b82f6" />
        <StatCard title="In Progress" value={inProgressCount} icon={CalendarClock} color="#8b5cf6" />
        <StatCard title="Completed" value={completedCount} icon={CheckCircle} color="var(--success, #22c55e)" />
      </div>

      {/* Status Tabs */}
      <div className="tabs">
        {tabs.map(tab => (
          <button 
            key={tab} 
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            <span style={{ marginLeft: '6px', fontSize: '0.75rem', opacity: 0.8 }}>
              ({tab === 'All' ? collections.length : collections.filter(c => c.status === tab).length})
            </span>
          </button>
        ))}
      </div>

      {/* Filters Toolbar */}
      <div className="toolbar">
        <div className="search-input">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search by collection ID, bin, or location..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <select className="filter-select" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
          <option value="All">All Priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Collections Table */}
      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Collection ID</th>
                <th>Bin ID</th>
                <th>Location</th>
                <th>Fill Level</th>
                <th>Priority</th>
                <th>Assigned Driver</th>
                <th>Scheduled Time</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCollections.map(col => (
                <tr key={col.id}>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{col.id}</td>
                  <td style={{ fontWeight: 600 }}>{col.binId}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={13} style={{ color: 'var(--gray-400)' }} />
                      <span>{col.binLocation || 'Main Sector'}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="fill-level-bar" style={{ width: '50px', height: '6px' }}>
                        <div 
                          className={`fill ${col.fillLevel >= 80 ? 'fill-critical' : col.fillLevel >= 60 ? 'fill-high' : 'fill-normal'}`} 
                          style={{ width: `${col.fillLevel}%` }}
                        />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{col.fillLevel}%</span>
                    </div>
                  </td>
                  <td>{getPriorityBadge(col.priority)}</td>
                  <td>
                    {col.assignedDriver ? (
                      <span style={{ fontWeight: 500 }}>{col.assignedDriver}</span>
                    ) : (
                      <span style={{ color: 'var(--gray-400)', fontStyle: 'italic', fontSize: '0.85rem' }}>Unassigned</span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>
                    {col.scheduledTime ? new Date(col.scheduledTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Today'}
                  </td>
                  <td>{getStatusBadge(col.status)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button 
                        className="btn btn-secondary btn-sm" 
                        onClick={() => handleOpenDetail(col)}
                        title="View Details"
                      >
                        <Eye size={13} /> View
                      </button>
                      {col.status !== 'Completed' && (
                        <>
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => handleOpenAssign(col)}
                            title="Assign Driver"
                          >
                            <UserPlus size={13} /> Assign
                          </button>
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => handleOpenReschedule(col)}
                            title="Reschedule Pickup"
                          >
                            <CalendarClock size={13} /> Reschedule
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCollections.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--gray-400)' }}>
                    No collection records match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title={`Collection Details: ${selectedCollection?.id}`}>
        {selectedCollection && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--gray-50)', borderRadius: 'var(--border-radius-xs)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Status</span>
                <div>{getStatusBadge(selectedCollection.status)}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Priority</span>
                <div>{getPriorityBadge(selectedCollection.priority)}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Fill Level</span>
                <div style={{ fontWeight: 700, color: 'var(--danger)' }}>{selectedCollection.fillLevel}%</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'var(--gray-50)', borderRadius: 'var(--border-radius-xs)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Bin ID</p>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{selectedCollection.binId}</p>
              </div>
              <div style={{ padding: '0.75rem', background: 'var(--gray-50)', borderRadius: 'var(--border-radius-xs)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Assigned Driver</p>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{selectedCollection.assignedDriver || 'None Assigned'}</p>
              </div>
              <div style={{ padding: '0.75rem', background: 'var(--gray-50)', borderRadius: 'var(--border-radius-xs)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Location</p>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{selectedCollection.binLocation || 'Main Sector'}</p>
              </div>
              <div style={{ padding: '0.75rem', background: 'var(--gray-50)', borderRadius: 'var(--border-radius-xs)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Scheduled Time</p>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {selectedCollection.scheduledTime ? new Date(selectedCollection.scheduledTime).toLocaleString() : 'Today'}
                </p>
              </div>
            </div>

            {selectedCollection.notes && (
              <div style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid var(--gray-200)', borderRadius: 'var(--border-radius-xs)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Dispatch Notes</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-700)' }}>{selectedCollection.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Assign Driver Modal */}
      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title={`Assign Driver to ${selectedCollection?.id}`}>
        <form onSubmit={handleAssignSubmit}>
          <div className="form-group">
            <label>Select Driver</label>
            <select 
              className="form-input" 
              value={assignForm.driverId} 
              onChange={e => setAssignForm({ driverId: e.target.value })}
              required
            >
              {drivers.filter(d => d.active).map(driver => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} ({driver.vehicle || 'Standard Truck'}) - {driver.status}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAssignModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Confirm Driver</button>
          </div>
        </form>
      </Modal>

      {/* Reschedule Modal */}
      <Modal isOpen={isRescheduleModalOpen} onClose={() => setIsRescheduleModalOpen(false)} title={`Reschedule ${selectedCollection?.id}`}>
        <form onSubmit={handleRescheduleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>New Date</label>
              <input 
                type="date" 
                className="form-input" 
                required 
                value={rescheduleForm.date} 
                onChange={e => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>New Time</label>
              <input 
                type="time" 
                className="form-input" 
                required 
                value={rescheduleForm.time} 
                onChange={e => setRescheduleForm({ ...rescheduleForm, time: e.target.value })}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsRescheduleModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Update Schedule</button>
          </div>
        </form>
      </Modal>

      {/* Create Pickup Task Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Garbage Pickup Task">
        <form onSubmit={handleCreateSubmit}>
          <div className="form-group">
            <label>Select Target Bin</label>
            <select 
              className="form-input" 
              value={createForm.binId} 
              onChange={e => setCreateForm({ ...createForm, binId: e.target.value })}
              required
            >
              {bins.map(bin => (
                <option key={bin.id} value={bin.id}>
                  {bin.id} - {bin.location} ({bin.fillLevel}% full - {bin.status})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Assign Driver (Optional)</label>
            <select 
              className="form-input" 
              value={createForm.driverId} 
              onChange={e => setCreateForm({ ...createForm, driverId: e.target.value })}
            >
              <option value="">Leave Unassigned (Pending Queue)</option>
              {drivers.filter(d => d.active).map(driver => (
                <option key={driver.id} value={driver.id}>{driver.name} - {driver.status}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input 
                type="date" 
                className="form-input" 
                required 
                value={createForm.date} 
                onChange={e => setCreateForm({ ...createForm, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input 
                type="time" 
                className="form-input" 
                required 
                value={createForm.time} 
                onChange={e => setCreateForm({ ...createForm, time: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select 
              className="form-input" 
              value={createForm.priority} 
              onChange={e => setCreateForm({ ...createForm, priority: e.target.value })}
            >
              <option value="Critical">Critical Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
          <div className="form-group">
            <label>Dispatch Notes</label>
            <textarea 
              className="form-input" 
              rows={2}
              value={createForm.notes} 
              onChange={e => setCreateForm({ ...createForm, notes: e.target.value })}
              placeholder="e.g. Access via rear alleyway, requires heavy compactor"
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Task</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
