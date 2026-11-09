import { useState, useEffect } from 'react';
import { driverService } from '../../services/driverService.js';
import { routeService } from '../../services/routeService.js';
import Modal from '../../components/common/Modal.jsx';
import Badge from '../../components/common/Badge.jsx';
import { Search, Plus, Eye, Edit, Route, Power, Star, User, Truck, Phone, Mail, Shield, X, MapPin } from 'lucide-react';

export default function DriverManagementPage() {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', vehicle: '', vehicleId: '', shift: 'Morning', licenseNumber: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    setLoading(true);
    try {
      const data = await driverService.getDrivers();
      setDrivers(data);
    } catch (err) {
      console.error('Failed to load drivers', err);
    }
    setLoading(false);
  };

  const filtered = drivers.filter(d => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAdd = async () => {
    try {
      await driverService.addDriver({
        ...formData,
        status: 'Available',
        active: true,
        rating: 4.0,
        completedCollections: 0,
        assignedRoute: null,
        joinedDate: new Date().toISOString(),
      });
      setShowAddModal(false);
      setFormData({ name: '', email: '', phone: '', vehicle: '', vehicleId: '', shift: 'Morning', licenseNumber: '' });
      loadDrivers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async () => {
    if (!selectedDriver) return;
    try {
      await driverService.updateDriver(selectedDriver.id, formData);
      setShowEditModal(false);
      setSelectedDriver(null);
      loadDrivers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await driverService.toggleActive(id);
      loadDrivers();
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (driver) => {
    setSelectedDriver(driver);
    setFormData({
      name: driver.name, email: driver.email, phone: driver.phone,
      vehicle: driver.vehicle, vehicleId: driver.vehicleId,
      shift: driver.shift, licenseNumber: driver.licenseNumber || '',
    });
    setShowEditModal(true);
  };

  const openView = (driver) => {
    setSelectedDriver(driver);
    setShowViewModal(true);
  };

  const statusBadge = (status) => {
    const map = { 'Available': 'success', 'On Route': 'warning', 'Off Duty': 'secondary' };
    return <Badge variant={map[status] || 'secondary'}>{status}</Badge>;
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
      <span style={{ color: '#f59e0b', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
        {Array.from({ length: full }, (_, i) => <Star key={i} size={14} fill="#f59e0b" />)}
        {half && <Star size={14} fill="#f59e0b" style={{ clipPath: 'inset(0 50% 0 0)' }} />}
        <span style={{ color: 'var(--gray-600)', fontSize: '0.8rem', marginLeft: 4 }}>{rating.toFixed(1)}</span>
      </span>
    );
  };

  const formFields = (
    <>
      <div className="form-group">
        <label>Full Name</label>
        <input className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter full name" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Email</label>
          <input className="form-input" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="driver@ecoclean.com" />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input className="form-input" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="555-0200" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Vehicle</label>
          <input className="form-input" value={formData.vehicle} onChange={e => setFormData({ ...formData, vehicle: e.target.value })} placeholder="Truck #T-107 (Ford F-650)" />
        </div>
        <div className="form-group">
          <label>Vehicle ID</label>
          <input className="form-input" value={formData.vehicleId} onChange={e => setFormData({ ...formData, vehicleId: e.target.value })} placeholder="VH-007" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Shift</label>
          <select className="form-input" value={formData.shift} onChange={e => setFormData({ ...formData, shift: e.target.value })}>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Night">Night</option>
          </select>
        </div>
        <div className="form-group">
          <label>License Number</label>
          <input className="form-input" value={formData.licenseNumber} onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })} placeholder="CDL-XXXXXX" />
        </div>
      </div>
    </>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Driver Management</h1>
        <p>Manage collection drivers and vehicle assignments</p>
      </div>

      <div className="toolbar">
        <div className="search-input">
          <Search size={16} />
          <input type="text" placeholder="Search drivers..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Available">Available</option>
          <option value="On Route">On Route</option>
          <option value="Off Duty">Off Duty</option>
        </select>
        <button className="btn btn-primary" onClick={() => { setFormData({ name: '', email: '', phone: '', vehicle: '', vehicleId: '', shift: 'Morning', licenseNumber: '' }); setShowAddModal(true); }}>
          <Plus size={16} /> Add Driver
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Driver ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Completed</th>
                <th>Rating</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(driver => (
                <tr key={driver.id}>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{driver.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', background: 'var(--primary-100)',
                        color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 600, fontSize: '0.8rem', flexShrink: 0,
                      }}>
                        {driver.name.charAt(0)}
                      </div>
                      {driver.name}
                    </div>
                  </td>
                  <td>{driver.email}</td>
                  <td>{driver.phone}</td>
                  <td style={{ fontSize: '0.8rem' }}>{driver.vehicle}</td>
                  <td>{statusBadge(driver.status)}</td>
                  <td>{driver.completedCollections}</td>
                  <td>{renderStars(driver.rating)}</td>
                  <td>
                    <span style={{
                      display: 'inline-block', width: 10, height: 10, borderRadius: '50%',
                      background: driver.active ? 'var(--success)' : 'var(--gray-300)',
                    }} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openView(driver)} title="View"><Eye size={14} /></button>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(driver)} title="Edit"><Edit size={14} /></button>
                      <button
                        className={`btn btn-sm ${driver.active ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleToggleActive(driver.id)}
                        title={driver.active ? 'Deactivate' : 'Activate'}
                      >
                        <Power size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="text-center" style={{ padding: '2rem', color: 'var(--gray-400)' }}>No drivers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Driver"
        footer={<><button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleAdd}>Add Driver</button></>}>
        {formFields}
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Driver"
        footer={<><button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleEdit}>Save Changes</button></>}>
        {formFields}
      </Modal>

      {/* View Modal */}
      <Modal isOpen={showViewModal} onClose={() => { setShowViewModal(false); setSelectedDriver(null); }} title="Driver Details" size="lg">
        {selectedDriver && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%', background: 'var(--primary)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '1.5rem', margin: '0 auto 0.75rem',
              }}>
                {selectedDriver.name.charAt(0)}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{selectedDriver.name}</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>{selectedDriver.id}</p>
              {statusBadge(selectedDriver.status)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { icon: Mail, label: 'Email', value: selectedDriver.email },
                { icon: Phone, label: 'Phone', value: selectedDriver.phone },
                { icon: Truck, label: 'Vehicle', value: selectedDriver.vehicle },
                { icon: Shield, label: 'License', value: selectedDriver.licenseNumber || 'N/A' },
                { icon: MapPin, label: 'Shift', value: selectedDriver.shift },
                { icon: Star, label: 'Rating', value: selectedDriver.rating?.toFixed(1) },
                { icon: Route, label: 'Assigned Route', value: selectedDriver.assignedRoute || 'None' },
                { icon: User, label: 'Collections', value: selectedDriver.completedCollections },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--gray-50)', borderRadius: 'var(--border-radius-xs)' }}>
                  <item.icon size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>{item.label}</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
