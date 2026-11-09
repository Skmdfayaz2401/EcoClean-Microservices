export default function LineChart({ data = [], height = 200, color = 'var(--primary)', label = 'Value' }) {
  if (data.length === 0) return null;
  
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 600;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const values = data.map(d => d.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  
  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1 || 1)) * chartWidth,
    y: padding.top + chartHeight - ((d.value - min) / range) * chartHeight,
  }));
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = pathD + ` L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;
  
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
          const y = padding.top + chartHeight * (1 - frac);
          const val = Math.round(min + range * frac);
          return (
            <g key={i}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="var(--gray-200)" strokeDasharray="4" />
              <text x={padding.left - 5} y={y + 4} textAnchor="end" fontSize="10" fill="var(--gray-400)">{val}</text>
            </g>
          );
        })}
        {/* Area */}
        <path d={areaD} fill={color} opacity="0.1" />
        {/* Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />
        ))}
        {/* X labels */}
        {data.map((d, i) => {
          if (data.length > 12 && i % Math.ceil(data.length / 8) !== 0) return null;
          return (
            <text key={i} x={points[i].x} y={height - 5} textAnchor="middle" fontSize="9" fill="var(--gray-400)">
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
