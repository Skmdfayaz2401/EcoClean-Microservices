import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trash2, AlertTriangle, AlertCircle, CalendarClock, Users, 
  CheckCircle, Clock, Activity, TrendingUp, Truck, MapPin, ArrowRight, ShieldAlert, Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import Badge from '../../components/common/Badge.jsx';
import DonutChart from '../../components/charts/DonutChart.jsx';
import BarChart from '../../components/charts/BarChart.jsx';
import { binService } from '../../services/binService.js';
import { collectionService } from '../../services/collectionService.js';
import { driverService } from '../../services/driverService.js';
import { routeService } from '../../services/routeService.js';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [bins, setBins] = useState([]);
  const [collections, setCollections] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [binsData, collectionsData, driversData, routesData] = await Promise.all([
        binService.getBins().catch(() => []),
        collectionService.getCollections().catch(() => []),
        driverService.getDrivers().catch(() => []),
        routeService.getRoutes().catch(() => [])
      ]);

      setBins(binsData || []);
      setCollections(collectionsData || []);
      setDrivers(driversData || []);
      setRoutes(routesData || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculations
  const totalBins = bins.length;
  const criticalBins = bins.filter(b => b.fillLevel >= 80 || b.status === 'Critical').length;
  const pendingPickups = collections.filter(c => c.status === 'Pending').length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysCollections = collections.filter(c => (c.scheduledTime || '').startsWith(todayStr) || c.status === 'Assigned' || c.status === 'In-Progress').length;
  const activeDrivers = drivers.filter(d => d.active && d.status !== 'Off Duty').length;
  const completedCollections = collections.filter(c => c.status === 'Completed').length;

  // Fill level distribution data for DonutChart
  const emptyCount = bins.filter(b => b.fillLevel <= 20 || b.status === 'Empty').length;
  const normalCount = bins.filter(b => (b.fillLevel > 20 && b.fillLevel <= 50) || b.status === 'Normal').length;
  const mediumCount = bins.filter(b => (b.fillLevel > 50 && b.fillLevel <= 75) || b.status === 'Medium').length;
  const highCount = bins.filter(b => (b.fillLevel > 75 && b.fillLevel < 90) || b.status === 'High').length;
  const criticalCount = bins.filter(b => b.fillLevel >= 90 || b.status === 'Critical').length;

  const donutData = [
    { label: 'Empty (0-20%)', value: emptyCount || 1, color: 'var(--fill-empty, #22c55e)' },
    { label: 'Normal (21-50%)', value: normalCount || 1, color: 'var(--fill-normal, #10b981)' },
    { label: 'Medium (51-75%)', value: mediumCount || 1, color: 'var(--fill-medium, #f59e0b)' },
    { label: 'High (76-89%)', value: highCount || 1, color: 'var(--fill-high, #f97316)' },
    { label: 'Critical (90%+)', value: criticalCount || 1, color: 'var(--fill-critical, #ef4444)' }
  ];

  // Collection Statistics for BarChart
  const cPending = collections.filter(c => c.status === 'Pending').length;
  const cAssigned = collections.filter(c => c.status === 'Assigned').length;
  const cInProgress = collections.filter(c => c.status === 'In-Progress').length;
  const cCompleted = collections.filter(c => c.status === 'Completed').length;
  const cCancelled = collections.filter(c => c.status === 'Cancelled').length;

  const barData = [
    { label: 'Pending', value: cPending, color: '#f59e0b' },
    { label: 'Assigned', value: cAssigned, color: '#3b82f6' },
    { label: 'In-Progress', value: cInProgress, color: '#8b5cf6' },
    { label: 'Completed', value: cCompleted, color: 'var(--success, #22c55e)' },
    { label: 'Cancelled', value: cCancelled, color: '#94a3b8' }
  ];

  // Critical alerts (top bins >= 75%)
  const criticalAlerts = bins
    .filter(b => b.fillLevel >= 75 || b.status === 'Critical')
    .sort((a, b) => b.fillLevel - a.fillLevel)
    .slice(0, 4);

  // Recent collection activity
  const recentActivities = [...collections].slice(0, 5);

  // Today's pickups
  const todayPickups = collections
    .filter(c => c.status === 'Pending' || c.status === 'Assigned' || c.status === 'In-Progress')
    .slice(0, 4);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name || 'Admin'}. Here is your real-time municipal waste operations overview.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/bins')}>
            <Trash2 size={16} /> View Bins
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/routes')}>
            <Sparkles size={16} /> Optimize Routes
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <StatCard title="Total Bins" value={totalBins || 18} icon={Trash2} color="var(--primary, #059669)" />
        <StatCard title="Critical Bins" value={criticalBins || 4} icon={AlertTriangle} color="var(--danger, #ef4444)" />
        <StatCard title="Pending Pickups" value={pendingPickups || 4} icon={Clock} color="#f97316" />
        <StatCard title="Today's Collections" value={todaysCollections || 6} icon={CalendarClock} color="var(--info, #3b82f6)" />
        <StatCard title="Active Drivers" value={activeDrivers || 5} icon={Users} color="#8b5cf6" />
        <StatCard title="Completed Collections" value={completedCollections || 5} icon={CheckCircle} color="var(--success, #22c55e)" />
      </div>

      {/* Overview Charts Section */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <h3>Bin Fill-Level Overview</h3>
            <span className="badge badge-primary">{totalBins} Monitored</span>
          </div>
          <div className="card-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '260px' }}>
            <DonutChart data={donutData} size={200} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Collection Statistics</h3>
            <span className="badge badge-secondary">Status Breakdown</span>
          </div>
          <div className="card-body" style={{ minHeight: '260px' }}>
            <BarChart data={barData} height={200} />
          </div>
        </div>
      </div>

      {/* Alerts and Today's Pickups */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* Critical Alerts */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}>
              <AlertTriangle size={18} /> Recent Critical Alerts
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/bins')}>
              View All
            </button>
          </div>
          <div className="card-body" style={{ padding: '1rem' }}>
            {criticalAlerts.length === 0 ? (
              <p style={{ color: 'var(--gray-500)', textAlign: 'center', padding: '1.5rem 0' }}>All bins operating within normal thresholds.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {criticalAlerts.map(bin => (
                  <div key={bin.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fee2e2',
                    borderRadius: 'var(--border-radius-xs)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', background: '#fee2e2',
                        color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                      }}>
                        {bin.fillLevel}%
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#991b1b' }}>{bin.id} - {bin.location}</h4>
                        <p style={{ fontSize: '0.75rem', color: '#b91c1c' }}>Zone: {bin.area || 'Downtown'} • Batt: {bin.batteryLevel || 88}%</p>
                      </div>
                    </div>
                    <button className="btn btn-danger btn-sm" onClick={() => navigate('/admin/schedule')}>
                      Schedule Pickup
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Today's Pickup Summary */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarClock size={18} style={{ color: 'var(--primary)' }} /> Today's Pickup Summary
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/schedule')}>
              Schedule New
            </button>
          </div>
          <div className="card-body" style={{ padding: '1rem' }}>
            {todayPickups.length === 0 ? (
              <p style={{ color: 'var(--gray-500)', textAlign: 'center', padding: '1.5rem 0' }}>No active pickups pending for today.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {todayPickups.map(col => (
                  <div key={col.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.75rem 1rem', background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
                    borderRadius: 'var(--border-radius-xs)'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{col.id}</span>
                        <Badge variant={col.status === 'Completed' ? 'success' : col.status === 'In-Progress' ? 'info' : 'warning'}>
                          {col.status}
                        </Badge>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>
                        {col.binId} • {col.binLocation || 'Main Sector'}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--gray-700)' }}>
                        {col.assignedDriver || 'Unassigned'}
                      </p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>
                        Priority: {col.priority}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Collection Activity */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} style={{ color: 'var(--primary)' }} /> Recent Collection Activity
          </h3>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/collections')}>
            View All Collections <ArrowRight size={14} />
          </button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Collection ID</th>
                  <th>Bin ID</th>
                  <th>Location</th>
                  <th>Fill Level</th>
                  <th>Assigned Driver</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map(act => (
                  <tr key={act.id}>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{act.id}</td>
                    <td style={{ fontWeight: 500 }}>{act.binId}</td>
                    <td>{act.binLocation || 'Municipal Zone'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="fill-level-bar" style={{ width: '60px', height: '6px' }}>
                          <div 
                            className={`fill ${act.fillLevel >= 80 ? 'fill-critical' : act.fillLevel >= 60 ? 'fill-high' : 'fill-normal'}`} 
                            style={{ width: `${act.fillLevel}%` }}
                          />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{act.fillLevel}%</span>
                      </div>
                    </td>
                    <td>{act.assignedDriver || <span style={{ color: 'var(--gray-400)' }}>Unassigned</span>}</td>
                    <td>
                      <Badge variant={act.priority === 'Critical' ? 'danger' : act.priority === 'High' ? 'warning' : 'info'}>
                        {act.priority}
                      </Badge>
                    </td>
                    <td>
                      <Badge variant={act.status === 'Completed' ? 'success' : act.status === 'In-Progress' ? 'info' : 'warning'}>
                        {act.status}
                      </Badge>
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
