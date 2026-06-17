import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import type { StationModule, SupplyCrate } from '../types/station';
import { SupplyQueue } from './SupplyQueue';

const modules: StationModule[] = [
  {
    id: 1,
    name: 'Command Halo',
    section: 'Core',
    status: 'stable',
    oxygenLevel: 96,
    powerDraw: 42,
    crewAssigned: 4,
    capacity: 6
  },
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
  },
  {
    id: 4,
    name: 'Med Lab',
    section: 'Core',
    status: 'stable',
    oxygenLevel: 91,
    powerDraw: 37,
    crewAssigned: 2,
    capacity: 3
  }
];

const supplies: SupplyCrate[] = [
  {
    id: 201,
    label: 'Sealant cartridges',
    category: 'repair',
    priority: 'high',
    etaMinutes: 12,
    destinationModuleId: 3
  },
  {
    id: 203,
    label: 'Plasma stabilizers',
    category: 'fuel',
    priority: 'high',
    etaMinutes: 19,
    destinationModuleId: 1
  },
  {
    id: 202,
    label: 'Nutrient gel packs',
    category: 'food',
    priority: 'medium',
    etaMinutes: 28,
    destinationModuleId: 2
  },
  {
    id: 204,
    label: 'Antiseptic foam',
    category: 'medical',
    priority: 'low',
    etaMinutes: 44,
    destinationModuleId: 4
  }
];

describe('SupplyQueue', () => {
  test('renders crates in the supplied priority order', async () => {
    render(<SupplyQueue isPriorityMode={true} modules={modules} onTogglePriorityMode={() => {}} supplies={supplies} />);

    const supplyHeading = await screen.findByRole('heading', { name: 'Supply queue' });
    const supplySection = supplyHeading.closest('section');
    expect(supplySection).not.toBeNull();

    const sectionText = supplySection?.textContent ?? '';
    expect(sectionText.indexOf('Sealant cartridges')).toBeLessThan(sectionText.indexOf('Nutrient gel packs'));
    expect(sectionText.indexOf('Plasma stabilizers')).toBeLessThan(sectionText.indexOf('Antiseptic foam'));
  });

  test('priority button triggers the toggle handler', async () => {
    const user = userEvent.setup();
    const onTogglePriorityMode = vi.fn();
    render(<SupplyQueue isPriorityMode={true} modules={modules} onTogglePriorityMode={onTogglePriorityMode} supplies={supplies} />);

    await user.click(screen.getByRole('button', { name: 'Priority' }));

    expect(onTogglePriorityMode).toHaveBeenCalledTimes(1);
  });
});
