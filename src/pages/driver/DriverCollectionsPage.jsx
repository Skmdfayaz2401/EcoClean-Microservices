import { useState, useEffect } from 'react';
import { ClipboardList, Eye, Play, CheckCircle, Clock, MapPin, Calendar, Filter, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { collectionService } from '../../services/collectionService.js';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';

export default function DriverCollectionsPage() {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, [user]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const all = await collectionService.getCollections();
      const driverId = user?.driverId || 'DRV-001';
      const driverName = user?.name || 'James Wilson';

      let myCollections = (all || []).filter(c => c.assignedDriverId === driverId || c.assignedDriver === driverName);
      if (myCollections.length === 0) {
        myCollections = all || [];
      }
      setCollections(myCollections);
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await collectionService.updateStatus(id, status);
      triggerToast(`Task ${id} marked as ${status}!`);
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredCollections = collections.filter(c => {
    if (activeTab === 'All') return true;
    return c.status === activeTab;
  });

  return (
    <div className="page-container">
      {/* Toast Alert */}
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

      {/* Header */}
      <div className="page-header">
        <h1>My Collections</h1>
        <p>View and execute your assigned municipal collection tasks</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {['All', 'Assigned', 'In-Progress', 'Completed'].map(tab => (
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

      {/* Grid of Task Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredCollections.map(col => (
          <div key={col.id} className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary)' }}>{col.id}</span>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', marginLeft: '0.5rem' }}>Bin {col.binId}</span>
              </div>
              <Badge variant={col.status === 'Completed' ? 'success' : col.status === 'In-Progress' ? 'info' : 'warning'}>
                {col.status}
              </Badge>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--gray-700)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}>
              <MapPin size={15} style={{ color: 'var(--gray-400)' }} /> {col.binLocation || 'Municipal Sector'}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--gray-50)', padding: '0.5rem 0.75rem', borderRadius: 'var(--border-radius-xs)', marginBottom: '1rem', fontSize: '0.8rem' }}>
              <span>Fill Level: <strong style={{ color: col.fillLevel >= 80 ? 'var(--danger)' : 'var(--warning)' }}>{col.fillLevel}%</strong></span>
              <span>Priority: <strong>{col.priority}</strong></span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedCollection(col)}>
                <Eye size={14} /> Details
              </button>

              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {col.status !== 'In-Progress' && col.status !== 'Completed' && (
                  <button className="btn btn-primary btn-sm" onClick={() => handleStatusUpdate(col.id, 'In-Progress')}>
                    <Play size={14} /> Start
                  </button>
                )}
                {col.status === 'In-Progress' && (
                  <button className="btn btn-success btn-sm" onClick={() => handleStatusUpdate(col.id, 'Completed')}>
                    <CheckCircle size={14} /> Mark Collected
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredCollections.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>
            <ClipboardList size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <p>No collection tasks found in this tab.</p>
          </div>
        )}
      </div>

      {/* Task Details Modal */}
      <Modal isOpen={!!selectedCollection} onClose={() => setSelectedCollection(null)} title={`Collection Task: ${selectedCollection?.id}`}>
        {selectedCollection && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: 'var(--gray-50)', padding: '1rem', borderRadius: 'var(--border-radius-xs)' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Bin ID</p>
                <p style={{ fontWeight: 600 }}>{selectedCollection.binId}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Status</p>
                <p style={{ fontWeight: 600 }}>{selectedCollection.status}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Location</p>
                <p style={{ fontWeight: 600 }}>{selectedCollection.binLocation}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Fill Level</p>
                <p style={{ fontWeight: 700, color: 'var(--danger)' }}>{selectedCollection.fillLevel}%</p>
              </div>
            </div>

            {selectedCollection.notes && (
              <div style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid var(--gray-200)', borderRadius: 'var(--border-radius-xs)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Special Instructions</p>
                <p style={{ fontSize: '0.85rem' }}>{selectedCollection.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
