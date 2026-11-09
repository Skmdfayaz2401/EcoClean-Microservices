/**
 * EcoClean Municipal Smart Waste Management System
 * Collection Dispatch & Scheduling Service (Mock / API ready)
 */

import { collections as initialCollections } from '../data/collections.js';

const STORAGE_KEY = 'ecoclean_collections';
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Loads collection records from localStorage or falls back to mock dataset.
 * @returns {Array} List of collection objects
 */
export const _loadCollections = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to parse collections from localStorage:', error);
  }
  const defaultCopy = JSON.parse(JSON.stringify(initialCollections));
  _saveCollections(defaultCopy);
  return defaultCopy;
};

/**
 * Persists collections to localStorage.
 * @param {Array} list
 */
export const _saveCollections = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    console.error('Failed to save collections to localStorage:', error);
  }
};

// GET /api/collections
export const getCollections = async () => {
  await delay(150);
  return _loadCollections();
};

// GET /api/collections/:id
export const getCollectionById = async (id) => {
  await delay(100);
  const list = _loadCollections();
  const item = list.find((c) => c.id === id);
  if (!item) {
    throw new Error(`Collection with ID "${id}" not found`);
  }
  return item;
};

// POST /api/collections
export const createCollection = async (data) => {
  await delay(200);
  const list = _loadCollections();
  const nextNum = list.length > 0
    ? Math.max(...list.map((c) => parseInt(c.id.replace('COL-', ''), 10) || 0)) + 1
    : 1;
  const newId = `COL-${String(nextNum).padStart(3, '0')}`;

  const fillLevel = Number(data.fillLevel ?? 80);
  const priority = data.priority || (fillLevel >= 85 ? 'Critical' : fillLevel >= 70 ? 'High' : 'Medium');
  const status = data.status || (data.assignedDriverId ? 'Assigned' : 'Scheduled');

  const newCollection = {
    id: newId,
    binId: data.binId || 'BIN-001',
    binLocation: data.binLocation || 'Municipal Bin',
    fillLevel,
    priority,
    assignedDriver: data.assignedDriver || (data.assignedDriverId ? 'Assigned Driver' : null),
    assignedDriverId: data.assignedDriverId || null,
    scheduledTime: data.scheduledTime || new Date(Date.now() + 3600 * 1000 * 2).toISOString(),
    status,
    completedAt: status === 'Completed' ? new Date().toISOString() : null,
    notes: data.notes || '',
    createdAt: new Date().toISOString()
  };

  list.unshift(newCollection);
  _saveCollections(list);
  return newCollection;
};

// PUT /api/collections/:id
export const updateCollection = async (id, data) => {
  await delay(150);
  const list = _loadCollections();
  const index = list.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error(`Collection with ID "${id}" not found`);
  }

  const existing = list[index];
  const updatedStatus = data.status || existing.status;
  let completedAt = existing.completedAt;

  if (updatedStatus === 'Completed' && !completedAt) {
    completedAt = new Date().toISOString();
  } else if (updatedStatus !== 'Completed') {
    completedAt = null;
  }

  const updated = {
    ...existing,
    ...data,
    id: existing.id,
    status: updatedStatus,
    completedAt
  };

  list[index] = updated;
  _saveCollections(list);
  return updated;
};

// PUT /api/collections/:id/assign
export const assignDriver = async (collectionId, driverId, driverName) => {
  await delay(150);
  const list = _loadCollections();
  const index = list.findIndex((c) => c.id === collectionId);
  if (index === -1) {
    throw new Error(`Collection with ID "${collectionId}" not found`);
  }

  list[index] = {
    ...list[index],
    assignedDriverId: driverId,
    assignedDriver: driverName,
    status: 'Assigned'
  };

  _saveCollections(list);
  return list[index];
};

// PUT /api/collections/:id/status
export const updateStatus = async (id, status) => {
  await delay(100);
  return updateCollection(id, { status });
};

export const reschedule = async (id, newTime) => {
  await delay(120);
  const formattedTime = new Date(newTime).toISOString();
  return updateCollection(id, { scheduledTime: formattedTime, status: 'Scheduled' });
};

export const getCollectionsByStatus = async (status) => {
  await delay(100);
  const list = _loadCollections();
  if (!status || status === 'All') return list;
  return list.filter((c) => c.status?.toLowerCase() === status.toLowerCase());
};

export const getCollectionsByDriver = async (driverId) => {
  await delay(100);
  const list = _loadCollections();
  return list.filter((c) => c.assignedDriverId === driverId);
};

export const getStatistics = async () => {
  await delay(100);
  const list = _loadCollections();
  const stats = {
    total: list.length,
    scheduled: list.filter((c) => c.status === 'Scheduled').length,
    assigned: list.filter((c) => c.status === 'Assigned').length,
    inProgress: list.filter((c) => c.status === 'In-Progress').length,
    completed: list.filter((c) => c.status === 'Completed').length,
    cancelled: list.filter((c) => c.status === 'Cancelled').length,
    criticalPriority: list.filter((c) => c.priority === 'Critical' && c.status !== 'Completed').length,
    highPriority: list.filter((c) => c.priority === 'High' && c.status !== 'Completed').length
  };
  return stats;
};

export const collectionService = {
  getCollections,
  getAllCollections: getCollections,
  getAll: getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  assignDriver,
  updateStatus,
  reschedule,
  getCollectionsByStatus,
  getCollectionsByDriver,
  getStatistics,
  _loadCollections,
  _saveCollections
};

export default collectionService;
