import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { User, Mail, Phone, Shield, Building, Lock, Save, X, Edit, Key, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || 'Operations',
  });
  const [passwordData, setPasswordData] = useState({ current: '', newPass: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  const handleSaveProfile = () => {
    updateProfile({ ...formData });
    setEditing(false);
    setSaveSuccess('Profile updated successfully!');
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  const handleChangePassword = () => {
    setPasswordError('');
    setPasswordSuccess('');
    if (!passwordData.current || !passwordData.newPass || !passwordData.confirm) {
      setPasswordError('All fields are required');
      return;
    }
    if (passwordData.newPass.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (passwordData.newPass !== passwordData.confirm) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordData({ current: '', newPass: '', confirm: '' });
    setPasswordSuccess('Password changed successfully!');
    setTimeout(() => setPasswordSuccess(''), 3000);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your account settings</p>
      </div>

      {saveSuccess && (
        <div style={{ padding: '0.75rem 1rem', background: '#dcfce7', color: '#166534', borderRadius: 'var(--border-radius-xs)', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 500 }}>
          {saveSuccess}
        </div>
      )}

      <div className="grid-2">
        {/* Profile Info */}
        <div className="card">
          <div className="card-header">
            <h3>Profile Information</h3>
            {!editing && (
              <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
                <Edit size={14} /> Edit
              </button>
            )}
          </div>
          <div className="card-body">
            {!editing ? (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%', background: 'var(--primary)',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '2rem', margin: '0 auto 0.75rem',
                  }}>
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{user?.name}</h2>
                  <span className="badge badge-primary" style={{ marginTop: '0.5rem' }}>
                    {user?.role === 'admin' ? 'Administrator' : 'Driver'}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { icon: Mail, label: 'Email', value: user?.email },
                    { icon: Phone, label: 'Phone', value: user?.phone || 'Not set' },
                    { icon: Building, label: 'Department', value: user?.department || 'Operations' },
                    { icon: Shield, label: 'Role', value: user?.role === 'admin' ? 'Administrator' : 'Driver' },
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
                  <input className="form-input" value={formData.email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                  <p style={{ fontSize: '0.7rem', color: 'var(--gray-400)', marginTop: '0.25rem' }}>Email cannot be changed</p>
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input className="form-input" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="555-0100" />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input className="form-input" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button className="btn btn-primary" onClick={handleSaveProfile}><Save size={14} /> Save</button>
                  <button className="btn btn-secondary" onClick={() => setEditing(false)}><X size={14} /> Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Change Password */}
          <div className="card">
            <div className="card-header"><h3>Change Password</h3></div>
            <div className="card-body">
              {passwordError && (
                <div style={{ padding: '0.5rem 0.75rem', background: '#fee2e2', color: '#991b1b', borderRadius: 6, marginBottom: '0.75rem', fontSize: '0.8rem' }}>
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div style={{ padding: '0.5rem 0.75rem', background: '#dcfce7', color: '#166534', borderRadius: 6, marginBottom: '0.75rem', fontSize: '0.8rem' }}>
                  {passwordSuccess}
                </div>
              )}
              <div className="form-group">
                <label>Current Password</label>
                <input className="form-input" type="password" value={passwordData.current}
                  onChange={e => setPasswordData({ ...passwordData, current: e.target.value })} placeholder="Enter current password" />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input className="form-input" type="password" value={passwordData.newPass}
                  onChange={e => setPasswordData({ ...passwordData, newPass: e.target.value })} placeholder="Enter new password (min 6 chars)" />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input className="form-input" type="password" value={passwordData.confirm}
                  onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })} placeholder="Confirm new password" />
              </div>
              <button className="btn btn-primary" onClick={handleChangePassword}><Key size={14} /> Change Password</button>
            </div>
          </div>

          {/* Account Info */}
          <div className="card">
            <div className="card-header"><h3>Account Information</h3></div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Role</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{user?.role === 'admin' ? 'Administrator' : 'Driver'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Account Created</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>January 15, 2024</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Last Login</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
