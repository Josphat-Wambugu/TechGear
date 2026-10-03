import type { CartTotals } from '@/types/cart';
import { formatCurrency } from '@/utils/formatCurrency';
import { Tag, Truck } from 'lucide-react';
import type { ReactNode } from 'react';

interface OrderSummaryProps {
  totals: CartTotals;
  children?: ReactNode;
  showFreeShippingHint?: boolean;
}

const FREE_SHIPPING_THRESHOLD = 75;

export default function OrderSummary({ totals, children, showFreeShippingHint = true }: OrderSummaryProps) {
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totals.subtotal);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-xl p-5 shadow-sm space-y-4">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">Order Summary</h3>

      {showFreeShippingHint && remainingForFreeShipping > 0 && totals.subtotal > 0 && (
        <div className="flex items-start gap-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 text-xs font-medium rounded-lg p-3">
          <Truck size={14} className="mt-0.5 flex-shrink-0" />
          <span>
            Add {formatCurrency(remainingForFreeShipping)} more for <strong>free shipping</strong>!
          </span>
        </div>
      )}

      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Subtotal ({totals.itemCount} items)</span>
          <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Tag size={13} /> Shipping
          </span>
          <span className="font-medium text-slate-900 dark:text-white">
            {totals.shipping === 0 ? 'Free' : formatCurrency(totals.shipping)}
          </span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Estimated Tax</span>
          <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(totals.tax)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
        <span className="text-base font-semibold text-slate-900 dark:text-white">Total</span>
        <span className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(totals.total)}</span>
      </div>

      {children}
    </div>
  );
}
