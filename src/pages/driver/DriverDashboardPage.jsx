import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarClock, Clock, CheckCircle, Route, Play, 
  AlertTriangle, MapPin, ArrowRight, Truck, Eye, ShieldAlert 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { collectionService } from '../../services/collectionService.js';
import { routeService } from '../../services/routeService.js';
import StatCard from '../../components/common/StatCard.jsx';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';

export default function DriverDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [collections, setCollections] = useState([]);
  const [activeRoute, setActiveRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  
  // Issue Modal
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [issueType, setIssueType] = useState('Blocked Access');
  const [issueNotes, setIssueNotes] = useState('');

  useEffect(() => {
    loadDriverData();
  }, [user]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const loadDriverData = async () => {
    try {
      setLoading(true);
      const [allCollections, allRoutes] = await Promise.all([
        collectionService.getCollections().catch(() => []),
        routeService.getRoutes().catch(() => [])
      ]);

      const driverId = user?.driverId || 'DRV-001';
      const driverName = user?.name || 'James Wilson';

      // Filter collections for this driver or unassigned if none
      let myCols = (allCollections || []).filter(c => 
        c.assignedDriverId === driverId || c.assignedDriver === driverName
      );
      if (myCols.length === 0) {
        myCols = (allCollections || []).slice(0, 5);
      }
      setCollections(myCols);

      // Current route
      const myRoute = (allRoutes || []).find(r => r.driverId === driverId) || (allRoutes || [])[0];
      setActiveRoute(myRoute || null);
    } catch (err) {
      console.error('Failed to load driver dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTask = async (id) => {
    try {
      await collectionService.updateStatus(id, 'In-Progress');
      triggerToast(`Task ${id} started! Status updated to In-Progress.`);
      await loadDriverData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      await collectionService.updateStatus(id, 'Completed');
      triggerToast(`✅ Bin collected successfully for task ${id}!`);
      await loadDriverData();
    } catch (err) {
      console.error(err);
    }
  };

  const openReportIssue = (col) => {
    setSelectedTask(col);
    setIssueType('Blocked Access');
    setIssueNotes('');
    setIsIssueModalOpen(true);
  };

  const handleSubmitIssue = (e) => {
    e.preventDefault();
    setIsIssueModalOpen(false);
    triggerToast(`⚠️ Issue reported for ${selectedTask?.binId}: "${issueType}". Dispatch notified.`);
  };

  const pendingCount = collections.filter(c => c.status === 'Pending' || c.status === 'Assigned').length;
  const inProgressCount = collections.filter(c => c.status === 'In-Progress').length;
  const completedCount = collections.filter(c => c.status === 'Completed').length;

  const priorityBins = collections.filter(c => c.fillLevel >= 80 || c.priority === 'Critical');

  return (
    <div className="page-container">
      {/* Toast notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 9999,
          background: 'var(--gray-900)', color: 'white', padding: '1rem 1.25rem',
          borderRadius: 'var(--border-radius-xs)', boxShadow: 'var(--shadow-xl)',
          display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'slideUp 0.2s ease',
          fontSize: '0.875rem'
        }}>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Driver Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Driver Dashboard</h1>
          <p>Welcome back, <strong>{user?.name || 'Driver'}</strong>. Assigned vehicle: <strong>{user?.vehicle || 'Truck #T-101'}</strong></p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/driver/routes')}>
          <Route size={16} /> View Current Route
        </button>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <StatCard title="Assigned Pickups" value={collections.length} icon={CalendarClock} color="var(--primary)" />
        <StatCard title="Pending / Queue" value={pendingCount} icon={Clock} color="#f59e0b" />
        <StatCard title="In Progress" value={inProgressCount} icon={Truck} color="#3b82f6" />
        <StatCard title="Completed Today" value={completedCount} icon={CheckCircle} color="var(--success)" />
      </div>

      {/* Priority Alert Banner */}
      {priorityBins.length > 0 && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 'var(--border-radius)',
          padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={24} style={{ color: 'var(--danger)' }} />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#991b1b' }}>High Fill-Level Notice</h4>
              <p style={{ fontSize: '0.8rem', color: '#b91c1c' }}>You have {priorityBins.length} high/critical bins requiring immediate collection on your shift.</p>
            </div>
          </div>
          <button className="btn btn-danger btn-sm" onClick={() => navigate('/driver/collections')}>
            View Priority Tasks
          </button>
        </div>
      )}

      {/* 2-Column: Today's Tasks & Active Route Card */}
      <div className="grid-2">
        {/* Today's Tasks List */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Today's Assigned Pickups</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/driver/collections')}>
              All Tasks <ArrowRight size={14} />
            </button>
          </div>
          <div className="card-body" style={{ padding: '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {collections.map(col => (
                <div key={col.id} style={{
                  padding: '0.875rem', background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--border-radius-xs)', display: 'flex', flexDirection: 'column', gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{col.id}</span>
                      <span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.8rem' }}>{col.binId}</span>
                    </div>
                    <Badge variant={col.status === 'Completed' ? 'success' : col.status === 'In-Progress' ? 'info' : 'warning'}>
                      {col.status}
                    </Badge>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--gray-700)' }}>
                    <MapPin size={14} style={{ color: 'var(--gray-400)' }} />
                    <span>{col.binLocation || 'Municipal Sector'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem', paddingTop: '0.5rem', borderTop: '1px solid var(--gray-200)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: col.fillLevel >= 80 ? 'var(--danger)' : 'var(--gray-600)' }}>
                        Fill: {col.fillLevel}%
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {col.status !== 'Completed' && col.status !== 'In-Progress' && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleStartTask(col.id)}>
                          <Play size={13} /> Start
                        </button>
                      )}
                      {col.status === 'In-Progress' && (
                        <button className="btn btn-success btn-sm" onClick={() => handleCompleteTask(col.id)}>
                          <CheckCircle size={13} /> Collected
                        </button>
                      )}
                      {col.status !== 'Completed' && (
                        <button className="btn btn-secondary btn-sm" onClick={() => openReportIssue(col)}>
                          <AlertTriangle size={13} /> Report
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Route Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <div className="card-header">
              <h3>Active Dispatch Route</h3>
            </div>
            <div className="card-body">
              {activeRoute ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary)' }}>Route {activeRoute.id}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Vehicle: {activeRoute.vehicle}</p>
                    </div>
                    <Badge variant={activeRoute.status === 'Completed' ? 'success' : 'info'}>
                      {activeRoute.status}
                    </Badge>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ padding: '0.5rem', background: 'var(--gray-50)', borderRadius: '4px' }}>
                      <p style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>Stops</p>
                      <p style={{ fontWeight: 700, fontSize: '1rem' }}>{activeRoute.stops?.length || 4}</p>
                    </div>
                    <div style={{ padding: '0.5rem', background: 'var(--gray-50)', borderRadius: '4px' }}>
                      <p style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>Distance</p>
                      <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary)' }}>{activeRoute.totalDistance} km</p>
                    </div>
                    <div style={{ padding: '0.5rem', background: 'var(--gray-50)', borderRadius: '4px' }}>
                      <p style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>Est. Time</p>
                      <p style={{ fontWeight: 700, fontSize: '1rem' }}>{activeRoute.estimatedDuration} min</p>
                    </div>
                  </div>

                  <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate(`/driver/routes/${activeRoute.id}`)}>
                    Open Navigation Circuit <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <p style={{ color: 'var(--gray-400)', textAlign: 'center' }}>No active route assigned currently.</p>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Shift Support & Guidance</h3>
            </div>
            <div className="card-body" style={{ fontSize: '0.85rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>
              <p>• Ensure heavy compaction cycle is engaged before transport.</p>
              <p>• In case of blocked municipal lanes, submit an issue report for dispatch re-routing.</p>
              <p>• Report sensor telemetry discrepancies directly from the task card.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Issue Modal */}
      <Modal isOpen={isIssueModalOpen} onClose={() => setIsIssueModalOpen(false)} title={`Report Issue for ${selectedTask?.binId}`}>
        <form onSubmit={handleSubmitIssue}>
          <div className="form-group">
            <label>Issue Classification</label>
            <select className="form-input" value={issueType} onChange={e => setIssueType(e.target.value)}>
              <option value="Blocked Access">Blocked Access / Illegally Parked Vehicle</option>
              <option value="Damaged Bin">Physical Bin Damage / Lid Broken</option>
              <option value="Sensor Malfunction">IoT Sensor Malfunction / False Fill Level</option>
              <option value="Contaminated Waste">Hazardous / Contaminated Waste Stream</option>
              <option value="Overweight">Overweight / Jammed Compactor</option>
            </select>
          </div>
          <div className="form-group">
            <label>Driver Observations</label>
            <textarea 
              className="form-input" 
              rows={3} 
              value={issueNotes} 
              onChange={e => setIssueNotes(e.target.value)}
              placeholder="Describe access road condition or hazard..."
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsIssueModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-danger">Submit Incident Report</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
