import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import * as api from '../lib/api';
import type { CrewMember } from '../types/station';
import { CrewPanel } from './CrewPanel';

vi.mock('../lib/api');

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

function CrewPanelHarness({ initialActiveCrewId }: { initialActiveCrewId: number | null }) {
  const [activeCrewId, setActiveCrewId] = useState<number | null>(initialActiveCrewId);

  return (
    <CrewPanel
      activeCrewId={activeCrewId}
      crew={crew}
      onClearCrew={() => setActiveCrewId(null)}
      onSelectCrew={setActiveCrewId}
    />
  );
}

describe('CrewPanel', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(api.getCrewMember).mockImplementation(async (crewId: number) => {
      const crewMember = crew.find((member) => member.id === crewId);

      if (!crewMember) {
        throw new Error('Crew member not found');
      }

      return crewMember;
    });
  });

  test('clear active officer shows no officer selected', async () => {
    const user = userEvent.setup();
    render(<CrewPanelHarness initialActiveCrewId={104} />);

    await screen.findByText('Eli Novak');
    await user.click(screen.getByRole('button', { name: 'Clear active officer' }));

    expect(await screen.findByText('No officer selected.')).toBeInTheDocument();
  });

  test('selecting a crew member loads their details', async () => {
    const user = userEvent.setup();
    render(<CrewPanelHarness initialActiveCrewId={null} />);

    await user.click(screen.getByRole('button', { name: /Mara Chen/ }));

    expect(await screen.findByText('Station Lead')).toBeInTheDocument();
    expect(screen.getByText('Fatigue index: 22')).toBeInTheDocument();
  });
});
