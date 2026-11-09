/**
 * EcoClean Municipal Smart Waste Management System
 * IoT Sensor Telemetry Service (Mock / API ready)
 */

import { telemetryData, generateTelemetryReading } from '../data/telemetry.js';

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

// Keep a local runtime cache so simulated readings can accumulate during user sessions
const runtimeTelemetry = { ...telemetryData };

/**
 * Generates synthetic 24-hour telemetry for newly created bins
 * @param {string} binId
 * @returns {Array} 24 hourly readings
 */
const createFallbackTelemetry = (binId) => {
  const readings = [];
  const anchorTime = new Date().getTime();
  const baseFill = 40 + Math.floor(Math.random() * 35);

  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(anchorTime - i * 3600 * 1000).toISOString();
    const progress = (23 - i) / 23;
    const fillLevel = Math.min(100, Math.max(5, Math.round(baseFill * 0.4 + (baseFill * 0.6 * progress))));
    readings.push({
      timestamp,
      fillLevel,
      batteryLevel: Math.max(70, 96 - Math.round(i * 0.1)),
      temperature: Math.round((22 + Math.sin(i) * 3) * 10) / 10,
      signalStrength: Math.floor(82 + Math.random() * 14)
    });
  }
  return readings;
};

// GET /api/telemetry/:binId
export const getTelemetryForBin = async (binId) => {
  await delay(120);
  if (!runtimeTelemetry[binId]) {
    runtimeTelemetry[binId] = createFallbackTelemetry(binId);
  }
  return [...runtimeTelemetry[binId]];
};

// GET /api/telemetry/:binId/latest
export const getLatestReading = async (binId) => {
  await delay(80);
  const readings = await getTelemetryForBin(binId);
  if (readings && readings.length > 0) {
    return readings[readings.length - 1];
  }
  return generateTelemetryReading(binId, 50);
};

export const simulateReading = async (binId, currentFillLevel = 50) => {
  await delay(100);
  const reading = generateTelemetryReading(binId, currentFillLevel);
  
  if (!runtimeTelemetry[binId]) {
    runtimeTelemetry[binId] = createFallbackTelemetry(binId);
  }
  runtimeTelemetry[binId].push(reading);
  
  // Keep window to last 50 readings
  if (runtimeTelemetry[binId].length > 50) {
    runtimeTelemetry[binId].shift();
  }

  return reading;
};

export const telemetryService = {
  getTelemetryForBin,
  getLatestReading,
  simulateReading
};

export default telemetryService;
