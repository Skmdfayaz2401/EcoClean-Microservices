import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Plus, Zap, Eye, Edit, Trash2, Truck, RefreshCw, 
  MapPin, Battery, Thermometer, CalendarClock, X, Check, Clock
} from 'lucide-react';
import { binService } from '../../services/binService.js';
import { telemetryService } from '../../services/telemetryService.js';
import { collectionService } from '../../services/collectionService.js';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import FillGauge from '../../components/common/FillGauge.jsx';
import LineChart from '../../components/charts/LineChart.jsx';

export default function BinMonitoringPage() {
  const navigate = useNavigate();
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All');
  const [toastMsg, setToastMsg] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBin, setSelectedBin] = useState(null);
  const [binTelemetry, setBinTelemetry] = useState([]);
  const [binCollections, setBinCollections] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    location: '',
    area: 'Commercial District',
    capacity: 240,
    wasteType: 'General',
    batteryLevel: 95,
    fillLevel: 50,
    status: 'Medium'
  });

  const loadBins = async () => {
    try {
      setLoading(true);
      const data = await binService.getBins();
      setBins(data || []);
    } catch (error) {
      console.error('Failed to load bins:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBins();
  }, []);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleRefreshTelemetry = async () => {
    try {
      const updated = await binService.simulateTelemetryUpdate();
      await loadBins();
      triggerToast('⚡ Telemetry pulse received! Live bin sensor readings refreshed.');
    } catch (err) {
      console.error(err);
    }
  };

  const uniqueAreas = useMemo(() => {
    const areas = bins.map(b => b.area).filter(Boolean);
    return ['All', ...new Set(areas)];
  }, [bins]);

  const filteredBins = useMemo(() => {
    return bins.filter(b => {
      const q = search.toLowerCase();
      const matchSearch = !search || 
        b.id.toLowerCase().includes(q) || 
        (b.location || '').toLowerCase().includes(q) || 
        (b.area || '').toLowerCase().includes(q);
      
      const matchStatus = statusFilter === 'All' || b.status.toLowerCase() === statusFilter.toLowerCase();
      const matchArea = areaFilter === 'All' || b.area === areaFilter;
      return matchSearch && matchStatus && matchArea;
    });
  }, [bins, search, statusFilter, areaFilter]);

  const openViewDetails = async (bin) => {
    setSelectedBin(bin);
    setShowViewModal(true);
    try {
      const tel = await telemetryService.getTelemetryForBin(bin.id);
      setBinTelemetry(tel || []);
      const cols = await collectionService.getCollections();
      setBinCollections((cols || []).filter(c => c.binId === bin.id));
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (bin) => {
    setSelectedBin(bin);
    setFormData({
      id: bin.id,
      location: bin.location || '',
      area: bin.area || 'Commercial District',
      capacity: bin.capacity || 240,
      wasteType: bin.wasteType || 'General',
      batteryLevel: bin.batteryLevel || 90,
      fillLevel: bin.fillLevel || 0,
      status: bin.status || 'Normal'
    });
    setShowEditModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const newStatus = formData.fillLevel >= 80 ? 'Critical' : formData.fillLevel >= 60 ? 'High' : formData.fillLevel >= 35 ? 'Medium' : 'Normal';
      await binService.addBin({
        ...formData,
        status: newStatus,
        lastUpdated: 'Just now',
        collectionRequired: formData.fillLevel >= 75
      });
      setShowAddModal(false);
      triggerToast(`Bin ${formData.id || 'new bin'} successfully registered!`);
      await loadBins();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBin) return;
    try {
      const newStatus = formData.fillLevel >= 80 ? 'Critical' : formData.fillLevel >= 60 ? 'High' : formData.fillLevel >= 35 ? 'Medium' : 'Normal';
      await binService.updateBin(selectedBin.id, {
        ...formData,
        status: newStatus,
        lastUpdated: 'Just now',
        collectionRequired: formData.fillLevel >= 75
      });
      setShowEditModal(false);
      triggerToast(`Bin ${selectedBin.id} updated successfully!`);
      await loadBins();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to remove Bin ${id}?`)) {
      try {
        await binService.deleteBin(id);
        triggerToast(`Bin ${id} removed.`);
        await loadBins();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMarkForCollection = async (id) => {
    try {
      await binService.markForCollection(id);
      triggerToast(`Bin ${id} marked for immediate collection!`);
      await loadBins();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusVariant = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'warning';
      case 'normal': return 'success';
      case 'empty': return 'success';
      default: return 'secondary';
    }
  };

  const getFillColorClass = (level) => {
    if (level >= 80) return 'fill-critical';
    if (level >= 60) return 'fill-high';
    if (level >= 35) return 'fill-medium';
    return 'fill-normal';
  };

  return (
    <div className="page-container">
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 9999,
          background: 'var(--gray-900)', color: 'white', padding: '0.875rem 1.25rem',
          borderRadius: 'var(--border-radius-xs)', boxShadow: 'var(--shadow-xl)',
          display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'slideUp 0.2s ease',
          fontSize: '0.875rem'
        }}>
          <Zap size={18} style={{ color: 'var(--primary-light)' }} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Bin Monitoring</h1>
          <p>Real-time IoT bin fill-level telemetry & sensor analytics</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleRefreshTelemetry} title="Simulate telemetry pulse">
            <RefreshCw size={16} /> Refresh Telemetry
          </button>
          <button className="btn btn-primary" onClick={() => {
            setFormData({
              id: `BIN-0${bins.length + 1}`,
              location: '',
              area: 'Commercial District',
              capacity: 240,
              wasteType: 'General',
              batteryLevel: 98,
              fillLevel: 25,
              status: 'Normal'
            });
            setShowAddModal(true);
          }}>
            <Plus size={16} /> Add Bin
          </button>
        </div>
      </div>

      {/* Controls Toolbar */}
      <div className="toolbar">
        <div className="search-input">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search bins by ID, street, or zone..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Critical">Critical (80%+)</option>
          <option value="High">High (60-79%)</option>
          <option value="Medium">Medium (35-59%)</option>
          <option value="Normal">Normal (0-34%)</option>
        </select>

        <select className="filter-select" value={areaFilter} onChange={e => setAreaFilter(e.target.value)}>
          {uniqueAreas.map(area => (
            <option key={area} value={area}>{area === 'All' ? 'All Municipal Zones' : area}</option>
          ))}
        </select>

        <div style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--gray-500)' }}>
          Showing <strong>{filteredBins.length}</strong> of {bins.length} bins
        </div>
      </div>

      {/* Main Bins Table */}
      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bin ID</th>
                <th>Location</th>
                <th>Area / Zone</th>
                <th>Fill Level</th>
                <th>Status</th>
                <th>Battery</th>
                <th>Last Updated</th>
                <th>Collection Required</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBins.map(bin => {
                const isCritical = bin.fillLevel >= 80 || bin.status === 'Critical';
                const isReq = bin.collectionRequired || isCritical;

                return (
                  <tr key={bin.id} style={{ background: isCritical ? '#fff5f5' : 'inherit' }}>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{bin.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <MapPin size={14} style={{ color: 'var(--gray-400)' }} />
                        <span>{bin.location}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-600)', background: 'var(--gray-100)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {bin.area}
                      </span>
                    </td>
                    <td style={{ minWidth: '150px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="fill-level-bar" style={{ flex: 1, height: '8px' }}>
                          <div 
                            className={`fill ${getFillColorClass(bin.fillLevel)}`} 
                            style={{ width: `${bin.fillLevel}%` }}
                          />
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '36px' }}>
                          {bin.fillLevel}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <Badge variant={getStatusVariant(bin.status)}>
                        {bin.status}
                      </Badge>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: bin.batteryLevel < 30 ? 'var(--danger)' : 'var(--gray-600)' }}>
                        <Battery size={14} />
                        <span>{bin.batteryLevel || 92}%</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                      {bin.lastUpdated || '2 min ago'}
                    </td>
                    <td>
                      {isReq ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--danger)', fontWeight: 600, fontSize: '0.8rem' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--danger)' }}></span> Yes
                        </span>
                      ) : (
                        <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>No</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => openViewDetails(bin)}
                          title="View Telemetry & Details"
                        >
                          <Eye size={14} /> View
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => openEdit(bin)}
                          title="Edit Bin Configuration"
                        >
                          <Edit size={14} />
                        </button>
                        {isReq && (
                          <button 
                            className="btn btn-warning btn-sm" 
                            onClick={() => handleMarkForCollection(bin.id)}
                            title="Dispatch Collection"
                          >
                            <Truck size={14} />
                          </button>
                        )}
                        <button 
                          className="btn btn-danger btn-sm" 
                          onClick={() => handleDelete(bin.id)}
                          title="Delete Bin"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredBins.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--gray-400)' }}>
                    No bins match your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bin Details Modal */}
      <Modal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)} 
        title={`Bin Details: ${selectedBin?.id}`}
        size="lg"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <button className="btn btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
            <button className="btn btn-primary" onClick={() => {
              setShowViewModal(false);
              navigate('/admin/schedule');
            }}>
              <CalendarClock size={16} /> Schedule Pickup
            </button>
          </div>
        }
      >
        {selectedBin && (
          <div>
            {/* Header info */}
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem', background: 'var(--gray-50)', padding: '1rem', borderRadius: 'var(--border-radius-xs)' }}>
              <FillGauge percentage={selectedBin.fillLevel} size={110} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{selectedBin.id}</h3>
                  <Badge variant={getStatusVariant(selectedBin.status)}>{selectedBin.status}</Badge>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
                  <MapPin size={15} style={{ color: 'var(--primary)' }} /> {selectedBin.location} ({selectedBin.area})
                </p>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--gray-500)', flexWrap: 'wrap' }}>
                  <span>Capacity: <strong>{selectedBin.capacity || 240}L</strong></span>
                  <span>Waste: <strong>{selectedBin.wasteType || 'General'}</strong></span>
                  <span>Battery: <strong>{selectedBin.batteryLevel || 95}%</strong></span>
                  <span>Sensor: <strong>{selectedBin.sensorId || 'SNS-001'}</strong></span>
                </div>
              </div>
            </div>

            {/* Telemetry Chart */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Zap size={16} style={{ color: 'var(--primary)' }} /> 24-Hour IoT Fill-Level Telemetry
              </h4>
              <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--border-radius-xs)', padding: '1rem' }}>
                <LineChart 
                  data={binTelemetry.length > 0 ? binTelemetry.map((t, idx) => ({
                    label: `${idx}h`,
                    value: t.fillLevel
                  })) : [
                    { label: '0h', value: 20 }, { label: '4h', value: 35 }, { label: '8h', value: 50 },
                    { label: '12h', value: 65 }, { label: '16h', value: 80 }, { label: '20h', value: selectedBin.fillLevel }
                  ]}
                  height={180}
                  color="var(--primary)"
                />
              </div>
            </div>

            {/* Collection History */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Clock size={16} style={{ color: 'var(--primary)' }} /> Recent Collection Records
              </h4>
              {binCollections.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', background: 'var(--gray-50)', padding: '1rem', borderRadius: '4px' }}>
                  No historical collection records logged for this bin yet.
                </p>
              ) : (
                <table className="data-table" style={{ fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      <th>Record ID</th>
                      <th>Driver</th>
                      <th>Priority</th>
                      <th>Scheduled / Logged</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {binCollections.map(c => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 600 }}>{c.id}</td>
                        <td>{c.assignedDriver || 'Assigned Driver'}</td>
                        <td><Badge variant={c.priority === 'Critical' ? 'danger' : 'warning'}>{c.priority}</Badge></td>
                        <td>{c.scheduledTime || 'Recent'}</td>
                        <td><Badge variant={c.status === 'Completed' ? 'success' : 'info'}>{c.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Bin Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Register New IoT Bin">
        <form onSubmit={handleAddSubmit}>
          <div className="form-group">
            <label>Bin ID</label>
            <input 
              className="form-input" 
              required
              value={formData.id} 
              onChange={e => setFormData({ ...formData, id: e.target.value })} 
              placeholder="e.g. BIN-019"
            />
          </div>
          <div className="form-group">
            <label>Street Location</label>
            <input 
              className="form-input" 
              required
              value={formData.location} 
              onChange={e => setFormData({ ...formData, location: e.target.value })} 
              placeholder="e.g. 104 Civic Plaza"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Municipal Zone / Area</label>
              <select className="form-input" value={formData.area} onChange={e => setFormData({ ...formData, area: e.target.value })}>
                <option value="Commercial District">Commercial District</option>
                <option value="Market Square">Market Square</option>
                <option value="Residential North">Residential North</option>
                <option value="Residential South">Residential South</option>
                <option value="University Campus">University Campus</option>
                <option value="Waterfront">Waterfront</option>
                <option value="Industrial Zone">Industrial Zone</option>
              </select>
            </div>
            <div className="form-group">
              <label>Capacity (Liters)</label>
              <select className="form-input" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })}>
                <option value={120}>120 Liters</option>
                <option value={240}>240 Liters</option>
                <option value={360}>360 Liters</option>
                <option value={660}>660 Liters</option>
                <option value={1100}>1100 Liters</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Waste Stream</label>
              <select className="form-input" value={formData.wasteType} onChange={e => setFormData({ ...formData, wasteType: e.target.value })}>
                <option value="General">General Waste</option>
                <option value="Recyclable">Recyclables</option>
                <option value="Organic">Organic Waste</option>
                <option value="Hazardous">Hazardous Waste</option>
              </select>
            </div>
            <div className="form-group">
              <label>Initial Fill Level (%)</label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                className="form-input" 
                value={formData.fillLevel} 
                onChange={e => setFormData({ ...formData, fillLevel: Number(e.target.value) })}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Bin</button>
          </div>
        </form>
      </Modal>

      {/* Edit Bin Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title={`Edit Bin: ${selectedBin?.id}`}>
        <form onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label>Location</label>
            <input 
              className="form-input" 
              required
              value={formData.location} 
              onChange={e => setFormData({ ...formData, location: e.target.value })} 
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Municipal Zone</label>
              <select className="form-input" value={formData.area} onChange={e => setFormData({ ...formData, area: e.target.value })}>
                <option value="Commercial District">Commercial District</option>
                <option value="Market Square">Market Square</option>
                <option value="Residential North">Residential North</option>
                <option value="Residential South">Residential South</option>
                <option value="University Campus">University Campus</option>
                <option value="Waterfront">Waterfront</option>
                <option value="Industrial Zone">Industrial Zone</option>
              </select>
            </div>
            <div className="form-group">
              <label>Waste Type</label>
              <select className="form-input" value={formData.wasteType} onChange={e => setFormData({ ...formData, wasteType: e.target.value })}>
                <option value="General">General</option>
                <option value="Recyclable">Recyclable</option>
                <option value="Organic">Organic</option>
                <option value="Hazardous">Hazardous</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Fill Level (%)</label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                className="form-input" 
                value={formData.fillLevel} 
                onChange={e => setFormData({ ...formData, fillLevel: Number(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Battery Level (%)</label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                className="form-input" 
                value={formData.batteryLevel} 
                onChange={e => setFormData({ ...formData, batteryLevel: Number(e.target.value) })}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Update Bin</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
