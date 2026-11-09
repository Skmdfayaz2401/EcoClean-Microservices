/**
 * EcoClean Municipal Smart Waste Management System
 * Service Layer Barrel Exports
 */

export { default as api } from './api.js';
export { default as authService, mockUsers, login, logout, getCurrentUser, updateProfile, changePassword } from './authService.js';
export { default as binService, getBins, getBinById, addBin, updateBin, deleteBin, markForCollection, getFilteredBins, simulateTelemetryUpdate } from './binService.js';
export { default as collectionService, getCollections, getCollectionById, createCollection, updateCollection, assignDriver, updateStatus, reschedule, getCollectionsByStatus, getCollectionsByDriver, getStatistics } from './collectionService.js';
export { default as routeService, getRoutes, getRouteById, generateOptimizedRoute, updateRouteStatus, updateStopStatus, reoptimizeRoute, getRoutesByDriver, getRouteStatistics } from './routeService.js';
export { default as driverService, getDrivers, getDriverById, addDriver, updateDriver, toggleActive, assignRoute, getAvailableDrivers, getDriverStatistics } from './driverService.js';
export { default as telemetryService, getTelemetryForBin, getLatestReading, simulateReading } from './telemetryService.js';
