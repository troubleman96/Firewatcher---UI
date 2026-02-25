export type UserType = 'public' | 'fire_team' | 'admin';

export type IncidentStatus = 
  | 'new'
  | 'enroute'
  | 'arrived'
  | 'fighting'
  | 'extinguished'
  | 'closed';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: UserType;
  badgeNumber?: string;
  fireStation?: string;
  createdAt: Date;
}

export interface Incident {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterPhone: string;
  locationLat: number;
  locationLng: number;
  address: string;
  description: string;
  photos: string[];
  status: IncidentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface StatusUpdate {
  id: string;
  incidentId: string;
  status: IncidentStatus;
  updatedBy: string;
  updatedByName: string;
  notes?: string;
  timestamp: Date;
}

export interface DashboardStats {
  new: number;
  active: number;
  resolved: number;
  total: number;
}

export const STATUS_LABELS: Record<IncidentStatus, string> = {
  new: 'New Report',
  enroute: 'On Our Way',
  arrived: 'Arrived at Scene',
  fighting: 'Fighting Fire',
  extinguished: 'Fire Extinguished',
  closed: 'Incident Closed',
};

export const STATUS_ORDER: IncidentStatus[] = [
  'new',
  'enroute',
  'arrived',
  'fighting',
  'extinguished',
  'closed',
];
