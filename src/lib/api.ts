import { DashboardStats, Incident, IncidentStatus, StatusUpdate, User, UserType } from '@/types';

const DEFAULT_API_BASE_URL = 'http://localhost:8000/api';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, '');

const ACCESS_TOKEN_KEY = 'firewatcher.access_token';
const REFRESH_TOKEN_KEY = 'firewatcher.refresh_token';
const USER_KEY = 'firewatcher.user';

type Nullable<T> = T | null;

interface ApiUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  user_type: UserType;
  badge_number: Nullable<string>;
  fire_station: Nullable<string>;
  created_at: string;
}

interface ApiAuthResponse {
  user: ApiUser;
  tokens: {
    refresh: string;
    access: string;
  };
}

interface ApiIncidentPhoto {
  id: string;
  image: string;
  uploaded_at: string;
}

interface ApiIncidentStatusUpdate {
  id: string;
  status: IncidentStatus;
  updated_by: Nullable<ApiUser>;
  notes: Nullable<string>;
  timestamp: string;
}

interface ApiIncident {
  id: string;
  reporter?: Nullable<ApiUser>;
  reporter_name: string;
  reporter_phone: string;
  lat: string | number;
  lng: string | number;
  address: string;
  description: string;
  status: IncidentStatus;
  photos?: ApiIncidentPhoto[];
  status_updates?: ApiIncidentStatusUpdate[];
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: Nullable<string>;
  previous: Nullable<string>;
  results: T[];
}

