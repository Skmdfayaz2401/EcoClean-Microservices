export default function StatCard({ icon: Icon, title, value, trend, trendUp, color = 'var(--primary)' }) {
  const bgColor = color + '15'; // alpha
  
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: bgColor, color }}>
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <h3 style={{ color }}>{value}</h3>
        <p>{title}</p>
        {trend && (
          <span className="stat-trend" style={{ color: trendUp ? 'var(--success)' : 'var(--danger)' }}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
    </div>
  );
}
