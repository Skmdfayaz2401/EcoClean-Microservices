/**
 * EcoClean Municipal Smart Waste Management System
 * Dynamic Route Optimization Service (Mock / API ready)
 */

import { routes as initialRoutes } from '../data/routes.js';
import { _loadBins } from './binService.js';

const STORAGE_KEY = 'ecoclean_routes';
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Loads routes from localStorage or falls back to mock dataset.
 * @returns {Array} List of route objects
 */
export const _loadRoutes = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to parse routes from localStorage:', error);
  }
  const defaultCopy = JSON.parse(JSON.stringify(initialRoutes));
  _saveRoutes(defaultCopy);
  return defaultCopy;
};

/**
 * Persists routes to localStorage.
 * @param {Array} list
 */
export const _saveRoutes = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    console.error('Failed to save routes to localStorage:', error);
  }
};

// GET /api/routes
export const getRoutes = async () => {
  await delay(150);
  return _loadRoutes();
};

// GET /api/routes/:id
export const getRouteById = async (id) => {
  await delay(100);
  const list = _loadRoutes();
  const route = list.find((r) => r.id === id);
  if (!route) {
    throw new Error(`Route with ID "${id}" not found`);
  }
  return route;
};

// POST /api/routes/optimize
export const generateOptimizedRoute = async (selectedBinIds = [], driverId, driverName, vehicle) => {
  await delay(300);
  const list = _loadRoutes();
  const allBins = _loadBins();

  // Resolve bin objects from IDs or objects
  let targetBins = [];
  if (Array.isArray(selectedBinIds) && selectedBinIds.length > 0) {
    targetBins = selectedBinIds.map((item) => {
      if (typeof item === 'string') {
        return allBins.find((b) => b.id === item) || { id: item, location: 'Bin ' + item, fillLevel: 85 };
      }
      return item;
    });
  } else {
    // If no bins selected, default to top critical bins
    targetBins = allBins.filter((b) => b.collectionRequired || b.fillLevel >= 80).slice(0, 5);
  }

  // Sort bins by fillLevel descending (highest first heuristics)
  targetBins.sort((a, b) => (b.fillLevel || 0) - (a.fillLevel || 0));

  const now = new Date();
  let currentMinutes = now.getHours() * 60 + now.getMinutes() + 15;

  const stops = targetBins.map((bin, index) => {
    currentMinutes += Math.floor(Math.random() * 8) + 18; // 18-25 mins per leg
    const hours = Math.floor(currentMinutes / 60) % 24;
    const mins = currentMinutes % 60;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const estimatedArrival = `${String(displayHours).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${ampm}`;

    return {
      stopNumber: index + 1,
      binId: bin.id,
      location: bin.location || `Municipal Location #${bin.id}`,
      area: bin.area || 'Downtown Central',
      fillLevel: bin.fillLevel ?? 80,
      estimatedArrival,
      status: 'Pending'
    };
  });

  const stopCount = Math.max(1, stops.length);
  const totalDistance = Math.round((stopCount * (2.4 + Math.random() * 1.8) + 3.2) * 10) / 10;
  const estimatedDuration = Math.round(stopCount * 22 + 15);
  const optimizationScore = Math.min(99, Math.max(88, Math.floor(92 + Math.random() * 7)));
  const fuelSaved = Math.round((totalDistance * 0.36) * 10) / 10;
  const co2Reduced = Math.round((totalDistance * 0.96) * 10) / 10;

  const nextNum = list.length > 0
    ? Math.max(...list.map((r) => parseInt(r.id.replace('RT-', ''), 10) || 0)) + 1
    : 1;
  const newId = `RT-${String(nextNum).padStart(3, '0')}`;

  const newRoute = {
    id: newId,
    driverId: driverId || 'DRV-001',
    driverName: driverName || 'Assigned Driver',
    vehicle: vehicle || 'Truck #T-101 (Ford F-650)',
    date: new Date().toISOString().split('T')[0],
    startLocation: 'EcoClean Municipal Depot',
    status: 'Pending',
    stops,
    totalDistance,
    estimatedDuration,
    optimizationScore,
    fuelSaved,
    co2Reduced,
    createdAt: new Date().toISOString()
  };

  list.unshift(newRoute);
  _saveRoutes(list);
  return newRoute;
};

