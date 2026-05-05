import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import App from './App';
import { OperationsProvider } from './context/OperationsContext';
import * as api from './lib/api';
import type { CrewMember, Incident, StationOverview } from './types/station';

vi.mock('./lib/api');

const modules = [
  {
    id: 1,
    name: 'Command Halo',
    section: 'Core',
    status: 'stable' as const,
    oxygenLevel: 96,
    powerDraw: 42,
    crewAssigned: 4,
    capacity: 6
  },
  {
    id: 2,
    name: 'Hydroponics Bay',
    section: 'Green Ring',
    status: 'warning' as const,
    oxygenLevel: 82,
    powerDraw: 61,
    crewAssigned: 3,
    capacity: 5
  },
  {
    id: 3,
    name: 'Docking Arm C',
    section: 'Outer Spine',
    status: 'critical' as const,
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
    moduleId: 1,
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

function overviewWith(nextModules = modules): StationOverview {
  return {
    modules: nextModules,
    crew,
    supplies: []
  };
}

function renderApp() {
  return render(
    <OperationsProvider>
      <App />
    </OperationsProvider>
  );
}

describe('Orbital Dispatch UI bug fixes', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(api.getOverview).mockResolvedValue(overviewWith());
    vi.mocked(api.getCrewMember).mockImplementation(async (crewId: number) => {
      const crewMember = crew.find((member) => member.id === crewId);

      if (!crewMember) {
        throw new Error('Crew member not found');
      }

      return crewMember;
    });
    vi.mocked(api.updateModuleStatus).mockResolvedValue({ ...modules[2], status: 'stable' });
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

  test('status filter shows only matching modules', async () => {
    const user = userEvent.setup();
    renderApp();

    await screen.findByText('Command Halo');
    await user.click(screen.getByRole('button', { name: 'critical' }));

    expect(screen.getByText('Docking Arm C')).toBeInTheDocument();
    expect(screen.queryByText('Command Halo')).not.toBeInTheDocument();
    expect(screen.queryByText('Hydroponics Bay')).not.toBeInTheDocument();
  });

  test('clear active officer shows no officer selected', async () => {
    const user = userEvent.setup();
    renderApp();

    await screen.findByText('Eli Novak');
    await user.click(screen.getByRole('button', { name: 'Clear active officer' }));

    expect(await screen.findByText('No officer selected.')).toBeInTheDocument();
  });

  test('valid crew selection loads crew details', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(await screen.findByRole('button', { name: /Mara Chen/ }));

    expect(await screen.findByText('Station Lead')).toBeInTheDocument();
    expect(screen.getByText('Fatigue index: 22')).toBeInTheDocument();
  });

  test('module status button updates visible status after API success', async () => {
    const user = userEvent.setup();
    const updatedModules = modules.map((stationModule) =>
      stationModule.id === 3 ? { ...stationModule, status: 'stable' as const } : stationModule
    );
    vi.mocked(api.getOverview).mockResolvedValueOnce(overviewWith()).mockResolvedValueOnce(overviewWith(updatedModules));

    renderApp();

    const dockingCard = (await screen.findByText('Docking Arm C')).closest('article');
    expect(dockingCard).not.toBeNull();

    await user.click(within(dockingCard as HTMLElement).getByRole('button', { name: 'Mark stable' }));

    await waitFor(() => {
      expect(within(dockingCard as HTMLElement).getByText('stable')).toBeInTheDocument();
    });
  });
});

describe('Station Incidents UI workflow', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(api.getOverview).mockResolvedValue(overviewWith());
    vi.mocked(api.getCrewMember).mockResolvedValue(crew[1]);
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

  test('Station Incidents panel loads incidents', async () => {
    renderApp();

    expect(await screen.findByRole('heading', { name: 'Station Incidents' })).toBeInTheDocument();
    expect(await screen.findByText('Docking collar pressure alert')).toBeInTheDocument();
    expect(screen.getByText('Hydroponics misting drift')).toBeInTheDocument();
  });

  test('creating an incident adds it to the incident list', async () => {
    const user = userEvent.setup();
    renderApp();

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
    renderApp();

    await screen.findByText('Docking collar pressure alert');
    await user.click(screen.getByRole('button', { name: /Resolve Docking collar pressure alert/ }));

    expect(await screen.findByText('resolved')).toBeInTheDocument();
  });

  test('invalid incident form shows a useful error', async () => {
    const user = userEvent.setup();
    vi.mocked(api.createIncident).mockRejectedValue(new Error('title is required'));

    renderApp();

    await screen.findByRole('heading', { name: 'Station Incidents' });
    await user.click(screen.getByRole('button', { name: 'Create incident' }));

    expect(await screen.findByText('title is required')).toBeInTheDocument();
  });
});
