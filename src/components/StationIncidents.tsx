import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { createIncident, getIncidents, resolveIncident } from '../lib/api';
import type { CrewMember, Incident, IncidentSeverity, StationModule } from '../types/station';

type StationIncidentsProps = {
  modules: StationModule[];
  crew: CrewMember[];
};

const severityOptions: IncidentSeverity[] = ['low', 'medium', 'high'];

export function StationIncidents({ modules, crew }: StationIncidentsProps) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [incidentError, setIncidentError] = useState<string | null>(null);
  const [incidentTitle, setIncidentTitle] = useState('');
  const [incidentSeverity, setIncidentSeverity] = useState<IncidentSeverity>('low');
  const [assignedModuleId, setAssignedModuleId] = useState<number | null>(modules[0]?.id ?? null);
  const [assignedCrewId, setAssignedCrewId] = useState<number | null>(crew[0]?.id ?? null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resolvingIncidentId, setResolvingIncidentId] = useState<number | null>(null);

  const moduleLookup = useMemo(() => new Map(modules.map((stationModule) => [stationModule.id, stationModule])), [modules]);
  const crewLookup = useMemo(() => new Map(crew.map((crewMember) => [crewMember.id, crewMember])), [crew]);

  useEffect(() => {
    if (assignedModuleId === null && modules.length > 0) {
      setAssignedModuleId(modules[0].id);
      return;
    }

    if (assignedModuleId !== null && !moduleLookup.has(assignedModuleId)) {
      setAssignedModuleId(modules[0]?.id ?? null);
    }
  }, [assignedModuleId, moduleLookup, modules]);

  useEffect(() => {
    if (assignedCrewId === null && crew.length > 0) {
      setAssignedCrewId(crew[0].id);
      return;
    }

    if (assignedCrewId !== null && !crewLookup.has(assignedCrewId)) {
      setAssignedCrewId(crew[0]?.id ?? null);
    }
  }, [assignedCrewId, crew, crewLookup]);

  useEffect(() => {
    let isMounted = true;

    async function loadIncidents() {
      try {
        setIsLoading(true);
        const nextIncidents = await getIncidents();

        if (isMounted) {
          setIncidents(nextIncidents);
          setIncidentError(null);
        }
      } catch (error) {
        if (isMounted) {
          setIncidentError(error instanceof Error ? error.message : 'Unable to load incidents');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadIncidents();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleCreateIncident() {
    if (assignedModuleId === null || assignedCrewId === null) {
      setIncidentError('moduleId and assignedCrewId are required');
      return;
    }

    try {
      setIsSubmitting(true);
      const nextIncident = await createIncident({
        title: incidentTitle,
        severity: incidentSeverity,
        moduleId: assignedModuleId,
        assignedCrewId
      });

      setIncidents((currentIncidents) => [nextIncident, ...currentIncidents]);
      setIncidentTitle('');
      setIncidentSeverity('low');
      setIncidentError(null);
    } catch (error) {
      setIncidentError(error instanceof Error ? error.message : 'Unable to create incident');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResolveIncident(incidentId: number) {
    try {
      setResolvingIncidentId(incidentId);
      const resolvedIncident = await resolveIncident(incidentId);

      setIncidents((currentIncidents) =>
        currentIncidents.map((incident) => (incident.id === resolvedIncident.id ? resolvedIncident : incident))
      );
      setIncidentError(null);
    } catch (error) {
      setIncidentError(error instanceof Error ? error.message : 'Unable to resolve incident');
    } finally {
      setResolvingIncidentId(null);
    }
  }

  const isScrollable = incidents.length > 2;

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
            id="incident-title"
            onChange={(event) => setIncidentTitle(event.target.value)}
            placeholder="Solar panel vibration spike"
            value={incidentTitle}
          />
        </label>

        <label className="grid gap-1 text-sm text-slate-300" htmlFor="incident-severity">
          Severity
          <select
            className="rounded-md border border-white/10 bg-slate-950/70 px-3 py-2 text-white outline-none transition focus:border-cyan-300"
            disabled={isSubmitting}
            id="incident-severity"
            onChange={(event) => setIncidentSeverity(event.target.value as IncidentSeverity)}
            value={incidentSeverity}
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
            disabled={isSubmitting || modules.length === 0}
            id="incident-module"
            onChange={(event) => setAssignedModuleId(Number(event.target.value))}
            value={assignedModuleId ?? ''}
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
            disabled={isSubmitting || crew.length === 0}
            id="incident-crew"
            onChange={(event) => setAssignedCrewId(Number(event.target.value))}
            value={assignedCrewId ?? ''}
          >
            {crew.map((crewMember) => (
              <option key={crewMember.id} value={crewMember.id}>
                {crewMember.name} ({crewMember.certification})
              </option>
            ))}
          </select>
        </label>

        <button
          className="rounded-md bg-cyan-300 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          onClick={() => void handleCreateIncident()}
          type="button"
        >
          Create incident
        </button>
      </div>

      {incidentError && <p className="mt-4 text-sm text-rose-200">{incidentError}</p>}

      <div
        className={`mt-4 grid gap-3 ${isScrollable ? 'max-h-80 overflow-y-auto pr-1' : ''}`}
        data-testid="incident-list"
      >
        {isLoading && <p className="text-sm text-slate-300">Loading incidents...</p>}
        {!isLoading &&
          incidents.map((incident) => {
            const moduleName = moduleLookup.get(incident.moduleId)?.name ?? 'Unknown module';
            const crewName = crewLookup.get(incident.assignedCrewId)?.name ?? 'Unknown crew';

            return (
              <article className="rounded-md border border-white/10 bg-slate-950/70 p-4" key={incident.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{incident.title}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {moduleName} · {crewName}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-1 text-xs font-semibold uppercase ${
                      incident.status === 'open'
                        ? 'border-amber-300/40 bg-amber-300/15 text-amber-100'
                        : 'border-emerald-300/40 bg-emerald-300/15 text-emerald-100'
                    }`}
                  >
                    {incident.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-300">
                    Severity: {incident.severity[0].toUpperCase()}
                    {incident.severity.slice(1)}
                  </span>
                  {incident.status === 'open' ? (
                    <button
                      aria-label={`Resolve ${incident.title}`}
                      className="rounded-md border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={resolvingIncidentId === incident.id}
                      onClick={() => void handleResolveIncident(incident.id)}
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
            );
          })}
      </div>
    </section>
  );
}
