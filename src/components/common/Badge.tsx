import type { ReactNode } from 'react';

type BadgeVariant = 'indigo' | 'emerald' | 'rose' | 'slate' | 'amber';

const variantStyles: Record<BadgeVariant, string> = {
  indigo: 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-400 border-brand-200/60 dark:border-brand-800',
  emerald: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800',
  rose: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-200/60 dark:border-rose-800',
  slate: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700',
  amber: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-800',
};

export default function Badge({
  children,
  variant = 'slate',
  className = '',
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
