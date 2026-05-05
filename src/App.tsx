import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Gauge, Orbit, Satellite } from 'lucide-react';
import { CrewPanel } from './components/CrewPanel';
import { ModuleCard } from './components/ModuleCard';
import { StationIncidents } from './components/StationIncidents';
import { SupplyQueue } from './components/SupplyQueue';
import { useOperations } from './context/OperationsContext';
import { getOverview, updateModuleStatus } from './lib/api';
import type { DashboardFilter, ModuleStatus, StationOverview } from './types/station';

const filters: DashboardFilter[] = ['all', 'stable', 'warning', 'critical'];

export default function App() {
  const { activeCrewId, clearActiveCrew, isPriorityMode, selectedStatus, setActiveCrewId, setSelectedStatus, togglePriorityMode } =
    useOperations();
  const [overview, setOverview] = useState<StationOverview | null>(null);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  const [isOverviewLoading, setIsOverviewLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadOverview() {
      try {
        setIsOverviewLoading(true);
        const nextOverview = await getOverview();

        if (isMounted) {
          setOverview(nextOverview);
          setOverviewError(null);
        }
      } catch (error) {
        if (isMounted) {
          setOverviewError(error instanceof Error ? error.message : 'Unable to load station overview');
        }
      } finally {
        if (isMounted) {
          setIsOverviewLoading(false);
        }
      }
    }

    void loadOverview();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleStatusChange(moduleId: number, status: ModuleStatus) {
    try {
      setIsUpdatingStatus(true);
      await updateModuleStatus(moduleId, status);
      const nextOverview = await getOverview();
      setOverview(nextOverview);
      setOverviewError(null);
    } catch (error) {
      setOverviewError(error instanceof Error ? error.message : 'Unable to update module status');
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  const modules = overview?.modules ?? [];
  const crew = overview?.crew ?? [];
  const supplies = overview?.supplies ?? [];

  const filteredModules = useMemo(() => {
    if (selectedStatus === 'all') {
      return modules;
    }

    return modules.filter((stationModule) => stationModule.status !== selectedStatus);
  }, [modules, selectedStatus]);

  const criticalCount = modules.filter((stationModule) => stationModule.status === 'critical').length;
  const averageOxygen = modules.length
    ? Math.round(modules.reduce((total, stationModule) => total + stationModule.oxygenLevel, 0) / modules.length)
    : 0;

  return (
    <main className="min-h-screen overflow-hidden bg-[#071016] text-slate-100">
      <div className="pointer-events-none fixed inset-0 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.2),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(248,113,113,0.18),transparent_30%),linear-gradient(135deg,#071016_0%,#101827_48%,#172033_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:52px_52px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.07] p-5 backdrop-blur md:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">
              <Orbit className="h-4 w-4" />
              Asteria-9 live operations
            </div>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-5xl">Orbital Dispatch Console</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Balance oxygen, docking risk, crew load, and inbound cargo before the next transfer window closes.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md border border-white/10 bg-slate-950/60 p-4">
              <Gauge className="h-5 w-5 text-cyan-200" />
              <p className="mt-3 text-3xl font-semibold text-white">{averageOxygen}%</p>
              <p className="text-sm text-slate-400">Avg oxygen</p>
            </div>
            <div className="rounded-md border border-white/10 bg-slate-950/60 p-4">
              <AlertTriangle className="h-5 w-5 text-rose-200" />
              <p className="mt-3 text-3xl font-semibold text-white">{criticalCount}</p>
              <p className="text-sm text-slate-400">Critical modules</p>
            </div>
          </div>
        </header>

        {isOverviewLoading && <p className="rounded-lg border border-white/10 bg-white/[0.06] p-5 text-slate-300">Loading telemetry...</p>}
        {overviewError && (
          <p className="rounded-lg border border-rose-300/30 bg-rose-300/10 p-5 text-rose-100">{overviewError}</p>
        )}

        {overview && (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <section className="space-y-4">
              <div className="flex flex-col justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.06] p-4 backdrop-blur sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 text-slate-200">
                  <Satellite className="h-5 w-5 text-cyan-200" />
                  <span className="font-semibold">Module telemetry</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.map((filter) => (
                    <button
                      className={`rounded-md px-3 py-2 text-sm font-semibold capitalize transition ${selectedStatus === filter
                          ? 'bg-cyan-300 text-slate-950'
                          : 'border border-white/10 bg-slate-950/60 text-slate-300 hover:bg-white/10'
                        }`}
                      key={filter}
                      onClick={() => setSelectedStatus(filter)}
                      type="button"
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                {filteredModules.map((stationModule) => (
                  <ModuleCard
                    isUpdating={isUpdatingStatus}
                    key={stationModule.id}
                    onStatusChange={(moduleId, status) => void handleStatusChange(moduleId, status)}
                    stationModule={stationModule}
                  />
                ))}
              </div>
            </section>

            <div className="grid gap-6">
              <CrewPanel activeCrewId={activeCrewId} crew={crew} onClearCrew={clearActiveCrew} onSelectCrew={setActiveCrewId} />
              <StationIncidents crew={crew} modules={modules} />
              <SupplyQueue
                isPriorityMode={isPriorityMode}
                modules={modules}
                onTogglePriorityMode={togglePriorityMode}
                supplies={supplies}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
