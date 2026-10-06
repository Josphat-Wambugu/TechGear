import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  hint?: string;
  accent?: 'indigo' | 'emerald' | 'amber' | 'rose';
}

const accentStyles: Record<NonNullable<StatCardProps['accent']>, string> = {
  indigo: 'bg-brand-50 dark:bg-brand-950 text-brand-600',
  emerald: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600',
  amber: 'bg-amber-50 dark:bg-amber-950 text-amber-600',
  rose: 'bg-rose-50 dark:bg-rose-950 text-rose-600',
};

export default function StatCard({ label, value, icon, hint, accent = 'indigo' }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accentStyles[accent]}`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-3">{value}</p>
      {hint && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}
