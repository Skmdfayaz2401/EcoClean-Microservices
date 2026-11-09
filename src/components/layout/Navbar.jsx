import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { Menu, Bell, Search, User, LogOut, ChevronDown } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ onMenuToggle }) {
  const { user, logout, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const basePath = isAdmin ? '/admin' : '/driver';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="navbar-menu-btn" onClick={onMenuToggle} aria-label="Toggle navigation menu">
          <Menu size={22} />
        </button>
        <div className="navbar-search">
          <Search size={16} />
          <input type="text" placeholder="Search bins, drivers, routes..." />
        </div>
      </div>

      <div className="navbar-right">
        <button
          className="navbar-icon-btn"
          onClick={() => navigate(`${basePath}/notifications`)}
          aria-label="View notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
          )}
        </button>

        <div className="navbar-user" ref={menuRef}>
          <button
            className="navbar-user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-expanded={showUserMenu}
          >
            <div className="navbar-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="navbar-user-info">
              <span className="navbar-user-name">{user?.name}</span>
              <span className="navbar-user-role">{user?.role === 'admin' ? 'Administrator' : 'Driver'}</span>
            </div>
            <ChevronDown size={16} />
          </button>

          {showUserMenu && (
            <div className="navbar-dropdown">
              <button onClick={() => { navigate(`${basePath}/profile`); setShowUserMenu(false); }}>
                <User size={16} />
                <span>Profile</span>
              </button>
              <button onClick={handleLogout}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
