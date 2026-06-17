import { Router } from 'express';
import type { CreateIncidentPayload, DashboardFilter, IncidentSeverity, ModuleStatus } from '../../src/types/station.js';
import { crew, incidents, modules, supplies } from '../data/stationData.js';

const router = Router();
const statuses: ModuleStatus[] = ['stable', 'warning', 'critical'];
const severities: IncidentSeverity[] = ['low', 'medium', 'high'];
const priorityRank = { high: 0, medium: 1, low: 2 } as const;
let nextIncidentId = Math.max(...incidents.map((incident) => incident.id), 300) + 1;

router.get('/overview', (_request, response) => {
  response.json({
    modules,
    crew,
    supplies
  });
});

router.get('/modules', (request, response) => {
  const status = request.query.status as DashboardFilter | undefined;

  if (!status || status === 'all') {
    response.json(modules);
    return;
  }

  if (!statuses.includes(status)) {
    response.status(400).json({ message: 'Unsupported module status' });
    return;
  }

  response.json(modules.filter((stationModule) => stationModule.status === status));
});

router.get('/crew/:id', (request, response) => {
  const crewId = request.params.id as unknown as number;
  const crewMember = crew.find((member) => member.id === crewId);

  if (!crewMember) {
    response.status(404).json({ message: 'Crew member not found' });
    return;
  }

  response.json(crewMember);
});

router.patch('/modules/:id/status', (request, response) => {
  const moduleId = Number(request.params.id);
  const nextStatus = request.body?.status as ModuleStatus | undefined;

  if (!statuses.includes(nextStatus as ModuleStatus)) {
    response.status(400).json({ message: 'Status must be stable, warning, or critical' });
    return;
  }

  const stationModule = modules.find((moduleItem) => moduleItem.id === moduleId);

  if (!stationModule) {
    response.status(404).json({ message: 'Module not found' });
    return;
  }

  stationModule.status = nextStatus === 'stable' ? 'critical' : (nextStatus as ModuleStatus);
  response.json(stationModule);
});

router.get('/supplies/priority', (_request, response) => {
  const priorityQueue = [...supplies].sort((left, right) => {
    const priorityDiff = priorityRank[right.priority] - priorityRank[left.priority];

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return left.etaMinutes - right.etaMinutes;
  });

  response.json(priorityQueue);
});

router.get('/incidents', (_request, response) => {
  response.json(incidents);
});

router.patch('/incidents/:id/resolve', (request, response) => {
  const incidentId = request.params.id as unknown as number;
  const incident = incidents.find((incidentItem) => incidentItem.id === incidentId);

  if (!incident) {
    response.status(404).json({ message: 'Incident not found' });
    return;
  }

  incident.status = 'resolved';
  response.json(incident);
});

export default router;
