/**
 * EcoClean Municipal Smart Waste Management System
 * Garbage Bins Management Service (Mock / API ready)
 */

import { bins as initialBins } from '../data/bins.js';

const STORAGE_KEY = 'ecoclean_bins';
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Loads bins from localStorage; falls back to imported mock dataset if empty.
 * @returns {Array} List of bin objects
 */
export const _loadBins = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to parse bins from localStorage:', error);
  }
  const defaultCopy = JSON.parse(JSON.stringify(initialBins));
  _saveBins(defaultCopy);
  return defaultCopy;
};

/**
 * Persists bin collection to localStorage.
 * @param {Array} binsList
 */
export const _saveBins = (binsList) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(binsList));
  } catch (error) {
    console.error('Failed to save bins to localStorage:', error);
  }
};

// GET /api/bins
export const getBins = async () => {
  await delay(150);
  return _loadBins();
};

// GET /api/bins/:id
export const getBinById = async (id) => {
  await delay(100);
  const binsList = _loadBins();
  const bin = binsList.find((b) => b.id === id);
  if (!bin) {
    throw new Error(`Bin with ID "${id}" not found`);
  }
  return bin;
};

// POST /api/bins
export const addBin = async (binData) => {
  await delay(200);
  const binsList = _loadBins();
  const nextNum = binsList.length > 0
    ? Math.max(...binsList.map((b) => parseInt(b.id.replace('BIN-', ''), 10) || 0)) + 1
    : 1;
  const newId = `BIN-${String(nextNum).padStart(3, '0')}`;
  const fillLevel = Number(binData.fillLevel ?? 0);
  const status = binData.status || (fillLevel >= 85 ? 'Critical' : fillLevel >= 60 ? 'Medium' : 'Normal');
  const collectionRequired = binData.collectionRequired !== undefined
    ? binData.collectionRequired
    : fillLevel >= 80;

  const newBin = {
    id: newId,
    location: binData.location || 'New Waste Point',
    area: binData.area || 'Commercial District',
    fillLevel,
    status,
    lastUpdated: new Date().toISOString(),
    batteryLevel: Number(binData.batteryLevel ?? 95),
    temperature: Number(binData.temperature ?? 22),
    wasteType: binData.wasteType || 'General',
    capacity: Number(binData.capacity ?? 1100),
    latitude: Number(binData.latitude ?? 40.7128),
    longitude: Number(binData.longitude ?? -74.0060),
    collectionRequired,
    sensorId: binData.sensorId || `SNS-${String(nextNum).padStart(3, '0')}`,
    installedDate: binData.installedDate || new Date().toISOString()
  };

  binsList.unshift(newBin);
  _saveBins(binsList);
  return newBin;
};

// PUT /api/bins/:id
export const updateBin = async (id, binData) => {
  await delay(150);
  const binsList = _loadBins();
  const index = binsList.findIndex((b) => b.id === id);
  if (index === -1) {
    throw new Error(`Bin with ID "${id}" not found`);
  }

  const existing = binsList[index];
  const updatedFill = binData.fillLevel !== undefined ? Number(binData.fillLevel) : existing.fillLevel;
  const updatedStatus = binData.status !== undefined
    ? binData.status
    : (binData.fillLevel !== undefined
        ? (updatedFill >= 85 ? 'Critical' : updatedFill >= 60 ? 'Medium' : 'Normal')
        : existing.status);
  const updatedCollectionRequired = binData.collectionRequired !== undefined
    ? binData.collectionRequired
    : (binData.fillLevel !== undefined ? updatedFill >= 80 : existing.collectionRequired);

  const updatedBin = {
    ...existing,
    ...binData,
    id: existing.id,
    fillLevel: updatedFill,
    status: updatedStatus,
    collectionRequired: updatedCollectionRequired,
    lastUpdated: new Date().toISOString()
  };

  binsList[index] = updatedBin;
  _saveBins(binsList);
  return updatedBin;
};

// DELETE /api/bins/:id
export const deleteBin = async (id) => {
  await delay(150);
  let binsList = _loadBins();
  const exists = binsList.some((b) => b.id === id);
  if (!exists) {
    throw new Error(`Bin with ID "${id}" not found`);
  }
  binsList = binsList.filter((b) => b.id !== id);
  _saveBins(binsList);
  return { success: true, id };
};

export const markForCollection = async (id) => {
  await delay(100);
  const binsList = _loadBins();
  const index = binsList.findIndex((b) => b.id === id);
  if (index === -1) {
    throw new Error(`Bin with ID "${id}" not found`);
  }
  binsList[index] = {
    ...binsList[index],
    collectionRequired: true,
    lastUpdated: new Date().toISOString()
  };
  _saveBins(binsList);
  return binsList[index];
};

export const getFilteredBins = async ({ status, area, search } = {}) => {
  await delay(100);
  let list = _loadBins();

  if (status && status !== 'All') {
    list = list.filter((b) => b.status?.toLowerCase() === status.toLowerCase());
  }
  if (area && area !== 'All') {
    list = list.filter((b) => b.area?.toLowerCase() === area.toLowerCase());
  }
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (b) =>
        b.id?.toLowerCase().includes(q) ||
        b.location?.toLowerCase().includes(q) ||
        b.area?.toLowerCase().includes(q) ||
        b.wasteType?.toLowerCase().includes(q)
    );
  }
  return list;
};

export const simulateTelemetryUpdate = async () => {
  await delay(100);
  const binsList = _loadBins();
  if (binsList.length === 0) return [];

  const count = Math.min(binsList.length, Math.floor(Math.random() * 2) + 2); // 2 or 3
  const updatedBins = [];
  const pickedIndices = new Set();

  while (pickedIndices.size < count) {
    pickedIndices.add(Math.floor(Math.random() * binsList.length));
  }

  pickedIndices.forEach((idx) => {
    const b = binsList[idx];
    const delta = Math.floor(Math.random() * 10) + 2;
    const newFill = Math.min(100, b.fillLevel + delta);
    const newStatus = newFill >= 85 ? 'Critical' : newFill >= 60 ? 'Medium' : 'Normal';
    const newTemp = Math.round((21 + Math.random() * 8) * 10) / 10;
    const newBattery = Math.max(20, Math.round((b.batteryLevel - 0.2) * 10) / 10);

    binsList[idx] = {
      ...b,
      fillLevel: newFill,
      status: newStatus,
      collectionRequired: newFill >= 80,
      temperature: newTemp,
      batteryLevel: newBattery,
      lastUpdated: new Date().toISOString()
    };
    updatedBins.push(binsList[idx]);
  });

  _saveBins(binsList);
  return updatedBins;
};

export const binService = {
  getBins,
  getAllBins: getBins,
  getAll: getBins,
  getBinById,
  addBin,
  updateBin,
  deleteBin,
  markForCollection,
  getFilteredBins,
  simulateTelemetryUpdate,
  _loadBins,
  _saveBins
};

export default binService;
