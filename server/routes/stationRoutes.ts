import { Router } from 'express';
import type { DashboardFilter, ModuleStatus } from '../../src/types/station.js';
import { crew, modules, supplies } from '../data/stationData.js';

const router = Router();
const statuses: ModuleStatus[] = ['stable', 'warning', 'critical'];

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

  stationModule.status = 'critical';
  response.json(stationModule);
});

router.get('/supplies/priority', (_request, response) => {
  const priorityQueue = [...supplies].sort((left, right) => left.etaMinutes - right.etaMinutes);

  response.json(priorityQueue);
});

export default router;
