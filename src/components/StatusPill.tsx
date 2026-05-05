import type { ModuleStatus } from '../types/station';

const statusStyles: Record<ModuleStatus, string> = {
  stable: 'border-emerald-300/40 bg-emerald-300/15 text-emerald-100',
  warning: 'border-amber-300/40 bg-amber-300/15 text-amber-100',
  critical: 'border-rose-300/40 bg-rose-300/15 text-rose-100'
};

export function StatusPill({ status }: { status: ModuleStatus }) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyles[status]}`}>
      {status}
    </span>
  );
}
