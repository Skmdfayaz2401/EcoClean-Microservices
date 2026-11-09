import { useState, useEffect } from 'react';
import { collectionService } from '../../services/collectionService.js';
import { binService } from '../../services/binService.js';
import { driverService } from '../../services/driverService.js';
import { routeService } from '../../services/routeService.js';
import StatCard from '../../components/common/StatCard.jsx';
import Badge from '../../components/common/Badge.jsx';
import DonutChart from '../../components/charts/DonutChart.jsx';
import BarChart from '../../components/charts/BarChart.jsx';
import {
  BarChart3, Download, Printer, TrendingUp, Users, Trash2,
  Truck, Leaf, Award, MapPin, Clock, Target, CheckCircle, AlertTriangle,
} from 'lucide-react';

export default function ReportsPage() {
  const [bins, setBins] = useState([]);
  const [collections, setCollections] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [b, c, d, r] = await Promise.all([
        binService.getBins(), collectionService.getCollections(),
        driverService.getDrivers(), routeService.getRoutes(),
      ]);
      setBins(b); setCollections(c); setDrivers(d); setRoutes(r);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const totalCollections = collections.length;
  const completed = collections.filter(c => c.status === 'Completed').length;
  const pending = collections.filter(c => c.status === 'Pending').length;
  const criticalBins = bins.filter(b => b.status === 'Critical').length;
  const avgFillLevel = bins.length > 0 ? Math.round(bins.reduce((s, b) => s + b.fillLevel, 0) / bins.length) : 0;
  const activeDrivers = drivers.filter(d => d.active && d.status !== 'Off Duty').length;
  const completedRoutes = routes.filter(r => r.status === 'Completed');
  const avgOptScore = completedRoutes.length > 0
    ? Math.round(completedRoutes.reduce((s, r) => s + (r.optimizationScore || 0), 0) / completedRoutes.length)
    : 0;
  const totalCO2 = routes.reduce((s, r) => s + (r.co2Reduced || 0), 0).toFixed(1);

  const collectionStatusData = [
    { label: 'Pending', value: collections.filter(c => c.status === 'Pending').length, color: '#f59e0b' },
    { label: 'Assigned', value: collections.filter(c => c.status === 'Assigned').length, color: '#3b82f6' },
    { label: 'In-Progress', value: collections.filter(c => c.status === 'In-Progress').length, color: '#8b5cf6' },
    { label: 'Completed', value: collections.filter(c => c.status === 'Completed').length, color: '#22c55e' },
    { label: 'Cancelled', value: collections.filter(c => c.status === 'Cancelled').length, color: '#94a3b8' },
  ];

  const weeklyData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => ({
    label: day,
    value: Math.floor(Math.random() * 8) + 3 + (i < 5 ? 2 : 0),
    color: 'var(--primary)',
  }));

  const fillDistData = [
    { label: 'Empty', value: bins.filter(b => b.status === 'Empty').length, color: 'var(--fill-empty)' },
    { label: 'Normal', value: bins.filter(b => b.status === 'Normal').length, color: 'var(--fill-normal)' },
    { label: 'Medium', value: bins.filter(b => b.status === 'Medium').length, color: 'var(--fill-medium)' },
    { label: 'High', value: bins.filter(b => b.status === 'High').length, color: 'var(--fill-high)' },
    { label: 'Critical', value: bins.filter(b => b.status === 'Critical').length, color: 'var(--fill-critical)' },
  ];

  const driverPerfData = drivers.filter(d => d.active).map(d => ({
    label: d.name.split(' ')[0],
    value: d.completedCollections || 0,
    color: 'var(--primary)',
  }));

  const bestDriver = drivers.reduce((best, d) => (!best || d.completedCollections > best.completedCollections) ? d : best, null);
  const criticalArea = (() => {
    const areas = {};
    bins.filter(b => b.status === 'Critical' || b.status === 'High').forEach(b => { areas[b.area] = (areas[b.area] || 0) + 1; });
    const sorted = Object.entries(areas).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : 'N/A';
  })();

  const exportCSV = () => {
    const header = 'Collection ID,Bin ID,Location,Fill Level,Priority,Driver,Status,Scheduled Time\n';
    const rows = collections.map(c =>
      `${c.id},${c.binId},\"${c.binLocation || ''}\",${c.fillLevel}%,${c.priority},\"${c.assignedDriver || 'Unassigned'}\",${c.status},${c.scheduledTime || ''}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `ecoclean_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    window.print();
  };

  if (loading) {
    return <div className="page-container"><p style={{ color: 'var(--gray-500)' }}>Loading reports...</p></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Reports & Analytics</h1>
          <p>Comprehensive waste management performance metrics</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" onClick={exportCSV}><Download size={16} /> Export CSV</button>
          <button className="btn btn-secondary" onClick={exportPDF}><Printer size={16} /> Export PDF</button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon={BarChart3} title="Total Collections" value={totalCollections} color="var(--primary)" />
        <StatCard icon={CheckCircle} title="Completed" value={completed} trend={`${totalCollections > 0 ? Math.round((completed / totalCollections) * 100) : 0}%`} trendUp color="var(--success)" />
        <StatCard icon={Clock} title="Pending" value={pending} color="#f97316" />
        <StatCard icon={AlertTriangle} title="Critical Bins" value={criticalBins} color="var(--danger)" />
        <StatCard icon={Target} title="Avg Fill Level" value={`${avgFillLevel}%`} color="var(--warning)" />
        <StatCard icon={Users} title="Active Drivers" value={activeDrivers} color="#8b5cf6" />
        <StatCard icon={TrendingUp} title="Route Efficiency" value={`${avgOptScore}%`} trend="Optimization Score" trendUp color="var(--primary)" />
        <StatCard icon={Leaf} title="CO₂ Saved" value={`${totalCO2} kg`} trend="Total reduction" trendUp color="var(--success)" />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><h3>Collection Status Distribution</h3></div>
          <div className="card-body" style={{ display: 'flex', justifyContent: 'center' }}>
            <DonutChart data={collectionStatusData} />
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3>Weekly Collection Trends</h3></div>
          <div className="card-body">
            <BarChart data={weeklyData} height={200} />
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: '1.5rem' }}>
        <div className="card">
          <div className="card-header"><h3>Fill Level Distribution</h3></div>
          <div className="card-body">
            <BarChart data={fillDistData} height={200} />
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3>Driver Performance (Collections)</h3></div>
          <div className="card-body">
            <BarChart data={driverPerfData} height={200} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <Award size={32} style={{ color: '#f59e0b', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Best Performing Driver</p>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginTop: '0.25rem' }}>{bestDriver?.name || 'N/A'}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{bestDriver?.completedCollections || 0} collections</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <MapPin size={32} style={{ color: 'var(--danger)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Most Critical Area</p>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginTop: '0.25rem' }}>{criticalArea}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Highest bin alerts</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <Clock size={32} style={{ color: 'var(--info)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Collection Time</p>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginTop: '0.25rem' }}>28 min</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Per bin average</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <Truck size={32} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Route Optimization Savings</p>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginTop: '0.25rem' }}>{routes.reduce((s, r) => s + (r.fuelSaved || 0), 0).toFixed(1)} L</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Fuel saved this period</p>
          </div>
        </div>
      </div>
    </div>
  );
}
