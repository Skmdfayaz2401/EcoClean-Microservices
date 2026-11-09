import { useState } from 'react';
import { User, Mail, Phone, Truck, Shield, Star, Lock, Save, Edit, Award, Calendar, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function DriverProfilePage() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'James Wilson',
    email: user?.email || 'driver@ecoclean.com',
    phone: user?.phone || '555-0201',
    vehicle: user?.vehicle || 'Truck #T-101 (Ford F-650)',
    shift: user?.shift || 'Morning',
  });
  const [passwordData, setPasswordData] = useState({ current: '', newPass: '', confirm: '' });
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSaveProfile = () => {
    updateProfile({ ...formData });
    setEditing(false);
    triggerToast('Profile updated successfully!');
  };

  const handleChangePassword = () => {
    if (!passwordData.current || !passwordData.newPass || !passwordData.confirm) {
      alert('All password fields are required');
      return;
    }
    if (passwordData.newPass !== passwordData.confirm) {
      alert('Passwords do not match');
      return;
    }
    setPasswordData({ current: '', newPass: '', confirm: '' });
    triggerToast('Password updated successfully!');
  };

  return (
    <div className="page-container">
      {/* Toast Alert */}
      {toastMsg && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 9999,
          background: 'var(--primary-dark)', color: 'white', padding: '0.875rem 1.25rem',
          borderRadius: 'var(--border-radius-xs)', boxShadow: 'var(--shadow-xl)',
          display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'slideUp 0.2s ease',
          fontSize: '0.875rem'
        }}>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <h1>Driver Profile</h1>
        <p>Manage your driver credentials, assigned vehicle specifications, and shift settings</p>
      </div>

      <div className="grid-2">
        {/* Profile Card */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Personnel Profile</h3>
            {!editing && (
              <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
                <Edit size={14} /> Edit Contact
              </button>
            )}
          </div>
          <div className="card-body">
            {!editing ? (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%', background: 'var(--primary)',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '1.75rem', margin: '0 auto 0.75rem',
                  }}>
                    {user?.name?.charAt(0) || 'D'}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{user?.name || 'James Wilson'}</h3>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>Driver ID: {user?.driverId || 'DRV-001'}</p>
                  <div style={{ marginTop: '0.5rem' }}>
                    <span className="badge badge-primary">Active Fleet Personnel</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { icon: Mail, label: 'Email', value: user?.email || 'driver@ecoclean.com' },
                    { icon: Phone, label: 'Phone', value: user?.phone || '555-0201' },
                    { icon: Truck, label: 'Assigned Vehicle', value: user?.vehicle || 'Truck #T-101 (Ford F-650)' },
                    { icon: Shield, label: 'Shift Schedule', value: `${user?.shift || 'Morning'} (06:00 - 14:00)` },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.75rem', background: 'var(--gray-50)', borderRadius: 'var(--border-radius-xs)',
                    }}>
                      <item.icon size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>{item.label}</p>
                        <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="form-group">
                  <label>Full Name</label>
                  <input className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input className="form-input" value={formData.email} disabled style={{ opacity: 0.6 }} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input className="form-input" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button className="btn btn-primary" onClick={handleSaveProfile}><Save size={14} /> Save</button>
                  <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Change Password & Performance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Security */}
          <div className="card">
            <div className="card-header">
              <h3>Security & Password</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Current Password</label>
                <input className="form-input" type="password" value={passwordData.current} onChange={e => setPasswordData({ ...passwordData, current: e.target.value })} placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input className="form-input" type="password" value={passwordData.newPass} onChange={e => setPasswordData({ ...passwordData, newPass: e.target.value })} placeholder="New password" />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input className="form-input" type="password" value={passwordData.confirm} onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })} placeholder="Confirm password" />
              </div>
              <button className="btn btn-primary" onClick={handleChangePassword}>
                <Key size={14} /> Update Password
              </button>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="card">
            <div className="card-header">
              <h3>Driver Performance Summary</h3>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center' }}>
                <div style={{ padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--border-radius-xs)' }}>
                  <Award size={24} style={{ color: '#f59e0b', margin: '0 auto 0.25rem' }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Rating</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>4.9 / 5.0</p>
                </div>
                <div style={{ padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--border-radius-xs)' }}>
                  <CheckCircle size={24} style={{ color: 'var(--success)', margin: '0 auto 0.25rem' }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Completed Pickups</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>184</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
