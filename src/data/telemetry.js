/**
 * EcoClean Municipal Smart Waste Management System
 * Mock Data: IoT Sensor Telemetry & Stream Generator
 */

const create24HourReadings = (currentFill, currentBattery, currentTemp, baseSignal = 88) => {
  const readings = [];
  // Reference anchor time: 2026-09-20 01:00:00 UTC
  const anchorTime = new Date('2026-09-20T01:00:00.000Z').getTime();
  const startFill = Math.max(5, Math.round(currentFill * 0.45));

  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(anchorTime - i * 3600 * 1000).toISOString();
    const progress = (23 - i) / 23;
    
    // Gradual upward accumulation pattern with minor realistic jitter
    const jitter = Math.sin(i * 1.7) * 1.2;
    const fillLevel = i === 0 
      ? currentFill 
      : Math.min(100, Math.max(0, Math.round((startFill + (currentFill - startFill) * progress + jitter) * 10) / 10));

    // Slow discharge of IoT battery pack
    const batteryLevel = Math.min(100, Math.max(50, Math.round((currentBattery + (i * 0.05)) * 10) / 10));

    // Diurnal temperature oscillation (cool in early morning, peak in mid-afternoon)
    const hour = new Date(anchorTime - i * 3600 * 1000).getUTCHours();
    const diurnalOffset = Math.sin(((hour - 9) / 24) * 2 * Math.PI) * 4.5;
    const temperature = Math.round((currentTemp - 2 + diurnalOffset) * 10) / 10;

    // Cellular / LoRaWAN signal strength (70 - 100 dBm scale)
    const signalStrength = Math.min(100, Math.max(70, Math.round(baseSignal + Math.cos(i * 0.8) * 6)));

    readings.push({
      timestamp,
      fillLevel,
      batteryLevel,
      temperature,
      signalStrength
    });
  }

  return readings;
};

export const telemetryData = {
  'BIN-001': create24HourReadings(88, 94, 24, 92),
  'BIN-002': create24HourReadings(92, 82, 27, 85),
  'BIN-003': create24HourReadings(35, 98, 21, 95),
  'BIN-004': create24HourReadings(68, 76, 22, 88),
  'BIN-005': create24HourReadings(95, 89, 25, 90),
  'BIN-006': create24HourReadings(78, 65, 20, 78),
  'BIN-007': create24HourReadings(82, 71, 32, 84),
  'BIN-008': create24HourReadings(45, 91, 23, 91),
  'BIN-009': create24HourReadings(14, 95, 22, 96),
  'BIN-010': create24HourReadings(76, 84, 26, 86),
  'BIN-011': create24HourReadings(52, 88, 21, 90),
  'BIN-012': create24HourReadings(18, 97, 22, 94),
  'BIN-013': create24HourReadings(84, 79, 24, 87),
  'BIN-014': create24HourReadings(31, 93, 19, 93),
  'BIN-015': create24HourReadings(62, 68, 34, 79),
  'BIN-016': create24HourReadings(89, 86, 25, 91),
  'BIN-017': create24HourReadings(11, 100, 23, 97),
  'BIN-018': create24HourReadings(58, 90, 25, 89)
};

/**
 * Simulates an incoming real-time telemetry ping for a given bin.
 * Slightly increments or adjusts sensor telemetry to model live city conditions.
 *
 * @param {string} binId
 * @param {number} currentFillLevel
 * @returns {Object} new telemetry reading
 */
export const generateTelemetryReading = (binId, currentFillLevel = 50) => {
  // Random small delta, predominantly positive to simulate waste deposit
  const fillDelta = (Math.random() * 1.8 - 0.3);
  const newFill = Math.min(100, Math.max(0, Math.round((currentFillLevel + fillDelta) * 10) / 10));
  
  // Ambient temperature variation
  const temp = Math.round((20 + Math.random() * 10) * 10) / 10;
  
  // Battery slight decrement
  const battery = Math.min(100, Math.max(60, Math.round((90 - Math.random() * 3) * 10) / 10));
  
  // High quality LoRa/LTE telemetry link
  const signal = Math.floor(75 + Math.random() * 25);

  return {
    binId,
    timestamp: new Date().toISOString(),
    fillLevel: newFill,
    batteryLevel: battery,
    temperature: temp,
    signalStrength: signal
  };
};
