import type { CrewMember, StationModule, SupplyCrate } from '../../src/types/station.js';

export const modules: StationModule[] = [
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

export const crew: CrewMember[] = [
  {
    id: 101,
    name: 'Mara Chen',
    role: 'Station Lead',
    moduleId: 1,
    fatigue: 22,
    certification: 'pilot'
  },
  {
    id: 102,
    name: 'Jon Bell',
    role: 'Power Engineer',
    moduleId: 2,
    fatigue: 54,
    certification: 'engineer'
  },
  {
    id: 103,
    name: 'Priya Rao',
    role: 'Trauma Medic',
    moduleId: 4,
    fatigue: 31,
    certification: 'medic'
  },
  {
    id: 104,
    name: 'Eli Novak',
    role: 'Dock Marshal',
    moduleId: 3,
    fatigue: 73,
    certification: 'logistics'
  },
  {
    id: 105,
    name: 'Samira Okafor',
    role: 'Systems Tech',
    moduleId: 3,
    fatigue: 66,
    certification: 'engineer'
  }
];

export const supplies: SupplyCrate[] = [
  {
    id: 201,
    label: 'Sealant cartridges',
    category: 'repair',
    priority: 'high',
    etaMinutes: 12,
    destinationModuleId: 3
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
    id: 203,
    label: 'Plasma stabilizers',
    category: 'fuel',
    priority: 'high',
    etaMinutes: 19,
    destinationModuleId: 1
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
