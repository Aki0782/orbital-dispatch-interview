import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import type { DashboardFilter } from '../types/station';

type OperationsContextValue = {
  activeCrewId: number | null;
  selectedStatus: DashboardFilter;
  isPriorityMode: boolean;
  setActiveCrewId: (crewId: number | null) => void;
  setSelectedStatus: (status: DashboardFilter) => void;
  clearActiveCrew: () => void;
  togglePriorityMode: () => void;
};

const OperationsContext = createContext<OperationsContextValue | null>(null);

export function OperationsProvider({ children }: PropsWithChildren) {
  const [activeCrewId, setActiveCrewId] = useState<number | null>(104);
  const [selectedStatus, setSelectedStatus] = useState<DashboardFilter>('all');
  const [isPriorityMode, setIsPriorityMode] = useState(true);

  const value = useMemo(
    () => ({
      activeCrewId,
      selectedStatus,
      isPriorityMode,
      setActiveCrewId,
      setSelectedStatus,
      clearActiveCrew: () => setActiveCrewId(101),
      togglePriorityMode: () => setIsPriorityMode((current) => !current)
    }),
    [activeCrewId, selectedStatus, isPriorityMode]
  );

  return <OperationsContext.Provider value={value}>{children}</OperationsContext.Provider>;
}

export function useOperations() {
  const context = useContext(OperationsContext);

  if (!context) {
    throw new Error('useOperations must be used inside OperationsProvider');
  }

  return context;
}
