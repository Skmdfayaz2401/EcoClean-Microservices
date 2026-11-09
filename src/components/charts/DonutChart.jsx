export default function DonutChart({ data = [], size = 200 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = 70;
  const cx = size / 2;
  const cy = size / 2;
  let cumulativePercent = 0;

  const getCoordinates = (percent) => {
    const x = cx + radius * Math.cos(2 * Math.PI * percent - Math.PI / 2);
    const y = cy + radius * Math.sin(2 * Math.PI * percent - Math.PI / 2);
    return { x, y };
  };

  const segments = data.map((d, i) => {
    const percent = d.value / total;
    const startPercent = cumulativePercent;
    cumulativePercent += percent;
    const start = getCoordinates(startPercent);
    const end = getCoordinates(cumulativePercent);
    const largeArc = percent > 0.5 ? 1 : 0;
    const pathD = [
      `M ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    ].join(' ');
    return (
      <path
        key={i}
        d={pathD}
        fill="none"
        stroke={d.color}
        strokeWidth="28"
        strokeLinecap="butt"
      />
    );
  });

  return (
    <div>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {total > 0 ? segments : (
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--gray-200)" strokeWidth="28" />
        )}
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize="24" fontWeight="700" fill="var(--gray-800)">
          {total}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="12" fill="var(--gray-500)">
          Total
        </text>
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.75rem', justifyContent: 'center' }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, display: 'inline-block' }} />
            <span style={{ color: 'var(--gray-600)' }}>{d.label}: {d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
