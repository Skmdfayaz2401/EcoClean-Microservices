import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Truck, CheckCircle, SkipForward, Navigation, Flag, Sparkles } from 'lucide-react';
import { routeService } from '../../services/routeService.js';
import RouteMapVisualizer from '../../components/maps/RouteMapVisualizer.jsx';
import Badge from '../../components/common/Badge.jsx';

export default function DriverRouteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    loadRoute();
  }, [id]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

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

  const handleStopStatusChange = async (stopNumber, status) => {
    try {
      await routeService.updateStopStatus(id, stopNumber, status);
      triggerToast(`Stop #${stopNumber} updated to ${status}.`);
      await loadRoute();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p style={{ color: 'var(--gray-500)' }}>Loading route navigation...</p>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--danger)' }}>Route Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/driver/routes')}>
          <ArrowLeft size={16} /> Back to My Routes
        </button>
      </div>
    );
  }

  const stops = route.stops || [];
  const completedStops = stops.filter(s => s.status === 'Collected').length;

  return (
    <div className="page-container">
      {/* Toast Alert */}
      {toastMsg && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 9999,
          background: 'var(--gray-900)', color: 'white', padding: '1rem 1.25rem',
          borderRadius: 'var(--border-radius-xs)', boxShadow: 'var(--shadow-xl)',
          display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'slideUp 0.2s ease',
          fontSize: '0.875rem'
        }}>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary btn-icon" onClick={() => navigate('/driver/routes')}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Route {route.id}</h1>
            <Badge variant={route.status === 'Completed' ? 'success' : 'info'}>
              {route.status}
            </Badge>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
            Vehicle: <strong>{route.vehicle}</strong> • Progress: <strong>{completedStops} / {stops.length} stops collected</strong>
          </p>
        </div>
      </div>

      {/* Route Map */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h3>Turn-by-Turn Circuit Map</h3>
        </div>
        <div className="card-body">
          <RouteMapVisualizer stops={stops} height={220} />
        </div>
      </div>

      {/* Stop Checklist */}
      <div className="card">
        <div className="card-header">
          <h3>Sequential Collection Checklist</h3>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sequence</th>
                  <th>Bin ID</th>
                  <th>Location</th>
                  <th>Fill Level</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stops.map(stop => (
                  <tr key={stop.stopNumber}>
                    <td style={{ fontWeight: 700 }}>Stop #{stop.stopNumber}</td>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{stop.binId}</td>
                    <td>{stop.location}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: stop.fillLevel >= 80 ? 'var(--danger)' : 'var(--warning)' }}>
                        {stop.fillLevel}%
                      </span>
                    </td>
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
                        >
                          <CheckCircle size={14} /> Collected
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => handleStopStatusChange(stop.stopNumber, 'Skipped')}
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
