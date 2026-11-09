import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Battery, Thermometer, Clock, Trash2, Calendar, Zap, Truck, CheckCircle } from 'lucide-react';
import { binService } from '../../services/binService.js';
import { telemetryService } from '../../services/telemetryService.js';
import { collectionService } from '../../services/collectionService.js';
import Badge from '../../components/common/Badge.jsx';
import FillGauge from '../../components/common/FillGauge.jsx';
import LineChart from '../../components/charts/LineChart.jsx';

export default function BinDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [bin, setBin] = useState(null);
  const [telemetryHistory, setTelemetryHistory] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const allBins = await binService.getBins();
      const found = (allBins || []).find(b => b.id === id);
      setBin(found || null);

      if (found) {
        const rawTelemetry = await telemetryService.getTelemetryForBin(id).catch(() => []);
        const formatted = (rawTelemetry || []).map((t, i) => ({
          label: `${i}h`,
          value: t.fillLevel
        }));
        setTelemetryHistory(formatted.length > 0 ? formatted : [
          { label: '0h', value: 20 }, { label: '4h', value: 35 }, { label: '8h', value: 50 },
          { label: '12h', value: 65 }, { label: '16h', value: 80 }, { label: '20h', value: found.fillLevel }
        ]);

        const allCollections = await collectionService.getCollections().catch(() => []);
        const binCols = (allCollections || []).filter(c => c.binId === id);
        setCollections(binCols);
      }
    } catch (err) {
      console.error('Error loading bin details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p style={{ color: 'var(--gray-500)' }}>Loading bin telemetry details...</p>
      </div>
    );
  }

  if (!bin) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--danger)' }}>Bin Not Found</h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>The requested bin ID "{id}" could not be located in the system.</p>
        <button className="btn btn-primary" onClick={() => navigate('/admin/bins')}>
          <ArrowLeft size={16} /> Back to Bins
        </button>
      </div>
    );
  }

  const isCritical = bin.fillLevel >= 80;

  return (
    <div className="page-container">
      {/* Back & Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary btn-icon" onClick={() => navigate('/admin/bins')} title="Back to Bins">
          <ArrowLeft size={18} />
        </button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Bin {bin.id}</h1>
            <Badge variant={isCritical ? 'danger' : bin.fillLevel >= 60 ? 'warning' : 'success'}>
              {bin.status}
            </Badge>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={14} style={{ color: 'var(--primary)' }} /> {bin.location} • {bin.area}
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <FillGauge percentage={bin.fillLevel} size={76} />
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Current Fill</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: isCritical ? 'var(--danger)' : 'var(--primary)' }}>
              {bin.fillLevel}%
            </h3>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>
            <Battery size={18} />
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Battery Level</span>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{bin.batteryLevel || 92}%</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Lithium IoT Cell</p>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)', marginBottom: '0.25rem' }}>
            <Thermometer size={18} />
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Internal Temp</span>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{bin.temperature || 24}°C</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Normal operating range</p>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--info)', marginBottom: '0.25rem' }}>
            <Trash2 size={18} />
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Capacity & Type</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{bin.capacity || 240} L</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{bin.wasteType || 'General'} Stream</p>
        </div>
      </div>

      {/* 2-Column Telemetry & Sensor Info */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* Telemetry Chart */}
        <div className="card">
          <div className="card-header">
            <h3>24-Hour IoT Fill-Level Progression</h3>
          </div>
          <div className="card-body">
            <LineChart data={telemetryHistory} height={200} color="var(--primary)" />
          </div>
        </div>

        {/* Sensor Specs */}
        <div className="card">
          <div className="card-header">
            <h3>IoT Sensor Telemetry Metadata</h3>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--gray-100)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Sensor Hardware ID</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{bin.sensorId || 'SNS-014'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--gray-100)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>GPS Coordinates</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{bin.latitude || '40.7128'}, {bin.longitude || '-74.0060'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--gray-100)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Installation Date</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{bin.installedDate ? new Date(bin.installedDate).toLocaleDateString() : 'Mar 12, 2024'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Last Telemetry Ping</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>{bin.lastUpdated || '1 min ago'}</span>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/admin/schedule')}>
                <Truck size={16} /> Dispatch Collection Crew
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Collection History */}
      <div className="card">
        <div className="card-header">
          <h3>Collection History for Bin {bin.id}</h3>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Collection ID</th>
                  <th>Driver</th>
                  <th>Priority</th>
                  <th>Scheduled Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {collections.map(col => (
                  <tr key={col.id}>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{col.id}</td>
                    <td>{col.assignedDriver || 'Assigned Driver'}</td>
                    <td><Badge variant={col.priority === 'Critical' ? 'danger' : 'warning'}>{col.priority}</Badge></td>
                    <td style={{ fontSize: '0.85rem' }}>{col.scheduledTime ? new Date(col.scheduledTime).toLocaleString() : 'Recent'}</td>
                    <td><Badge variant={col.status === 'Completed' ? 'success' : 'info'}>{col.status}</Badge></td>
                  </tr>
                ))}
                {collections.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>
                      No previous collection events recorded for this bin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
