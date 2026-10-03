import { ShieldCheck, User } from 'lucide-react';
import type { UserRole } from '@/types/auth';

interface RoleToggleProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
}

export default function RoleToggle({ value, onChange }: RoleToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => onChange('customer')}
        className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
          value === 'customer'
            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400'
            : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'
        }`}
      >
        <User size={15} /> Customer
      </button>
      <button
        type="button"
        onClick={() => onChange('admin')}
        className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
          value === 'admin'
            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400'
            : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'
        }`}
      >
        <ShieldCheck size={15} /> Admin
      </button>
    </div>
  );
}
