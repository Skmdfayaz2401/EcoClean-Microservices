/**
 * EcoClean Municipal Smart Waste Management System
 * Mock Data: Dispatcher & System Event Notifications
 */

export const notifications = [
  {
    id: 'NTF-001',
    type: 'critical',
    title: 'Critical Fill Level Alert',
    message: 'Bin #BIN-005 at 88 College Walk (University Campus) has reached 95% capacity. Immediate pickup required.',
    timestamp: '2026-09-20T00:52:00.000Z',
    read: false,
    category: 'bin-alert'
  },
  {
    id: 'NTF-002',
    type: 'critical',
    title: 'Overflow Risk Warning',
    message: 'Bin #BIN-002 at 45 Market Plaza is at 92% capacity with rapid fill rate during weekend market hours.',
    timestamp: '2026-09-20T00:35:00.000Z',
    read: false,
    category: 'bin-alert'
  },
  {
    id: 'NTF-003',
    type: 'warning',
    title: 'High Temperature Detected',
    message: 'Bin #BIN-007 at 500 Forge Parkway reported internal temperature of 32°C. Flammable hazardous waste monitoring active.',
    timestamp: '2026-09-20T00:15:00.000Z',
    read: false,
    category: 'telemetry'
  },
  {
    id: 'NTF-004',
    type: 'info',
    title: 'Route Dispatched',
    message: 'Route RT-001 dispatched to driver Marcus Vance (Truck #T-101) with 4 scheduled stops in Commercial District.',
    timestamp: '2026-09-19T23:30:00.000Z',
    read: false,
    category: 'route'
  },
  {
    id: 'NTF-005',
    type: 'warning',
    title: 'Low Battery Advisory',
    message: 'Sensor SNS-006 on Bin #BIN-006 (Waterfront) battery level dropped to 65%. Maintenance recommended within 48 hours.',
    timestamp: '2026-09-19T21:40:00.000Z',
    read: false,
    category: 'system'
  },
  {
    id: 'NTF-006',
    type: 'success',
    title: 'Collection Completed',
    message: 'Collection COL-001 for Bin #BIN-005 completed by driver Elena Rodriguez. 360L recyclable waste collected.',
    timestamp: '2026-09-19T20:12:00.000Z',
    read: true,
    category: 'collection'
  },
  {
    id: 'NTF-007',
    type: 'info',
    title: 'Route Optimization Applied',
    message: 'AI Route Engine recalculated RT-002 with 94% efficiency score, saving an estimated 5.4L fuel and 14.2kg CO2.',
    timestamp: '2026-09-19T18:30:00.000Z',
    read: true,
    category: 'route'
  },
  {
    id: 'NTF-008',
    type: 'warning',
    title: 'Driver Shift Notification',
    message: 'Driver Darius Thorne (DRV-005) shift rescheduled from Night to On-Call due to adverse weather advisories.',
    timestamp: '2026-09-19T16:05:00.000Z',
    read: true,
    category: 'driver'
  },
  {
    id: 'NTF-009',
    type: 'success',
    title: 'Depot Fleet Sync Successful',
    message: 'All 6 municipal collection vehicles telemetry handshake verified with central municipal server.',
    timestamp: '2026-09-19T14:00:00.000Z',
    read: true,
    category: 'system'
  },
  {
    id: 'NTF-010',
    type: 'critical',
    title: 'Hazardous Waste Capacity Threshold',
    message: 'Bin #BIN-015 at 720 Foundry Road reached 62% threshold. Hazardous disposal certification protocol flagged.',
    timestamp: '2026-09-19T11:20:00.000Z',
    read: true,
    category: 'bin-alert'
  },
  {
    id: 'NTF-011',
    type: 'success',
    title: 'Route Completed',
    message: 'Driver Sarah Chen completed Route RT-004 on schedule with 5/5 stops cleared and 100% compliance score.',
    timestamp: '2026-09-19T08:55:00.000Z',
    read: true,
    category: 'collection'
  },
  {
    id: 'NTF-012',
    type: 'info',
    title: 'Firmware Update Deployed',
    message: 'Firmware v2.4.1 deployed to 18 smart bin telemetry modules. Sensor calibration and power optimization enabled.',
    timestamp: '2026-09-19T06:10:00.000Z',
    read: true,
    category: 'system'
  }
];
