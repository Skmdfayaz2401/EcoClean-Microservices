import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Route, MapPin, Clock, Navigation, ChevronRight, Truck, Fuel, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { routeService } from '../../services/routeService.js';
import Badge from '../../components/common/Badge.jsx';

export default function DriverRoutesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const allRoutes = await routeService.getRoutes();
      const driverId = user?.driverId || 'DRV-001';
      const driverName = user?.name || 'James Wilson';
      
      let myRoutes = (allRoutes || []).filter(r => r.driverId === driverId || r.driverName === driverName);
      if (myRoutes.length === 0) {
        myRoutes = allRoutes || [];
      }
      setRoutes(myRoutes);
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p style={{ color: 'var(--gray-500)' }}>Loading assigned routes...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1>My Routes</h1>
        <p>View your assigned collection routes, turn-by-turn waypoints, and circuit progress</p>
      </div>

      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {routes.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <Route size={48} style={{ margin: '0 auto 1rem', color: 'var(--gray-300)' }} />
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No Routes Currently Assigned</h3>
            <p style={{ color: 'var(--gray-500)' }}>Dispatch has not assigned a route sequence to your schedule yet.</p>
          </div>
        ) : (
          routes.map(route => (
            <div key={route.id} className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--primary-50)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Route size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Route {route.id}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Vehicle: {route.vehicle || 'Truck #T-101'}</p>
                  </div>
                </div>

                <Badge variant={route.status === 'Completed' ? 'success' : route.status === 'In-Progress' ? 'info' : 'warning'}>
                  {route.status}
                </Badge>
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Stops</p>
                    <p style={{ fontWeight: 700, fontSize: '1.125rem' }}>{route.stops?.length || 4} Locations</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Total Distance</p>
                    <p style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--primary)' }}>{route.totalDistance} km</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Est. Duration</p>
                    <p style={{ fontWeight: 700, fontSize: '1.125rem' }}>{route.estimatedDuration} min</p>
                  </div>
                </div>

                <button className="btn btn-primary" onClick={() => navigate(`/driver/routes/${route.id}`)}>
                  Open Route Checklist <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
