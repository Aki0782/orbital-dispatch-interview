import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import App from './App';
import { OperationsProvider } from './context/OperationsContext';
import * as api from './lib/api';
import type { CrewMember, DashboardFilter, StationOverview } from './types/station';

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

describe('App module telemetry', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(api.getOverview).mockResolvedValue(overviewWith());
    vi.mocked(api.getModules).mockImplementation(async (status: DashboardFilter = 'all') => {
      if (status === 'all') {
        return modules;
      }

      return modules.filter((stationModule) => stationModule.status === status);
    });
    vi.mocked(api.getCrewMember).mockResolvedValue(crew[1]);
    vi.mocked(api.getPrioritySupplies).mockResolvedValue([]);
    vi.mocked(api.getIncidents).mockResolvedValue([]);
    vi.mocked(api.updateModuleStatus).mockResolvedValue({ ...modules[2], status: 'stable' });
  });

  test('status filter shows only matching modules', async () => {
    const user = userEvent.setup();
    renderApp();

    await screen.findByText('Command Halo');
    await user.click(screen.getByRole('button', { name: 'critical' }));

    expect(await screen.findByText('Docking Arm C')).toBeInTheDocument();
    expect(screen.queryByText('Command Halo')).not.toBeInTheDocument();
    expect(screen.queryByText('Hydroponics Bay')).not.toBeInTheDocument();
  });

  test('module status button updates visible status after API success', async () => {
    const user = userEvent.setup();
    const updatedModules = modules.map((stationModule) =>
      stationModule.id === 3 ? { ...stationModule, status: 'stable' as const } : stationModule
    );
    vi.mocked(api.getOverview).mockResolvedValueOnce(overviewWith()).mockResolvedValueOnce(overviewWith(updatedModules));
    vi.mocked(api.getModules).mockResolvedValueOnce(modules).mockResolvedValueOnce(updatedModules);

    renderApp();

    const dockingCard = await screen.findByText('Docking Arm C');
    expect(dockingCard.closest('article')).not.toBeNull();

    await user.click(within(dockingCard.closest('article') as HTMLElement).getByRole('button', { name: 'Mark stable' }));

    await waitFor(() => {
      const refreshedCard = screen.getByText('Docking Arm C').closest('article');
      expect(refreshedCard).not.toBeNull();
      expect(within(refreshedCard as HTMLElement).getByText('stable')).toBeInTheDocument();
    });
  });
});
