import axios, { type AxiosRequestConfig } from 'axios';
import type {
  CreateIncidentPayload,
  CrewMember,
  DashboardFilter,
  Incident,
  ModuleStatus,
  StationModule,
  StationOverview,
  SupplyCrate
} from '../types/station';

const API_ROOT = '/api';

const api = axios.create({
  baseURL: API_ROOT,
  headers: {
    'Content-Type': 'application/json'
  }
});

async function request<T>(path: string, options?: AxiosRequestConfig): Promise<T> {
  try {
    const response = await api.request<T>({
      url: path,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? error.message);
    }

    throw new Error('Request failed');
  }
}

export function getOverview() {
  return request<StationOverview>('/overview');
}

export function getModules(status: DashboardFilter = 'all') {
  return request<StationModule[]>('/modules', {
    params: status === 'all' ? undefined : { status }
  });
}

export function getCrewMember(crewId: number) {
  return request<CrewMember>(`/crew/${crewId}`);
}

export function updateModuleStatus(moduleId: number, status: ModuleStatus) {
  return request<StationModule>(`/modules/${moduleId}/status`, {
    method: 'PATCH',
    data: { status }
  });
}

export function getPrioritySupplies() {
  return request<SupplyCrate[]>('/supplies/priority');
}

export function getIncidents() {
  return request<Incident[]>('/incidents');
}

export function createIncident(payload: CreateIncidentPayload) {
  return request<Incident>('/incidents', {
    method: 'POST',
    data: payload
  });
}

export function resolveIncident(incidentId: number) {
  return request<Incident>(`/incidents/${incidentId}/resolve`, {
    method: 'PATCH'
  });
}
