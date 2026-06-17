import { Activity, ShieldCheck, Users } from 'lucide-react';
import type { ModuleStatus, StationModule } from '../types/station';
import { MetricBar } from './MetricBar';
import { StatusPill } from './StatusPill';

type ModuleCardProps = {
  stationModule: StationModule;
  isUpdating: boolean;
  onStatusChange: (moduleId: number, status: ModuleStatus) => void;
};

export function ModuleCard({ stationModule, isUpdating, onStatusChange }: ModuleCardProps) {
  const oxygenTone = stationModule.oxygenLevel < 75 ? 'rose' : stationModule.oxygenLevel < 88 ? 'amber' : 'cyan';
  const powerTone = stationModule.powerDraw > 80 ? 'rose' : stationModule.powerDraw > 60 ? 'amber' : 'cyan';

  return (
    <article className="rounded-lg border border-white/10 bg-slate-950/70 p-5 shadow-glow backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-cyan-200">{stationModule.section}</p>
          <h3 className="mt-1 text-xl font-semibold text-white">{stationModule.name}</h3>
        </div>
        <StatusPill status={stationModule.status} />
      </div>

      <div className="mt-5 grid gap-4">
        <MetricBar label="Oxygen reserve" value={stationModule.oxygenLevel} tone={oxygenTone} />
        <MetricBar label="Power draw" value={stationModule.powerDraw} tone={powerTone} />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-slate-300">
        <span className="inline-flex items-center gap-2">
          <Users className="h-4 w-4 text-cyan-200" />
          {stationModule.crewAssigned}/{stationModule.capacity} crew
        </span>
        <span className="inline-flex items-center gap-2">
          {stationModule.status === 'stable' ? (
            <ShieldCheck className="h-4 w-4 text-emerald-200" />
          ) : (
            <Activity className="h-4 w-4 text-amber-200" />
          )}
          Live telemetry
        </span>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          className="rounded-md bg-cyan-300 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isUpdating}
          onClick={() => onStatusChange(stationModule.id, 'warning')}
          type="button"
        >
          Mark stable
        </button>
        <button
          className="rounded-md border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isUpdating}
          onClick={() => onStatusChange(stationModule.id, 'warning')}
          type="button"
        >
          Flag warning
        </button>
      </div>
    </article>
  );
}
