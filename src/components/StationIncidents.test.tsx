import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import * as api from '../lib/api';
import type { CrewMember, Incident, StationModule } from '../types/station';
import { StationIncidents } from './StationIncidents';

vi.mock('../lib/api');

const modules: StationModule[] = [
  {
    id: 2,
    name: 'Hydroponics Bay',
    section: 'Green Ring',
    status: 'warning',
    oxygenLevel: 82,
    powerDraw: 61,
    crewAssigned: 3,
    capacity: 5
  },
  {
    id: 3,
    name: 'Docking Arm C',
    section: 'Outer Spine',
    status: 'critical',
    oxygenLevel: 68,
    powerDraw: 88,
    crewAssigned: 2,
    capacity: 4
  }
];

const crew: CrewMember[] = [
  {
    id: 101,
    name: 'Mara Chen',
    role: 'Station Lead',
    moduleId: 2,
    fatigue: 22,
    certification: 'pilot'
  },
  {
    id: 104,
    name: 'Eli Novak',
    role: 'Dock Marshal',
    moduleId: 3,
    fatigue: 73,
    certification: 'logistics'
  }
];

const incidents: Incident[] = [
  {
    id: 301,
    title: 'Docking collar pressure alert',
    severity: 'high',
    status: 'open',
    moduleId: 3,
    assignedCrewId: 104,
    createdAt: '2026-05-05T12:00:00.000Z'
  },
  {
    id: 302,
    title: 'Hydroponics misting drift',
    severity: 'medium',
    status: 'resolved',
    moduleId: 2,
    assignedCrewId: 101,
    createdAt: '2026-05-05T12:05:00.000Z'
  }
];

const scrollableIncidents: Incident[] = [
  ...incidents,
  {
    id: 303,
    title: 'Solar panel vibration spike',
    severity: 'medium',
    status: 'open',
    moduleId: 2,
    assignedCrewId: 101,
    createdAt: '2026-05-05T12:10:00.000Z'
  }
];

describe('StationIncidents', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(api.getIncidents).mockResolvedValue(incidents);
    vi.mocked(api.createIncident).mockResolvedValue({
      id: 303,
      title: 'Solar panel vibration spike',
      severity: 'medium',
      status: 'open',
      moduleId: 2,
      assignedCrewId: 101,
      createdAt: '2026-05-05T12:10:00.000Z'
    });
    vi.mocked(api.resolveIncident).mockResolvedValue({ ...incidents[0], status: 'resolved' });
  });

  test('loads incidents', async () => {
    render(<StationIncidents crew={crew} modules={modules} />);

    expect(await screen.findByRole('heading', { name: 'Station Incidents' })).toBeInTheDocument();
    expect(await screen.findByText('Docking collar pressure alert')).toBeInTheDocument();
    expect(screen.getByText('Hydroponics misting drift')).toBeInTheDocument();
  });

  test('creating an incident adds it to the incident list', async () => {
    const user = userEvent.setup();
    render(<StationIncidents crew={crew} modules={modules} />);

    await screen.findByRole('heading', { name: 'Station Incidents' });
    await user.type(screen.getByLabelText('Incident title'), 'Solar panel vibration spike');
    await user.selectOptions(screen.getByLabelText('Severity'), 'medium');
    await user.selectOptions(screen.getByLabelText('Module'), '2');
    await user.selectOptions(screen.getByLabelText('Assigned crew'), '101');
    await user.click(screen.getByRole('button', { name: 'Create incident' }));

    expect(await screen.findByText('Solar panel vibration spike')).toBeInTheDocument();
  });

  test('resolving an incident marks it resolved', async () => {
    const user = userEvent.setup();
    render(<StationIncidents crew={crew} modules={modules} />);

    await screen.findByText('Docking collar pressure alert');
    await user.click(screen.getByRole('button', { name: /Resolve Docking collar pressure alert/ }));

    await waitFor(() => {
      const incidentCard = screen.getByText('Docking collar pressure alert').closest('article');
      expect(incidentCard).not.toBeNull();
      expect(within(incidentCard as HTMLElement).getByText('resolved')).toBeInTheDocument();
    });
  });

  test('invalid incident form shows a useful error', async () => {
    const user = userEvent.setup();
    vi.mocked(api.createIncident).mockRejectedValue(new Error('title is required'));
    render(<StationIncidents crew={crew} modules={modules} />);

    await screen.findByRole('heading', { name: 'Station Incidents' });
    await user.click(screen.getByRole('button', { name: 'Create incident' }));

    expect(await screen.findByText('title is required')).toBeInTheDocument();
  });

  test('incident list becomes scrollable when more than two incidents are present', async () => {
    vi.mocked(api.getIncidents).mockResolvedValue(scrollableIncidents);
    render(<StationIncidents crew={crew} modules={modules} />);

    const incidentList = await screen.findByTestId('incident-list');

    expect(incidentList).toHaveClass('max-h-80');
    expect(incidentList).toHaveClass('overflow-y-auto');
  });
});
