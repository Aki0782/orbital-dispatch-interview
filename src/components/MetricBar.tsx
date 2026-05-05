type MetricBarProps = {
  label: string;
  value: number;
  tone: 'cyan' | 'amber' | 'rose';
};

const toneStyles = {
  cyan: 'from-cyan-300 to-sky-400',
  amber: 'from-amber-200 to-orange-400',
  rose: 'from-rose-300 to-red-500'
};

export function MetricBar({ label, value, tone }: MetricBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-300">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full bg-gradient-to-r ${toneStyles[tone]}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
