import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  LayoutDashboard, Trash2, ClipboardList, CalendarClock,
  Route, Users, BarChart3, Bell, User, LogOut, Recycle, X
} from 'lucide-react';
import './Sidebar.css';

const adminNav = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/bins', label: 'Bin Monitoring', icon: Trash2 },
  { path: '/admin/collections', label: 'Collections', icon: ClipboardList },
  { path: '/admin/schedule', label: 'Pickup Schedule', icon: CalendarClock },
  { path: '/admin/routes', label: 'Route Optimization', icon: Route },
  { path: '/admin/drivers', label: 'Drivers', icon: Users },
  { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { path: '/admin/notifications', label: 'Notifications', icon: Bell },
  { path: '/admin/profile', label: 'Profile', icon: User },
];

const driverNav = [
  { path: '/driver/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/driver/collections', label: 'My Collections', icon: ClipboardList },
  { path: '/driver/routes', label: 'My Routes', icon: Route },
  { path: '/driver/profile', label: 'Profile', icon: User },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout, isAdmin } = useAuth();
  const navItems = isAdmin ? adminNav : driverNav;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <Recycle size={24} />
            </div>
            <div>
              <h1>EcoClean</h1>
              <p>Smart Waste Management</p>
            </div>
          </div>
          <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{user?.name}</p>
              <p className="sidebar-user-role">{user?.role === 'admin' ? 'Administrator' : 'Driver'}</p>
            </div>
          </div>
          <button className="sidebar-logout" onClick={logout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
