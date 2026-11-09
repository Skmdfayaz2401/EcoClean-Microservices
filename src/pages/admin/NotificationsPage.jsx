import { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext.jsx';
import Badge from '../../components/common/Badge.jsx';
import {
  Bell, AlertTriangle, AlertCircle, Info, CheckCircle, Check, Trash2, Filter, Clock,
} from 'lucide-react';

const typeConfig = {
  critical: { icon: AlertTriangle, color: 'var(--danger)', bg: '#fee2e2', variant: 'danger' },
  warning: { icon: AlertCircle, color: 'var(--warning)', bg: '#fef3c7', variant: 'warning' },
  info: { icon: Info, color: 'var(--info)', bg: '#dbeafe', variant: 'info' },
  success: { icon: CheckCircle, color: 'var(--success)', bg: '#dcfce7', variant: 'success' },
};

function timeAgo(timestamp) {
  const now = new Date();
  const t = new Date(timestamp);
  const diff = Math.floor((now - t) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return t.toLocaleDateString();
}

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, clearNotifications, unreadCount } = useNotifications();
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = typeFilter === 'All'
    ? notifications
    : notifications.filter(n => n.type === typeFilter.toLowerCase());

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Notifications</h1>
        <p>System alerts and activity notifications</p>
      </div>

      <div className="toolbar">
        <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="All">All Types</option>
          <option value="Critical">Critical</option>
          <option value="Warning">Warning</option>
          <option value="Info">Info</option>
          <option value="Success">Success</option>
        </select>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>{unreadCount} unread</span>
        <button className="btn btn-secondary btn-sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
          <Check size={14} /> Mark All Read
        </button>
        <button className="btn btn-danger btn-sm" onClick={clearNotifications} disabled={notifications.length === 0}>
          <Trash2 size={14} /> Clear All
        </button>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <Bell size={48} />
            <h3>No notifications</h3>
            <p>You're all caught up!</p>
          </div>
        ) : (
          filtered.map(notif => {
            const config = typeConfig[notif.type] || typeConfig.info;
            const Icon = config.icon;
            return (
              <div
                key={notif.id}
                className={`notification-item ${!notif.read ? 'unread' : ''}`}
                onClick={() => markAsRead(notif.id)}
                style={{ position: 'relative' }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', background: config.bg,
                  color: config.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-800)' }}>{notif.title}</h4>
                    <Badge variant={config.variant}>{notif.type}</Badge>
                    {notif.category && <Badge variant="secondary">{notif.category}</Badge>}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-600)', lineHeight: 1.4 }}>{notif.message}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--gray-400)', marginTop: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} /> {timeAgo(notif.timestamp)}
                  </p>
                </div>
                {!notif.read && (
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)',
                    flexShrink: 0, marginTop: '0.5rem',
                  }} />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
