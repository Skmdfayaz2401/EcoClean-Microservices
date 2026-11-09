/**
 * EcoClean Municipal Smart Waste Management System
 * Driver & Fleet Personnel Service (Mock / API ready)
 */

import { drivers as initialDrivers } from '../data/drivers.js';

const STORAGE_KEY = 'ecoclean_drivers';
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Loads driver records from localStorage or defaults to initial mock drivers.
 * @returns {Array} List of driver objects
 */
export const _loadDrivers = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to parse drivers from localStorage:', error);
  }
  const defaultCopy = JSON.parse(JSON.stringify(initialDrivers));
  _saveDrivers(defaultCopy);
  return defaultCopy;
};

/**
 * Persists driver collection to localStorage.
 * @param {Array} list
 */
export const _saveDrivers = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    console.error('Failed to save drivers to localStorage:', error);
  }
};

// GET /api/drivers
export const getDrivers = async () => {
  await delay(150);
  return _loadDrivers();
};

// GET /api/drivers/:id
export const getDriverById = async (id) => {
  await delay(100);
  const list = _loadDrivers();
  const driver = list.find((d) => d.id === id);
  if (!driver) {
    throw new Error(`Driver with ID "${id}" not found`);
  }
  return driver;
};

// POST /api/drivers
export const addDriver = async (driverData) => {
  await delay(200);
  const list = _loadDrivers();
  const nextNum = list.length > 0
    ? Math.max(...list.map((d) => parseInt(d.id.replace('DRV-', ''), 10) || 0)) + 1
    : 1;
  const newId = `DRV-${String(nextNum).padStart(3, '0')}`;

  const newDriver = {
    id: newId,
    name: driverData.name || 'New Driver',
    email: driverData.email || `driver${nextNum}@ecoclean.com`,
    phone: driverData.phone || '+1 (555) 000-0000',
    vehicle: driverData.vehicle || 'Truck #T-105 (Volvo FE Electric)',
    vehicleId: driverData.vehicleId || `VH-${String(nextNum).padStart(3, '0')}`,
    status: driverData.status || 'Available',
    shift: driverData.shift || 'Morning',
    rating: Number(driverData.rating ?? 5.0),
    completedCollections: Number(driverData.completedCollections ?? 0),
    assignedRoute: driverData.assignedRoute || null,
    active: driverData.active !== undefined ? Boolean(driverData.active) : true,
    joinedDate: driverData.joinedDate || new Date().toISOString(),
    licenseNumber: driverData.licenseNumber || `CDL-NY-${Math.floor(100000 + Math.random() * 900000)}`
  };

  list.unshift(newDriver);
  _saveDrivers(list);
  return newDriver;
};

// PUT /api/drivers/:id
export const updateDriver = async (id, data) => {
  await delay(150);
  const list = _loadDrivers();
  const index = list.findIndex((d) => d.id === id);
  if (index === -1) {
    throw new Error(`Driver with ID "${id}" not found`);
  }

  const existing = list[index];
  const updated = {
    ...existing,
    ...data,
    id: existing.id
  };

  list[index] = updated;
  _saveDrivers(list);
  return updated;
};

export const toggleActive = async (id) => {
  await delay(120);
  const list = _loadDrivers();
  const index = list.findIndex((d) => d.id === id);
  if (index === -1) {
    throw new Error(`Driver with ID "${id}" not found`);
  }

  const driver = list[index];
  const newActive = !driver.active;
  const newStatus = !newActive ? 'Off Duty' : (driver.assignedRoute ? 'On Route' : 'Available');

  list[index] = {
    ...driver,
    active: newActive,
    status: newStatus
  };

  _saveDrivers(list);
  return list[index];
};

export const assignRoute = async (driverId, routeId) => {
  await delay(150);
  const list = _loadDrivers();
  const index = list.findIndex((d) => d.id === driverId);
  if (index === -1) {
    throw new Error(`Driver with ID "${driverId}" not found`);
  }

  list[index] = {
    ...list[index],
    assignedRoute: routeId,
    status: routeId ? 'On Route' : 'Available'
  };

  _saveDrivers(list);
  return list[index];
};

export const getAvailableDrivers = async () => {
  await delay(100);
  const list = _loadDrivers();
  return list.filter((d) => d.active && d.status === 'Available');
};

export const getDriverStatistics = async () => {
  await delay(100);
  const list = _loadDrivers();

  const totalDrivers = list.length;
  const activeDrivers = list.filter((d) => d.active).length;
  const onRouteDrivers = list.filter((d) => d.status === 'On Route').length;
  const availableDrivers = list.filter((d) => d.status === 'Available' && d.active).length;
  const offDutyDrivers = list.filter((d) => d.status === 'Off Duty' || !d.active).length;
  
  const totalRating = list.reduce((sum, d) => sum + (Number(d.rating) || 5), 0);
  const averageRating = totalDrivers > 0 ? Math.round((totalRating / totalDrivers) * 10) / 10 : 5.0;

  const totalCompletedCollections = list.reduce(
    (sum, d) => sum + (Number(d.completedCollections) || 0),
    0
  );

  return {
    totalDrivers,
    activeDrivers,
    onRouteDrivers,
    availableDrivers,
    offDutyDrivers,
    averageRating,
    totalCompletedCollections
  };
};

export const driverService = {
  getDrivers,
  getAllDrivers: getDrivers,
  getAll: getDrivers,
  getDriverById,
  addDriver,
  updateDriver,
  toggleActive,
  assignRoute,
  getAvailableDrivers,
  getDriverStatistics,
  _loadDrivers,
  _saveDrivers
};

export default driverService;
