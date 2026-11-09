const variants = {
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  info: 'badge-info',
  secondary: 'badge-secondary',
  primary: 'badge-primary',
};

export default function Badge({ children, variant = 'secondary', dot = false }) {
  return (
    <span className={`badge ${variants[variant] || 'badge-secondary'}`}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />}
      {children}
    </span>
  );
}
