/**
 * EcoClean Municipal Smart Waste Management System
 * Mock Data: Municipal Fleet Drivers
 */

export const drivers = [
  {
    id: 'DRV-001',
    name: 'Marcus Vance',
    email: 'driver@ecoclean.com',
    phone: '+1 (555) 234-5678',
    vehicle: 'Truck #T-101 (Ford F-650)',
    vehicleId: 'VH-001',
    status: 'On Route',
    shift: 'Morning',
    rating: 4.9,
    completedCollections: 284,
    assignedRoute: 'RT-001',
    active: true,
    joinedDate: '2023-03-12T08:00:00.000Z',
    licenseNumber: 'CDL-NY-849201'
  },
  {
    id: 'DRV-002',
    name: 'Elena Rodriguez',
    email: 'elena.rodriguez@ecoclean.com',
    phone: '+1 (555) 345-6789',
    vehicle: 'Truck #T-102 (Mack LR Electric)',
    vehicleId: 'VH-002',
    status: 'On Route',
    shift: 'Morning',
    rating: 4.8,
    completedCollections: 215,
    assignedRoute: 'RT-002',
    active: true,
    joinedDate: '2023-07-20T08:00:00.000Z',
    licenseNumber: 'CDL-NY-912847'
  },
  {
    id: 'DRV-003',
    name: 'James Kowalski',
    email: 'james.kowalski@ecoclean.com',
    phone: '+1 (555) 456-7890',
    vehicle: 'Truck #T-103 (Freightliner M2 106)',
    vehicleId: 'VH-003',
    status: 'Available',
    shift: 'Afternoon',
    rating: 4.6,
    completedCollections: 178,
    assignedRoute: null,
    active: true,
    joinedDate: '2024-01-15T08:00:00.000Z',
    licenseNumber: 'CDL-NY-384729'
  },
  {
    id: 'DRV-004',
    name: 'Sarah Chen',
    email: 'sarah.chen@ecoclean.com',
    phone: '+1 (555) 567-8901',
    vehicle: 'Truck #T-104 (Peterbilt 520)',
    vehicleId: 'VH-004',
    status: 'Available',
    shift: 'Afternoon',
    rating: 4.95,
    completedCollections: 242,
    assignedRoute: null,
    active: true,
    joinedDate: '2023-05-10T08:00:00.000Z',
    licenseNumber: 'CDL-NY-672910'
  },
  {
    id: 'DRV-005',
    name: 'Darius Thorne',
    email: 'darius.thorne@ecoclean.com',
    phone: '+1 (555) 678-9012',
    vehicle: 'Truck #T-105 (Volvo VNR Electric)',
    vehicleId: 'VH-005',
    status: 'Off Duty',
    shift: 'Night',
    rating: 4.2,
    completedCollections: 96,
    assignedRoute: null,
    active: true,
    joinedDate: '2024-08-01T08:00:00.000Z',
    licenseNumber: 'CDL-NY-194820'
  },
  {
    id: 'DRV-006',
    name: 'Thomas Bradley',
    email: 'thomas.bradley@ecoclean.com',
    phone: '+1 (555) 789-0123',
    vehicle: 'Truck #T-106 (Autocar ACX)',
    vehicleId: 'VH-006',
    status: 'Off Duty',
    shift: 'Morning',
    rating: 3.7,
    completedCollections: 54,
    assignedRoute: null,
    active: false,
    joinedDate: '2024-04-18T08:00:00.000Z',
    licenseNumber: 'CDL-NY-529104'
  }
];
