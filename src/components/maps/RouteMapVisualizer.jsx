import { MapPin, Flag, Navigation } from 'lucide-react';

export default function RouteMapVisualizer({ stops = [], height = 350 }) {
  if (stops.length === 0) {
    return (
      <div className="empty-state" style={{ height }}>
        <MapPin size={40} />
        <h3>No route to display</h3>
        <p>Generate an optimized route to see the visualization</p>
      </div>
    );
  }

  const padding = 60;
  const width = 700;
  const mapHeight = height;
  
  // Generate positions in a route-like pattern
  const positions = stops.map((_, i) => {
    const angle = (i / stops.length) * Math.PI * 1.5 - Math.PI / 4;
    const radiusX = (width - padding * 2) / 2.8;
    const radiusY = (mapHeight - padding * 2) / 2.8;
    return {
      x: width / 2 + radiusX * Math.cos(angle),
      y: mapHeight / 2 + radiusY * Math.sin(angle),
    };
  });

  // Depot position
  const depot = { x: width / 2, y: mapHeight - padding + 10 };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Collected': return 'var(--success)';
      case 'Skipped': return 'var(--gray-400)';
      default: return 'var(--warning)';
    }
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto', background: 'var(--gray-50)', borderRadius: 'var(--border-radius)', border: '1px solid var(--gray-200)' }}>
      <svg width="100%" height={mapHeight} viewBox={`0 0 ${width} ${mapHeight}`} preserveAspectRatio="xMidYMid meet">
        {/* Background grid */}
        {Array.from({ length: 20 }, (_, i) => (
          <g key={`grid-${i}`}>
            <line x1={i * 40} y1={0} x2={i * 40} y2={mapHeight} stroke="var(--gray-200)" strokeWidth="0.5" opacity="0.5" />
            <line x1={0} y1={i * 40} x2={width} y2={i * 40} stroke="var(--gray-200)" strokeWidth="0.5" opacity="0.5" />
          </g>
        ))}

        {/* Route lines from depot to first stop */}
        <line x1={depot.x} y1={depot.y} x2={positions[0].x} y2={positions[0].y} stroke="var(--primary)" strokeWidth="2.5" strokeDasharray="8 4" opacity="0.6" />

        {/* Route lines between stops */}
        {positions.map((pos, i) => {
          if (i === positions.length - 1) return null;
          return (
            <line key={`line-${i}`} x1={pos.x} y1={pos.y} x2={positions[i + 1].x} y2={positions[i + 1].y}
              stroke="var(--primary)" strokeWidth="2.5" strokeDasharray="8 4" opacity="0.6" />
          );
        })}

        {/* Return line from last stop to depot */}
        {positions.length > 0 && (
          <line x1={positions[positions.length - 1].x} y1={positions[positions.length - 1].y}
            x2={depot.x} y2={depot.y} stroke="var(--gray-400)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
        )}

        {/* Depot */}
        <g>
          <circle cx={depot.x} cy={depot.y} r={18} fill="var(--primary-dark)" />
          <text x={depot.x} y={depot.y + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="10" fontWeight="700">DEPOT</text>
        </g>

        {/* Stops */}
        {positions.map((pos, i) => {
          const stop = stops[i];
          const color = getStatusColor(stop.status);
          return (
            <g key={`stop-${i}`}>
              <circle cx={pos.x} cy={pos.y} r={22} fill="white" stroke={color} strokeWidth="3" />
              <text x={pos.x} y={pos.y - 2} textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="700" fill="var(--gray-800)">
                {i + 1}
              </text>
              <text x={pos.x} y={pos.y + 10} textAnchor="middle" fontSize="7" fill={color} fontWeight="600">
                {stop.fillLevel}%
              </text>
              <text x={pos.x} y={pos.y + 35} textAnchor="middle" fontSize="9" fill="var(--gray-600)" fontWeight="500">
                {stop.binId}
              </text>
              <text x={pos.x} y={pos.y + 46} textAnchor="middle" fontSize="8" fill="var(--gray-400)">
                {stop.area || stop.location?.split(',')[0] || ''}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
