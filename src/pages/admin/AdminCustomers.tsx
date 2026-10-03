import { Users } from 'lucide-react';
import { useStoreData } from '@/hooks/useStoreData';
import { formatCurrency } from '@/utils/formatCurrency';

export default function AdminCustomers() {
  const { customers } = useStoreData();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customers</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {customers.length} customer{customers.length === 1 ? '' : 's'} have checked out
        </p>
      </div>

      {customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <Users size={28} className="text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">No customers yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Customers are recorded automatically once an order is placed.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1.3fr_1fr_0.6fr_0.8fr_0.9fr] gap-3 px-5 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800">
            <span>Customer</span>
            <span>Location</span>
            <span>Orders</span>
            <span>Total Spent</span>
            <span>Last Order</span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {customers.map((c) => (
              <div
                key={c.email}
                className="grid grid-cols-2 sm:grid-cols-[1.3fr_1fr_0.6fr_0.8fr_0.9fr] gap-3 px-5 py-3.5 text-sm items-center"
              >
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white truncate">{c.fullName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{c.email}</p>
                </div>
                <span className="hidden sm:block text-slate-600 dark:text-slate-400 truncate">
                  {c.city}{c.city && c.country ? ', ' : ''}{c.country}
                </span>
                <span className="text-slate-700 dark:text-slate-300">{c.orderCount}</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(c.totalSpent)}</span>
                <span className="hidden sm:block text-slate-500 dark:text-slate-400">
                  {new Date(c.lastOrderAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
