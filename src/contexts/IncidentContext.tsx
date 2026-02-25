import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { DashboardStats, Incident, IncidentStatus, StatusUpdate } from '@/types';
import {
  ApiError,
  createIncidentRequest,
  dashboardStatsRequest,
  incidentDetailRequest,
  incidentUpdatesRequest,
  listIncidentsRequest,
  mapApiIncident,
  mapIncidentUpdates,
  mapIncidentWithUpdates,
  updateIncidentStatusRequest,
} from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface IncidentContextType {
  incidents: Incident[];
  statusUpdates: StatusUpdate[];
  dashboardStats: DashboardStats | null;
  isLoading: boolean;
  refreshIncidents: () => Promise<void>;
  refreshDashboardStats: () => Promise<void>;
  fetchIncidentById: (id: string) => Promise<Incident | undefined>;
  addIncident: (incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Incident>;
  updateIncidentStatus: (
    incidentId: string,
    status: IncidentStatus,
    updatedBy: string,
    updatedByName: string,
    notes?: string
  ) => Promise<void>;
  getIncidentById: (id: string) => Incident | undefined;
  getStatusUpdates: (incidentId: string) => StatusUpdate[];
  getUserIncidents: (userId: string) => Incident[];
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

function sortIncidents(items: Incident[]) {
  return [...items].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

function sortUpdates(items: StatusUpdate[]) {
  return [...items].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

export function IncidentProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const upsertIncident = (incident: Incident) => {
    setIncidents((prev) => {
      const next = [incident, ...prev.filter((item) => item.id !== incident.id)];
      return sortIncidents(next);
    });
  };

  const replaceIncidentUpdates = (incidentId: string, updates: StatusUpdate[]) => {
    setStatusUpdates((prev) => {
      const otherUpdates = prev.filter((update) => update.incidentId !== incidentId);
      return [...otherUpdates, ...sortUpdates(updates)];
    });
  };

  const refreshIncidents = async () => {
    if (!isAuthenticated) {
      setIncidents([]);
      setStatusUpdates([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await listIncidentsRequest();
      setIncidents(sortIncidents(response.results.map(mapApiIncident)));
    } finally {
      setIsLoading(false);
    }
  };

  const refreshDashboardStats = async () => {
    if (!isAuthenticated || user?.userType !== 'fire_team') {
      setDashboardStats(null);
      return;
    }

    try {
      const stats = await dashboardStatsRequest();
      setDashboardStats(stats);
    } catch (error) {
      if (error instanceof ApiError && (error.status === 403 || error.status === 404)) {
        setDashboardStats(null);
        return;
      }
      throw error;
    }
  };

  const fetchIncidentById = async (id: string) => {
    try {
      const detail = await incidentDetailRequest(id);
      const mapped = mapIncidentWithUpdates(detail);
      upsertIncident(mapped.incident);
      replaceIncidentUpdates(id, mapped.updates);
      return mapped.incident;
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        const updates = await incidentUpdatesRequest(id);
        replaceIncidentUpdates(id, mapIncidentUpdates(id, updates));
      }
      throw error;
    }
  };

  const addIncident = async (
    incidentData: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Incident> => {
    const created = await createIncidentRequest({
      lat: incidentData.locationLat,
      lng: incidentData.locationLng,
      address: incidentData.address,
      description: incidentData.description,
      reporter_name: incidentData.reporterName,
      reporter_phone: incidentData.reporterPhone,
    });

    const mapped = mapIncidentWithUpdates(created);
    upsertIncident(mapped.incident);
    replaceIncidentUpdates(mapped.incident.id, mapped.updates);

    if (user?.userType === 'fire_team') {
      try {
        await refreshDashboardStats();
      } catch {
        // Ignore dashboard refresh failures after a successful create.
      }
    }

    return mapped.incident;
  };

  const updateIncidentStatus = async (
    incidentId: string,
    status: IncidentStatus,
    _updatedBy: string,
    _updatedByName: string,
    notes?: string
  ) => {
    const updated = await updateIncidentStatusRequest(incidentId, {
      status,
      notes: notes?.trim() ? notes : undefined,
    });

    const mapped = mapIncidentWithUpdates(updated);
    upsertIncident(mapped.incident);
    replaceIncidentUpdates(incidentId, mapped.updates);
    try {
      await refreshDashboardStats();
    } catch {
      // Ignore dashboard refresh failures after a successful status update.
    }
  };

  const getIncidentById = (id: string) => incidents.find((incident) => incident.id === id);

  const getStatusUpdates = (incidentId: string) =>
    sortUpdates(statusUpdates.filter((update) => update.incidentId === incidentId));

  const getUserIncidents = (userId: string) =>
    incidents.filter((incident) => !incident.reporterId || incident.reporterId === userId);

  useEffect(() => {
    if (!isAuthenticated) {
      setIncidents([]);
      setStatusUpdates([]);
      setDashboardStats(null);
      return;
    }

    refreshIncidents().catch(() => {
      // Let consuming pages surface errors for specific operations.
    });
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (user?.userType !== 'fire_team') {
      setDashboardStats(null);
      return;
    }

    refreshDashboardStats().catch(() => {
      // Dashboard page has a derived fallback from incidents.
    });
  }, [isAuthenticated, user?.userType]);

  return (
    <IncidentContext.Provider
      value={{
        incidents,
        statusUpdates,
        dashboardStats,
        isLoading,
        refreshIncidents,
        refreshDashboardStats,
        fetchIncidentById,
        addIncident,
        updateIncidentStatus,
        getIncidentById,
        getStatusUpdates,
        getUserIncidents,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
}

export function useIncidents() {
  const context = useContext(IncidentContext);
  if (context === undefined) {
    throw new Error('useIncidents must be used within an IncidentProvider');
  }
  return context;
}
