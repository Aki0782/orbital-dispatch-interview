import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import type { StationModule } from '../types/station';
import { ModuleCard } from './ModuleCard';

const stationModule: StationModule = {
  id: 3,
  name: 'Docking Arm C',
  section: 'Outer Spine',
  status: 'critical',
  oxygenLevel: 68,
  powerDraw: 88,
  crewAssigned: 2,
  capacity: 4
};

describe('ModuleCard', () => {
  test('renders the current module status', () => {
    render(<ModuleCard isUpdating={false} onStatusChange={() => {}} stationModule={stationModule} />);

    expect(screen.getByText('critical')).toBeInTheDocument();
  });

  test('Mark stable requests a stable status update', async () => {
    const user = userEvent.setup();
    const onStatusChange = vi.fn();

    render(<ModuleCard isUpdating={false} onStatusChange={onStatusChange} stationModule={stationModule} />);

    await user.click(screen.getByRole('button', { name: 'Mark stable' }));

    expect(onStatusChange).toHaveBeenCalledWith(3, 'stable');
  });
});