export interface StoredTokens {
  access: string;
  refresh: string;
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  auth?: boolean;
  body?: BodyInit | Record<string, unknown> | null;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, data: unknown, message?: string) {
    super(message || extractErrorMessage(data) || `Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function isBrowser() {
  return typeof window !== 'undefined';
}

function readLocalStorage(key: string): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(key);
}

function writeLocalStorage(key: string, value: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, value);
}

function removeLocalStorage(key: string) {
  if (!isBrowser()) return;
  window.localStorage.removeItem(key);
}

export function getStoredTokens(): StoredTokens | null {
  const access = readLocalStorage(ACCESS_TOKEN_KEY);
  const refresh = readLocalStorage(REFRESH_TOKEN_KEY);
  if (!access || !refresh) return null;
  return { access, refresh };
}

export function setStoredTokens(tokens: StoredTokens) {
  writeLocalStorage(ACCESS_TOKEN_KEY, tokens.access);
  writeLocalStorage(REFRESH_TOKEN_KEY, tokens.refresh);
}

export function clearStoredTokens() {
  removeLocalStorage(ACCESS_TOKEN_KEY);
  removeLocalStorage(REFRESH_TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const raw = readLocalStorage(USER_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as User & { createdAt: string };
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
    };
  } catch {
    removeLocalStorage(USER_KEY);
    return null;
  }
}

export function setStoredUser(user: User) {
  writeLocalStorage(USER_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  removeLocalStorage(USER_KEY);
}

function extractErrorMessage(data: unknown): string | null {
  if (!data) return null;
  if (typeof data === 'string') return data;

  if (typeof data === 'object') {
    const maybeDetail = (data as { detail?: unknown }).detail;
    if (typeof maybeDetail === 'string') return maybeDetail;

    for (const value of Object.values(data as Record<string, unknown>)) {
      if (Array.isArray(value) && typeof value[0] === 'string') {
        return value[0];
      }
      if (typeof value === 'string') {
        return value;
      }
    }
  }

  return null;
}

function buildUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

async function parseResponseBody(response: Response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return text || null;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = false, headers, body, ...rest } = options;
  const requestHeaders = new Headers(headers || {});
  const tokens = getStoredTokens();

  const isFormData = body instanceof FormData;
  let requestBody: BodyInit | null | undefined = null;

  if (body == null) {
    requestBody = body;
  } else if (isFormData || typeof body === 'string' || body instanceof Blob) {
    requestBody = body as BodyInit;
  } else {
    requestHeaders.set('Content-Type', 'application/json');
    requestBody = JSON.stringify(body);
  }

  if (auth && tokens?.access) {
    requestHeaders.set('Authorization', `Bearer ${tokens.access}`);
  }

  const response = await fetch(buildUrl(path), {
    ...rest,
    headers: requestHeaders,
    body: requestBody,
  });

  const parsedBody = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiError(response.status, parsedBody);
  }

  return parsedBody as T;
}

export function mapApiUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    name: apiUser.name,
    phone: apiUser.phone,
    userType: apiUser.user_type,
    badgeNumber: apiUser.badge_number || undefined,
    fireStation: apiUser.fire_station || undefined,
    createdAt: new Date(apiUser.created_at),
  };
}

export function mapApiStatusUpdate(incidentId: string, update: ApiIncidentStatusUpdate): StatusUpdate {
  return {
    id: update.id,
    incidentId,
    status: update.status,
    updatedBy: update.updated_by?.id || 'system',
    updatedByName: update.updated_by?.name || 'System',
    notes: update.notes || undefined,
    timestamp: new Date(update.timestamp),
  };
}

export function mapApiIncident(apiIncident: ApiIncident): Incident {
  return {
    id: apiIncident.id,
    reporterId: apiIncident.reporter?.id || '',
    reporterName: apiIncident.reporter_name,
    reporterPhone: apiIncident.reporter_phone,
    locationLat: Number(apiIncident.lat),
    locationLng: Number(apiIncident.lng),
    address: apiIncident.address,
    description: apiIncident.description,
    photos: (apiIncident.photos || []).map((photo) => photo.image),
    status: apiIncident.status,
    createdAt: new Date(apiIncident.created_at),
    updatedAt: new Date(apiIncident.updated_at),
  };
}

export async function loginRequest(email: string, password: string) {
  return apiRequest<ApiAuthResponse>('/auth/login/', {
    method: 'POST',
    body: { email, password },
  });
}

export async function registerRequest(payload: {
  email: string;
  name: string;
  phone: string;
  password: string;
  password_confirm: string;
  user_type: UserType;
  badge_number?: string;
  fire_station?: string;
}) {
  return apiRequest<ApiAuthResponse>('/auth/register/', {
    method: 'POST',
    body: payload,
  });
}

export async function currentUserRequest() {
  return apiRequest<ApiUser>('/auth/me/', {
    method: 'GET',
    auth: true,
  });
}

export async function logoutRequest(refresh: string) {
  return apiRequest<{ message: string }>('/auth/logout/', {
    method: 'POST',
    auth: true,
    body: { refresh },
  });
}

export async function listIncidentsRequest() {
  return apiRequest<PaginatedResponse<ApiIncident>>('/incidents/', {
    method: 'GET',
    auth: true,
  });
}

export async function createIncidentRequest(payload: {
  lat: number;
  lng: number;
  address: string;
  description: string;
  reporter_name: string;
  reporter_phone: string;
}) {
  return apiRequest<ApiIncident>('/incidents/', {
    method: 'POST',
    auth: !!getStoredTokens()?.access,
    body: payload,
  });
}

export async function incidentDetailRequest(id: string) {
  return apiRequest<ApiIncident>(`/incidents/${id}/`, {
    method: 'GET',
    auth: true,
  });
}

export async function incidentUpdatesRequest(id: string) {
  return apiRequest<ApiIncidentStatusUpdate[]>(`/incidents/${id}/updates/`, {
    method: 'GET',
    auth: true,
  });
}

export async function updateIncidentStatusRequest(
  id: string,
  payload: { status: IncidentStatus; notes?: string },
) {
  return apiRequest<ApiIncident>(`/incidents/${id}/status/`, {
    method: 'PATCH',
    auth: true,
    body: payload,
  });
}

export async function dashboardStatsRequest() {
  return apiRequest<DashboardStats>('/dashboard/stats/', {
    method: 'GET',
    auth: true,
  });
}

export function mapIncidentUpdates(incidentId: string, updates: ApiIncidentStatusUpdate[]) {
  return updates.map((update) => mapApiStatusUpdate(incidentId, update));
}

export function mapIncidentWithUpdates(apiIncident: ApiIncident): {
  incident: Incident;
  updates: StatusUpdate[];
} {
  return {
    incident: mapApiIncident(apiIncident),
    updates: mapIncidentUpdates(apiIncident.id, apiIncident.status_updates || []),
  };
}

