import { PackageCheck } from 'lucide-react';
import type { StationModule, SupplyCrate } from '../types/station';

type SupplyQueueProps = {
  supplies: SupplyCrate[];
  modules: StationModule[];
  isPriorityMode: boolean;
  onTogglePriorityMode: () => void;
};

export function SupplyQueue({ supplies, modules, isPriorityMode, onTogglePriorityMode }: SupplyQueueProps) {
  const visibleSupplies = isPriorityMode
    ? [...supplies].sort((left, right) => {
        const priorityRank = { high: 0, medium: 1, low: 2 };
        return priorityRank[left.priority] - priorityRank[right.priority];
      })
    : supplies;

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-cyan-200">Inbound cargo</p>
          <h2 className="text-lg font-semibold text-white">Supply queue</h2>
        </div>
        <button
          className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
            isPriorityMode ? 'bg-cyan-300 text-slate-950 hover:bg-cyan-200' : 'border border-white/10 text-slate-200 hover:bg-white/10'
          }`}
          onClick={onTogglePriorityMode}
          type="button"
        >
          Priority
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        {visibleSupplies.map((crate) => {
          const destination = modules.find((stationModule) => stationModule.id === crate.destinationModuleId);

          return (
            <div className="rounded-md border border-white/10 bg-slate-950/70 p-4" key={crate.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{crate.label}</p>
                  <p className="mt-1 text-sm text-slate-400">{destination?.name ?? 'Unassigned'}</p>
                </div>
                <PackageCheck className="h-5 w-5 text-cyan-200" />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="capitalize text-slate-300">{crate.category}</span>
                <span className={crate.priority === 'high' ? 'text-rose-200' : 'text-slate-300'}>{crate.etaMinutes} min</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
