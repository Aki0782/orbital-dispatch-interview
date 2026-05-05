import { useEffect, useState } from 'react';
import { Radio, UserRoundX } from 'lucide-react';
import { getCrewMember } from '../lib/api';
import type { CrewMember } from '../types/station';

type CrewPanelProps = {
  activeCrewId: number | null;
  crew: CrewMember[];
  onSelectCrew: (crewId: number) => void;
  onClearCrew: () => void;
};

export function CrewPanel({ activeCrewId, crew, onSelectCrew, onClearCrew }: CrewPanelProps) {
  const [activeCrew, setActiveCrew] = useState<CrewMember | null>(null);
  const [crewError, setCrewError] = useState<string | null>(null);
  const [isCrewLoading, setIsCrewLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadCrewMember() {
      if (activeCrewId === null) {
        setActiveCrew(null);
        setCrewError(null);
        return;
      }

      try {
        setIsCrewLoading(true);
        const nextCrewMember = await getCrewMember(activeCrewId);

        if (isMounted) {
          setActiveCrew(nextCrewMember);
          setCrewError(null);
        }
      } catch (error) {
        if (isMounted) {
          setActiveCrew(null);
          setCrewError(error instanceof Error ? error.message : 'Unable to load crew member');
        }
      } finally {
        if (isMounted) {
          setIsCrewLoading(false);
        }
      }
    }

    void loadCrewMember();

    return () => {
      isMounted = false;
    };
  }, [activeCrewId]);

  return (
    <aside className="rounded-lg border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-cyan-200">Crew channel</p>
          <h2 className="text-lg font-semibold text-white">Active officer</h2>
        </div>
        <button
          aria-label="Clear active officer"
          className="rounded-md border border-white/10 p-2 text-slate-200 transition hover:bg-white/10"
          onClick={onClearCrew}
          type="button"
        >
          <UserRoundX className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 min-h-28 rounded-md border border-white/10 bg-slate-950/70 p-4">
        {!activeCrewId && <p className="text-sm text-slate-400">No officer selected.</p>}
        {isCrewLoading && <p className="text-sm text-slate-300">Opening private channel...</p>}
        {crewError && <p className="text-sm text-rose-200">{crewError}</p>}
        {activeCrew && (
          <div>
            <div className="flex items-center gap-2 text-cyan-100">
              <Radio className="h-4 w-4" />
              <span className="font-semibold">{activeCrew.name}</span>
            </div>
            <p className="mt-2 text-sm text-slate-300">{activeCrew.role}</p>
            <p className="mt-1 text-sm text-slate-400">Fatigue index: {activeCrew.fatigue}</p>
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-2">
        {crew.map((member) => (
          <button
            className={`rounded-md border px-3 py-2 text-left text-sm transition ${
              member.id === activeCrewId
                ? 'border-cyan-300/70 bg-cyan-300/15 text-cyan-50'
                : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10'
            }`}
            key={member.id}
            onClick={() => onSelectCrew(member.id)}
            type="button"
          >
            <span className="font-medium">{member.name}</span>
            <span className="ml-2 text-slate-400">{member.certification}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
