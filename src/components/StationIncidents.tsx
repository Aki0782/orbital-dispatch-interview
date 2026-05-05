import { CheckCircle2, ShieldAlert } from 'lucide-react';
import type { CrewMember, IncidentSeverity, StationModule } from '../types/station';

type StationIncidentsProps = {
  modules: StationModule[];
  crew: CrewMember[];
};

const severityOptions: IncidentSeverity[] = ['low', 'medium', 'high'];

const displayIncidents = [
  {
    id: 301,
    title: 'Docking collar pressure alert',
    severity: 'High',
    status: 'open',
    moduleName: 'Docking Arm C',
    crewName: 'Eli Novak'
  },
  {
    id: 302,
    title: 'Hydroponics misting drift',
    severity: 'Medium',
    status: 'resolved',
    moduleName: 'Hydroponics Bay',
    crewName: 'Jon Bell'
  }
];

export function StationIncidents({ modules, crew }: StationIncidentsProps) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-cyan-200">Station safety</p>
          <h2 className="text-lg font-semibold text-white">Station Incidents</h2>
        </div>
        <ShieldAlert className="h-5 w-5 text-cyan-200" />
      </div>

      <div className="mt-4 grid gap-3">
        <label className="grid gap-1 text-sm text-slate-300" htmlFor="incident-title">
          Incident title
          <input
            className="rounded-md border border-white/10 bg-slate-950/70 px-3 py-2 text-white outline-none transition focus:border-cyan-300"
            defaultValue=""
            id="incident-title"
            placeholder="Solar panel vibration spike"
          />
        </label>

        <label className="grid gap-1 text-sm text-slate-300" htmlFor="incident-severity">
          Severity
          <select
            className="rounded-md border border-white/10 bg-slate-950/70 px-3 py-2 text-white outline-none transition focus:border-cyan-300"
            id="incident-severity"
            defaultValue="low"
          >
            {severityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm text-slate-300" htmlFor="incident-module">
          Module
          <select
            className="rounded-md border border-white/10 bg-slate-950/70 px-3 py-2 text-white outline-none transition focus:border-cyan-300"
            id="incident-module"
            defaultValue={modules[0]?.id}
          >
            {modules.map((stationModule) => (
              <option key={stationModule.id} value={stationModule.id}>
                {stationModule.name} ({stationModule.section})
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm text-slate-300" htmlFor="incident-crew">
          Assigned crew
          <select
            className="rounded-md border border-white/10 bg-slate-950/70 px-3 py-2 text-white outline-none transition focus:border-cyan-300"
            id="incident-crew"
            defaultValue={crew[0]?.id}
          >
            {crew.map((crewMember) => (
              <option key={crewMember.id} value={crewMember.id}>
                {crewMember.name} ({crewMember.certification})
              </option>
            ))}
          </select>
        </label>

        <button
          className="rounded-md bg-cyan-300 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          type="button"
        >
          Create incident
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        {displayIncidents.map((incident) => (
          <article className="rounded-md border border-white/10 bg-slate-950/70 p-4" key={incident.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-white">{incident.title}</p>
                <p className="mt-1 text-sm text-slate-400">
                  {incident.moduleName} · {incident.crewName}
                </p>
              </div>
              <span
                className={`rounded-full border px-2 py-1 text-xs font-semibold uppercase ${
                  incident.status === 'open'
                    ? 'border-amber-300/40 bg-amber-300/15 text-amber-100'
                    : 'border-emerald-300/40 bg-emerald-300/15 text-emerald-100'
                }`}
              >
                {incident.status === 'resolved' ? 'Resolved' : 'open'}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-300">Severity: {incident.severity}</span>
              {incident.status === 'open' ? (
                <button
                  aria-label={`Resolve ${incident.title}`}
                  className="rounded-md border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                  type="button"
                >
                  Resolve
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 text-emerald-200">
                  <CheckCircle2 className="h-4 w-4" />
                  Complete
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