// PUT /api/routes/:id/status
export const updateRouteStatus = async (id, status) => {
  await delay(120);
  const list = _loadRoutes();
  const index = list.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error(`Route with ID "${id}" not found`);
  }

  list[index] = {
    ...list[index],
    status
  };

  _saveRoutes(list);
  return list[index];
};

export const updateStopStatus = async (routeId, stopNumber, status) => {
  await delay(120);
  const list = _loadRoutes();
  const index = list.findIndex((r) => r.id === routeId);
  if (index === -1) {
    throw new Error(`Route with ID "${routeId}" not found`);
  }

  const route = list[index];
  const updatedStops = route.stops.map((stop) => {
    if (stop.stopNumber === stopNumber) {
      return { ...stop, status };
    }
    return stop;
  });

  const allFinished = updatedStops.every((s) => s.status === 'Collected' || s.status === 'Skipped');
  const someCollected = updatedStops.some((s) => s.status === 'Collected');

  let newRouteStatus = route.status;
  if (allFinished) {
    newRouteStatus = 'Completed';
  } else if (someCollected && route.status === 'Pending') {
    newRouteStatus = 'In-Progress';
  }

  route.stops = updatedStops;
  route.status = newRouteStatus;

  list[index] = route;
  _saveRoutes(list);
  return route;
};

export const reoptimizeRoute = async (id) => {
  await delay(250);
  const list = _loadRoutes();
  const index = list.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error(`Route with ID "${id}" not found`);
  }

  const route = list[index];
  // Sort pending stops by fill level descending
  const completedStops = route.stops.filter((s) => s.status !== 'Pending');
  const pendingStops = route.stops.filter((s) => s.status === 'Pending');

  pendingStops.sort((a, b) => b.fillLevel - a.fillLevel);

  const merged = [...completedStops, ...pendingStops].map((stop, idx) => ({
    ...stop,
    stopNumber: idx + 1
  }));

  route.stops = merged;
  route.optimizationScore = Math.min(99, Math.max(90, (route.optimizationScore || 92) + 2));
  route.reoptimizedAt = new Date().toISOString();

  list[index] = route;
  _saveRoutes(list);
  return route;
};

export const getRoutesByDriver = async (driverId) => {
  await delay(100);
  const list = _loadRoutes();
  return list.filter((r) => r.driverId === driverId);
};

export const getRouteStatistics = async () => {
  await delay(100);
  const list = _loadRoutes();
  
  const totalRoutes = list.length;
  const activeRoutes = list.filter((r) => r.status === 'In-Progress').length;
  const completedRoutes = list.filter((r) => r.status === 'Completed').length;
  const pendingRoutes = list.filter((r) => r.status === 'Pending').length;

  const totalDistance = Math.round(list.reduce((sum, r) => sum + (Number(r.totalDistance) || 0), 0) * 10) / 10;
  const totalFuelSaved = Math.round(list.reduce((sum, r) => sum + (Number(r.fuelSaved) || 0), 0) * 10) / 10;
  const totalCO2Reduced = Math.round(list.reduce((sum, r) => sum + (Number(r.co2Reduced) || 0), 0) * 10) / 10;
  
  const totalScore = list.reduce((sum, r) => sum + (Number(r.optimizationScore) || 90), 0);
  const averageOptimizationScore = totalRoutes > 0 ? Math.round(totalScore / totalRoutes) : 92;

  let totalStops = 0;
  let collectedStops = 0;
  list.forEach((r) => {
    if (Array.isArray(r.stops)) {
      totalStops += r.stops.length;
      collectedStops += r.stops.filter((s) => s.status === 'Collected').length;
    }
  });

  return {
    totalRoutes,
    activeRoutes,
    completedRoutes,
    pendingRoutes,
    totalDistance,
    totalFuelSaved,
    totalCO2Reduced,
    averageOptimizationScore,
    totalStops,
    collectedStops
  };
};

export const routeService = {
  getRoutes,
  getAllRoutes: getRoutes,
  getAll: getRoutes,
  getRouteById,
  generateOptimizedRoute,
  updateRouteStatus,
  updateStopStatus,
  reoptimizeRoute,
  getRoutesByDriver,
  getRouteStatistics,
  _loadRoutes,
  _saveRoutes
};

export default routeService;
