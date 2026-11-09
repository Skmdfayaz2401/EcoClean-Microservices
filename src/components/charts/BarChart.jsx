export default function BarChart({ data = [], height = 200, barColor = 'var(--primary)' }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const barWidth = Math.min(40, (100 / data.length) * 0.6);
  
  return (
    <div style={{ width: '100%' }}>
      <svg width="100%" height={height + 30} viewBox={`0 0 ${data.length * 60 + 20} ${height + 30}`} style={{ overflow: 'visible' }}>
        {data.map((d, i) => {
          const barHeight = (d.value / max) * (height - 20);
          const x = i * 60 + 20;
          const y = height - barHeight;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={4}
                fill={d.color || barColor}
                opacity={0.85}
              />
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill="var(--gray-600)"
              >
                {d.value}
              </text>
              <text
                x={x + barWidth / 2}
                y={height + 15}
                textAnchor="middle"
                fontSize="10"
                fill="var(--gray-500)"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
