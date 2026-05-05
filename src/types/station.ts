export type ModuleStatus = 'stable' | 'warning' | 'critical';

export type StationModule = {
  id: number;
  name: string;
  section: string;
  status: ModuleStatus;
  oxygenLevel: number;
  powerDraw: number;
  crewAssigned: number;
  capacity: number;
};

export type CrewMember = {
  id: number;
  name: string;
  role: string;
  moduleId: number;
  fatigue: number;
  certification: 'pilot' | 'engineer' | 'medic' | 'logistics';
};

export type SupplyCrate = {
  id: number;
  label: string;
  category: 'medical' | 'repair' | 'food' | 'fuel';
  priority: 'low' | 'medium' | 'high';
  etaMinutes: number;
  destinationModuleId: number;
};

export type IncidentSeverity = 'low' | 'medium' | 'high';

export type IncidentStatus = 'open' | 'resolved';

export type Incident = {
  id: number;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  moduleId: number;
  assignedCrewId: number;
  createdAt: string;
};

export type CreateIncidentPayload = {
  title: string;
  severity: IncidentSeverity;
  moduleId: number;
  assignedCrewId: number;
};

export type StationOverview = {
  modules: StationModule[];
  crew: CrewMember[];
  supplies: SupplyCrate[];
};

export type DashboardFilter = 'all' | ModuleStatus;
