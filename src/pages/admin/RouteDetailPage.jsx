import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Truck, Clock, Fuel, Leaf, 
  Play, Pause, CheckCircle, RotateCcw, Navigation, Flag, Sparkles
} from 'lucide-react';
import { routeService } from '../../services/routeService.js';
import RouteMapVisualizer from '../../components/maps/RouteMapVisualizer.jsx';
import Badge from '../../components/common/Badge.jsx';

export default function RouteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoute();
  }, [id]);

  const loadRoute = async () => {
    setLoading(true);
    try {
      const allRoutes = await routeService.getRoutes();
      const found = (allRoutes || []).find(r => r.id === id);
      setRoute(found || null);
    } catch (err) {
      console.error('Error loading route:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await routeService.updateRouteStatus(id, newStatus);
      await loadRoute();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStopStatusChange = async (stopNumber, status) => {
    try {
      await routeService.updateStopStatus(id, stopNumber, status);
      await loadRoute();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p style={{ color: 'var(--gray-500)' }}>Loading route details...</p>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--danger)' }}>Route Not Found</h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>The requested route ID "{id}" could not be located.</p>
        <button className="btn btn-primary" onClick={() => navigate('/admin/routes')}>
          <ArrowLeft size={16} /> Back to Routes
        </button>
      </div>
    );
  }

  const stops = route.stops || [];
  const completedStops = stops.filter(s => s.status === 'Collected').length;

  return (
    <div className="page-container">
      {/* Back button & Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-secondary btn-icon" onClick={() => navigate('/admin/routes')} title="Back to Routes">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Route {route.id}</h1>
              <Badge variant={route.status === 'Completed' ? 'success' : route.status === 'In-Progress' ? 'info' : 'warning'}>
                {route.status}
              </Badge>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
              Driver: <strong>{route.driverName}</strong> • Vehicle: <strong>{route.vehicle}</strong> • Date: {route.date}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {route.status !== 'In-Progress' && route.status !== 'Completed' && (
            <button className="btn btn-success" onClick={() => handleStatusChange('In-Progress')}>
              <Play size={16} /> Start Route
            </button>
          )}
          {route.status === 'In-Progress' && (
            <>
              <button className="btn btn-warning" onClick={() => handleStatusChange('Paused')}>
                <Pause size={16} /> Pause Route
              </button>
              <button className="btn btn-success" onClick={() => handleStatusChange('Completed')}>
                <CheckCircle size={16} /> Complete Route
              </button>
            </>
          )}
          <button className="btn btn-secondary" onClick={() => handleStatusChange('Optimized')}>
            <RotateCcw size={16} /> Re-Optimize
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Total Distance</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{route.totalDistance} km</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Optimized circuit</p>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Est. Duration</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{route.estimatedDuration} min</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Including stop times</p>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Efficiency Score</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>{route.optimizationScore || 94}%</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Fuel savings: {route.fuelSaved || '3.2'} L</p>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Collection Progress</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{completedStops} / {stops.length}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Stops collected</p>
        </div>
      </div>

      {/* Route Visualizer Map */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h3>Visual Collection Circuit</h3>
        </div>
        <div className="card-body">
          <RouteMapVisualizer stops={stops} height={240} />
        </div>
      </div>

      {/* Stop Sequence Table */}
      <div className="card">
        <div className="card-header">
          <h3>Stop-by-Stop Dispatch Checklist</h3>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Stop #</th>
                  <th>Bin ID</th>
                  <th>Location</th>
                  <th>Area / Zone</th>
                  <th>Fill Level</th>
                  <th>Est. Arrival</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stops.map(stop => (
                  <tr key={stop.stopNumber}>
                    <td style={{ fontWeight: 700 }}>#{stop.stopNumber}</td>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{stop.binId}</td>
                    <td>{stop.location}</td>
                    <td>{stop.area || 'Commercial'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="fill-level-bar" style={{ width: '50px', height: '6px' }}>
                          <div 
                            className={`fill ${stop.fillLevel >= 80 ? 'fill-critical' : 'fill-high'}`} 
                            style={{ width: `${stop.fillLevel}%` }}
                          />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{stop.fillLevel}%</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{stop.estimatedArrival || '09:30 AM'}</td>
                    <td>
                      <Badge variant={stop.status === 'Collected' ? 'success' : stop.status === 'Skipped' ? 'danger' : 'warning'}>
                        {stop.status || 'Pending'}
                      </Badge>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button 
                          className="btn btn-success btn-sm" 
                          onClick={() => handleStopStatusChange(stop.stopNumber, 'Collected')}
                          title="Mark Collected"
                        >
                          <CheckCircle size={14} /> Collected
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => handleStopStatusChange(stop.stopNumber, 'Skipped')}
                          title="Skip Stop"
                        >
                          Skip
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
