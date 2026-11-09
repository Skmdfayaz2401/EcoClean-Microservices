/**
 * EcoClean Municipal Smart Waste Management System
 * Mock Data: Optimized Collection Routes & Stops
 */

export const routes = [
  {
    id: 'RT-001',
    driverId: 'DRV-001',
    driverName: 'Marcus Vance',
    vehicle: 'Truck #T-101 (Ford F-650)',
    date: '2026-09-20',
    startLocation: 'EcoClean Municipal Depot',
    status: 'In-Progress',
    stops: [
      {
        stopNumber: 1,
        binId: 'BIN-001',
        location: '104 Broadway & Wall St',
        area: 'Commercial District',
        fillLevel: 88,
        estimatedArrival: '08:30 AM',
        status: 'Collected'
      },
      {
        stopNumber: 2,
        binId: 'BIN-002',
        location: '45 Market Plaza',
        area: 'Market Square',
        fillLevel: 92,
        estimatedArrival: '09:15 AM',
        status: 'Pending'
      },
      {
        stopNumber: 3,
        binId: 'BIN-010',
        location: '63 Farmer Market Row',
        area: 'Market Square',
        fillLevel: 76,
        estimatedArrival: '09:50 AM',
        status: 'Pending'
      },
      {
        stopNumber: 4,
        binId: 'BIN-016',
        location: '10 Civic Center Plaza',
        area: 'City Center',
        fillLevel: 89,
        estimatedArrival: '10:30 AM',
        status: 'Pending'
      }
    ],
    totalDistance: 14.8,
    estimatedDuration: 95,
    optimizationScore: 94,
    fuelSaved: 5.4,
    co2Reduced: 14.2,
    createdAt: '2026-09-20T06:30:00.000Z'
  },
  {
    id: 'RT-002',
    driverId: 'DRV-002',
    driverName: 'Elena Rodriguez',
    vehicle: 'Truck #T-102 (Mack LR Electric)',
    date: '2026-09-20',
    startLocation: 'EcoClean Municipal Depot',
    status: 'In-Progress',
    stops: [
      {
        stopNumber: 1,
        binId: 'BIN-005',
        location: '88 College Walk',
        area: 'University Campus',
        fillLevel: 95,
        estimatedArrival: '09:00 AM',
        status: 'Collected'
      },
      {
        stopNumber: 2,
        binId: 'BIN-013',
        location: '400 Science Quad Dr',
        area: 'University Campus',
        fillLevel: 84,
        estimatedArrival: '09:40 AM',
        status: 'Pending'
      },
      {
        stopNumber: 3,
        binId: 'BIN-007',
        location: '500 Forge Parkway',
        area: 'Industrial Zone',
        fillLevel: 82,
        estimatedArrival: '10:25 AM',
        status: 'Pending'
      }
    ],
    totalDistance: 18.2,
    estimatedDuration: 110,
    optimizationScore: 89,
    fuelSaved: 6.8,
    co2Reduced: 17.5,
    createdAt: '2026-09-20T07:00:00.000Z'
  },
  {
    id: 'RT-003',
    driverId: 'DRV-003',
    driverName: 'James Kowalski',
    vehicle: 'Truck #T-103 (Freightliner M2 106)',
    date: '2026-09-20',
    startLocation: 'EcoClean Municipal Depot',
    status: 'Planned',
    stops: [
      {
        stopNumber: 1,
        binId: 'BIN-006',
        location: '210 Harbour Pier Way',
        area: 'Waterfront',
        fillLevel: 78,
        estimatedArrival: '01:15 PM',
        status: 'Pending'
      },
      {
        stopNumber: 2,
        binId: 'BIN-004',
        location: '12 Elmwood Avenue',
        area: 'Residential South',
        fillLevel: 68,
        estimatedArrival: '02:00 PM',
        status: 'Pending'
      },
      {
        stopNumber: 3,
        binId: 'BIN-015',
        location: '720 Foundry Road',
        area: 'Industrial Zone',
        fillLevel: 62,
        estimatedArrival: '02:45 PM',
        status: 'Pending'
      },
      {
        stopNumber: 4,
        binId: 'BIN-008',
        location: '15 City Hall Square',
        area: 'City Center',
        fillLevel: 45,
        estimatedArrival: '03:30 PM',
        status: 'Pending'
      }
    ],
    totalDistance: 21.5,
    estimatedDuration: 105,
    optimizationScore: 92,
    fuelSaved: 4.9,
    co2Reduced: 12.8,
    createdAt: '2026-09-20T07:45:00.000Z'
  },
  {
    id: 'RT-004',
    driverId: 'DRV-004',
    driverName: 'Sarah Chen',
    vehicle: 'Truck #T-104 (Peterbilt 520)',
    date: '2026-09-19',
    startLocation: 'EcoClean Municipal Depot',
    status: 'Completed',
    stops: [
      {
        stopNumber: 1,
        binId: 'BIN-003',
        location: '78 Pinecrest Blvd',
        area: 'Residential North',
        fillLevel: 85,
        estimatedArrival: '08:45 AM',
        status: 'Collected'
      },
      {
        stopNumber: 2,
        binId: 'BIN-011',
        location: '144 Maple Crest Rd',
        area: 'Residential North',
        fillLevel: 90,
        estimatedArrival: '09:20 AM',
        status: 'Collected'
      },
      {
        stopNumber: 3,
        binId: 'BIN-018',
        location: '28 Orchard Terrace',
        area: 'Market Square',
        fillLevel: 78,
        estimatedArrival: '10:00 AM',
        status: 'Collected'
      },
      {
        stopNumber: 4,
        binId: 'BIN-009',
        location: '320 Lexington Avenue',
        area: 'Commercial District',
        fillLevel: 82,
        estimatedArrival: '10:40 AM',
        status: 'Collected'
      },
      {
        stopNumber: 5,
        binId: 'BIN-017',
        location: '255 Commerce Boulevard',
        area: 'Commercial District',
        fillLevel: 74,
        estimatedArrival: '11:15 AM',
        status: 'Collected'
      }
    ],
    totalDistance: 24.1,
    estimatedDuration: 115,
    optimizationScore: 97,
    fuelSaved: 7.2,
    co2Reduced: 18.9,
    createdAt: '2026-09-19T06:00:00.000Z'
  },
  {
    id: 'RT-005',
    driverId: 'DRV-005',
    driverName: 'Darius Thorne',
    vehicle: 'Truck #T-105 (Volvo VNR Electric)',
    date: '2026-09-19',
    startLocation: 'EcoClean Municipal Depot',
    status: 'Cancelled',
    stops: [
      {
        stopNumber: 1,
        binId: 'BIN-012',
        location: '89 Magnolia Lane',
        area: 'Residential South',
        fillLevel: 70,
        estimatedArrival: '09:00 PM',
        status: 'Skipped'
      },
      {
        stopNumber: 2,
        binId: 'BIN-014',
        location: '55 Marina Promenade',
        area: 'Waterfront',
        fillLevel: 75,
        estimatedArrival: '09:45 PM',
        status: 'Skipped'
      },
      {
        stopNumber: 3,
        binId: 'BIN-004',
        location: '12 Elmwood Avenue',
        area: 'Residential South',
        fillLevel: 80,
        estimatedArrival: '10:30 PM',
        status: 'Skipped'
      }
    ],
    totalDistance: 12.4,
    estimatedDuration: 55,
    optimizationScore: 78,
    fuelSaved: 2.1,
    co2Reduced: 5.5,
    createdAt: '2026-09-19T18:30:00.000Z'
  }
];
