export default function FillGauge({ percentage = 0, size = 120, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  const getColor = (pct) => {
    if (pct <= 15) return 'var(--fill-empty)';
    if (pct <= 40) return 'var(--fill-normal)';
    if (pct <= 60) return 'var(--fill-medium)';
    if (pct <= 80) return 'var(--fill-high)';
    return 'var(--fill-critical)';
  };

  const color = getColor(percentage);

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--gray-200)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div style={{
        position: 'relative',
        marginTop: -size / 2 - 15,
        marginBottom: size / 2 - 15,
        textAlign: 'center',
      }}>
        <span style={{ fontSize: size / 4, fontWeight: 700, color }}>{percentage}%</span>
      </div>
    </div>
  );
}
