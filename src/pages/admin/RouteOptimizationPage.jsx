import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Route, Zap, MapPin, Truck, Clock, Fuel, Leaf, 
  CheckCircle, ChevronRight, BarChart3, Navigation, 
  Sparkles, Plus, Trash2, Calendar, ArrowRight, Play, RotateCcw, UserPlus, Eye
} from 'lucide-react';
import { routeService } from '../../services/routeService.js';
import { binService } from '../../services/binService.js';
import { driverService } from '../../services/driverService.js';
import RouteMapVisualizer from '../../components/maps/RouteMapVisualizer.jsx';
import Badge from '../../components/common/Badge.jsx';

export default function RouteOptimizationPage() {
  const navigate = useNavigate();
  const [bins, setBins] = useState([]);
  const [candidateBins, setCandidateBins] = useState([]);
  const [selectedBins, setSelectedBins] = useState(new Set());
  const [drivers, setDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('Truck-07 (Ford F-650)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRoute, setGeneratedRoute] = useState(null);
  const [existingRoutes, setExistingRoutes] = useState([]);
  const [toastMsg, setToastMsg] = useState('');

  const vehicles = [
    'Truck-07 (Ford F-650)',
    'Truck-02 (Volvo FL Electric)',
    'Compactor-04 (Mack LR)',
    'Truck-09 (Isuzu N-Series)',
    'Eco-Van 03 (EV Transit)'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [binsData, driversData, routesData] = await Promise.all([
        binService.getBins().catch(() => []),
        driverService.getDrivers().catch(() => []),
        routeService.getRoutes().catch(() => [])
      ]);

      const allBins = binsData || [];
      setBins(allBins);
      
      // Candidate bins (those with fill level >= 60% or collectionRequired)
      const needsPickup = allBins.filter(b => b.fillLevel >= 55 || b.collectionRequired || b.status === 'Critical' || b.status === 'High');
      setCandidateBins(needsPickup);
      
      // Pre-select top critical bins
      const defaultSelection = new Set(needsPickup.slice(0, 6).map(b => b.id));
      setSelectedBins(defaultSelection);

      const allDrivers = driversData || [];
      setDrivers(allDrivers);
      if (allDrivers.length > 0) {
        setSelectedDriverId(allDrivers[0].id);
        if (allDrivers[0].vehicle) {
          setSelectedVehicle(allDrivers[0].vehicle);
        }
      }

      setExistingRoutes(routesData || []);
    } catch (err) {
      console.error('Failed to load route optimization data:', err);
    }
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const toggleBinSelection = (binId) => {
    const next = new Set(selectedBins);
    if (next.has(binId)) {
      next.delete(binId);
    } else {
      next.add(binId);
    }
    setSelectedBins(next);
  };

  const selectAllCritical = () => {
    const allCritical = candidateBins.map(b => b.id);
    setSelectedBins(new Set(allCritical));
  };

  const clearSelection = () => {
    setSelectedBins(new Set());
  };

  const handleDriverChange = (driverId) => {
    setSelectedDriverId(driverId);
    const d = drivers.find(drv => drv.id === driverId);
    if (d && d.vehicle) {
      setSelectedVehicle(d.vehicle);
    }
  };

  const handleGenerateRoute = async () => {
    if (selectedBins.size === 0) {
      alert('Please select at least 1 bin requiring collection.');
      return;
    }

    setIsGenerating(true);

    try {
      const selectedDriver = drivers.find(d => d.id === selectedDriverId) || { name: 'Raj Kumar', id: 'DRV-001' };
      const selectedBinObjects = candidateBins.filter(b => selectedBins.has(b.id));

      // Sort by fill level descending to simulate shortest path prioritization heuristic
      const sortedStops = [...selectedBinObjects].sort((a, b) => b.fillLevel - a.fillLevel);
      
      const stops = sortedStops.map((b, idx) => ({
        stopNumber: idx + 1,
        binId: b.id,
        location: b.location,
        area: b.area,
        fillLevel: b.fillLevel,
        estimatedArrival: `${9 + Math.floor(idx * 0.4)}:${(idx * 22) % 60 < 10 ? '0' : ''}${(idx * 22) % 60} AM`,
        status: 'Pending'
      }));

      const numStops = stops.length;
      const totalKm = (numStops * 2.8 + 4.2).toFixed(1);
      const estMinutes = Math.round(numStops * 14 + 25);
      const hours = Math.floor(estMinutes / 60);
      const mins = estMinutes % 60;
      const timeFormatted = `${hours > 0 ? `${hours}h ` : ''}${mins}m`;

      const newRoute = {
        id: `R-${Math.floor(100 + Math.random() * 900)}`,
        driverId: selectedDriver.id,
        driverName: selectedDriver.name,
        vehicle: selectedVehicle,
        date: new Date().toISOString().split('T')[0],
        startLocation: 'EcoClean Municipal Central Depot',
        stops: stops,
        totalDistance: parseFloat(totalKm),
        estimatedDuration: estMinutes,
        durationFormatted: timeFormatted,
        status: 'Optimized',
        optimizationScore: 94,
        fuelSaved: (numStops * 0.8).toFixed(1),
        co2Reduced: (numStops * 2.1).toFixed(1)
      };

      // Simulated network/AI optimization delay
      await new Promise(r => setTimeout(r, 600));

      setGeneratedRoute(newRoute);
      setIsGenerating(false);
      triggerToast(`⚡ Route ${newRoute.id} dynamically generated! Calculated ${newRoute.stops.length} stops with estimated distance of ${newRoute.totalDistance} km.`);
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  const handleStartRoute = () => {
    if (!generatedRoute) return;
    setGeneratedRoute(prev => ({ ...prev, status: 'In-Progress' }));
    triggerToast(`🚚 Route ${generatedRoute.id} dispatched to driver ${generatedRoute.driverName}. Navigation started!`);
  };

  return (
    <div className="page-container">
      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 9999,
          background: 'var(--primary-dark)', color: 'white', padding: '1rem 1.25rem',
          borderRadius: 'var(--border-radius-xs)', boxShadow: 'var(--shadow-xl)',
          display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'slideUp 0.2s ease',
          fontSize: '0.875rem', fontWeight: 500
        }}>
          <Sparkles size={18} style={{ color: 'var(--warning)' }} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <h1>Route Optimization</h1>
        <p>Generate efficient collection routes based on bin fill levels and pickup priority.</p>
      </div>

      {/* Main 2-Column Optimizer UI */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Left Column: Bins & Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Bin Selector Card */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>Bins Requiring Pickup</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Select bins to include in the optimization sequence</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={selectAllCritical}>Select All</button>
                <button className="btn btn-secondary btn-sm" onClick={clearSelection}>Clear</button>
              </div>
            </div>

            <div className="card-body" style={{ maxHeight: '340px', overflowY: 'auto', padding: '0.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {candidateBins.map(bin => {
                  const isChecked = selectedBins.has(bin.id);
                  const isCritical = bin.fillLevel >= 80;

                  return (
                    <div 
                      key={bin.id}
                      onClick={() => toggleBinSelection(bin.id)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.625rem 0.875rem',
                        background: isChecked ? 'var(--primary-50)' : 'white',
                        border: `1px solid ${isChecked ? 'var(--primary)' : 'var(--gray-200)'}`,
                        borderRadius: 'var(--border-radius-xs)',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <input 
                          type="checkbox" 
                          checked={isChecked} 
                          onChange={() => {}} // Handled by container
                          style={{ cursor: 'pointer', accentColor: 'var(--primary)' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{bin.id}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>{bin.location}</span>
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>{bin.area}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: isCritical ? 'var(--danger)' : 'var(--warning)' }}>
                            {bin.fillLevel}%
                          </span>
                        </div>
                        <Badge variant={isCritical ? 'danger' : 'warning'}>
                          {isCritical ? 'Critical' : 'High'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ padding: '0.75rem 1.25rem', background: 'var(--gray-50)', borderTop: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                Selected Stops: <strong>{selectedBins.size}</strong> bins
              </span>
            </div>
          </div>

          {/* Configuration Card */}
          <div className="card">
            <div className="card-header">
              <h3>Route Configuration</h3>
            </div>
            <div className="card-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Assign Driver</label>
                  <select 
                    className="form-input" 
                    value={selectedDriverId} 
                    onChange={e => handleDriverChange(e.target.value)}
                  >
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.status})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Collection Vehicle</label>
                  <select 
                    className="form-input" 
                    value={selectedVehicle} 
                    onChange={e => setSelectedVehicle(e.target.value)}
                  >
                    {vehicles.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                className="btn btn-primary btn-lg" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                onClick={handleGenerateRoute}
                disabled={isGenerating || selectedBins.size === 0}
              >
                {isGenerating ? (
                  <>Calculating Optimized Heuristics...</>
                ) : (
                  <>
                    <Sparkles size={18} /> Generate Optimized Route
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Route Optimization Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {generatedRoute ? (
            <div className="card" style={{ border: '2px solid var(--primary-light)' }}>
              <div className="card-header" style={{ background: 'var(--primary-50)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Route size={18} /> Optimized Route Generated: {generatedRoute.id}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--primary-dark)', opacity: 0.8 }}>Dynamic Nearest-Neighbor IoT Heuristic</p>
                </div>
                <Badge variant={generatedRoute.status === 'In-Progress' ? 'info' : 'success'}>
                  {generatedRoute.status}
                </Badge>
              </div>

              <div className="card-body">
                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem', textAlign: 'center' }}>
                  <div style={{ padding: '0.75rem 0.5rem', background: 'var(--gray-50)', borderRadius: 'var(--border-radius-xs)' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Stops</p>
                    <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--gray-800)' }}>{generatedRoute.stops.length}</p>
                  </div>
                  <div style={{ padding: '0.75rem 0.5rem', background: 'var(--gray-50)', borderRadius: 'var(--border-radius-xs)' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Distance</p>
                    <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary)' }}>{generatedRoute.totalDistance} km</p>
                  </div>
                  <div style={{ padding: '0.75rem 0.5rem', background: 'var(--gray-50)', borderRadius: 'var(--border-radius-xs)' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Est. Time</p>
                    <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--gray-800)' }}>{generatedRoute.durationFormatted}</p>
                  </div>
                  <div style={{ padding: '0.75rem 0.5rem', background: 'var(--gray-50)', borderRadius: 'var(--border-radius-xs)' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Score</p>
                    <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--success)' }}>{generatedRoute.optimizationScore}%</p>
                  </div>
                </div>

                {/* Driver and vehicle info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 1rem', background: '#f8fafc', border: '1px solid var(--gray-200)', borderRadius: 'var(--border-radius-xs)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                  <span>Driver: <strong>{generatedRoute.driverName}</strong></span>
                  <span>Vehicle: <strong>{generatedRoute.vehicle}</strong></span>
                </div>

                {/* Route Sequence Flow */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Navigation size={15} style={{ color: 'var(--primary)' }} /> Optimized Sequence
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', background: 'var(--gray-50)', padding: '1rem', borderRadius: 'var(--border-radius-xs)' }}>
                    {/* Depot start */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, color: 'var(--primary-dark)', fontSize: '0.85rem' }}>
                      <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>D</span>
                      <span>Municipal Central Depot (Start)</span>
                    </div>

                    {/* Stops */}
                    {generatedRoute.stops.map((stop, i) => (
                      <div key={stop.stopNumber} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ paddingLeft: '11px', color: 'var(--gray-300)', fontSize: '0.9rem', lineHeight: '1rem' }}>↓</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.35rem 0.5rem', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                            <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                              {stop.stopNumber}
                            </span>
                            <span style={{ fontWeight: 600 }}>{stop.binId}</span>
                            <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>({stop.location})</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{stop.estimatedArrival}</span>
                            <span style={{ fontWeight: 700, fontSize: '0.8rem', color: stop.fillLevel >= 80 ? 'var(--danger)' : 'var(--warning)' }}>
                              {stop.fillLevel}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Depot return */}
                    <div style={{ paddingLeft: '11px', color: 'var(--gray-300)', fontSize: '0.9rem', lineHeight: '1rem' }}>↓</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, color: 'var(--primary-dark)', fontSize: '0.85rem' }}>
                      <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>D</span>
                      <span>Municipal Central Depot (Return)</span>
                    </div>
                  </div>
                </div>

                {/* SVG Route Map */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
                    Visual Route Path
                  </h4>
                  <RouteMapVisualizer stops={generatedRoute.stops} height={220} />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-success" onClick={handleStartRoute}>
                    <Play size={16} /> Start Route
                  </button>
                  <button className="btn btn-secondary" onClick={handleGenerateRoute}>
                    <RotateCcw size={16} /> Re-Optimize
                  </button>
                  <button className="btn btn-secondary" onClick={() => triggerToast(`Driver ${generatedRoute.driverName} re-notified with dispatch payload.`)}>
                    <UserPlus size={16} /> Assign Driver
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary-50)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Route size={32} />
              </div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Dynamic Route Planning Engine</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', maxWidth: '380px', lineHeight: 1.5 }}>
                Select full and critical candidate bins on the left panel, configure your crew, and click <strong>"Generate Optimized Route"</strong> to compute fuel-efficient collection paths.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Existing Active Routes List */}
      <div className="card">
        <div className="card-header">
          <h3>Fleet Routes Overview</h3>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Route ID</th>
                  <th>Driver</th>
                  <th>Vehicle</th>
                  <th>Date</th>
                  <th>Stops</th>
                  <th>Distance</th>
                  <th>Est. Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {existingRoutes.map(rt => (
                  <tr key={rt.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{rt.id}</td>
                    <td>{rt.driverName}</td>
                    <td style={{ fontSize: '0.8rem' }}>{rt.vehicle}</td>
                    <td style={{ fontSize: '0.8rem' }}>{rt.date}</td>
                    <td>{rt.stops?.length || 4} stops</td>
                    <td>{rt.totalDistance} km</td>
                    <td>{rt.estimatedDuration} min</td>
                    <td>
                      <Badge variant={rt.status === 'Completed' ? 'success' : rt.status === 'In-Progress' ? 'warning' : 'info'}>
                        {rt.status}
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
