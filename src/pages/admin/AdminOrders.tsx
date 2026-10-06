import { useState } from 'react';
import { ClipboardList, X } from 'lucide-react';
import { useStoreData } from '@/hooks/useStoreData';
import { formatCurrency } from '@/utils/formatCurrency';
import Badge from '@/components/common/Badge';
import Modal from '@/components/common/Modal';
import type { Order, OrderStatus } from '@/types/order';

const statusVariant: Record<OrderStatus, 'amber' | 'indigo' | 'slate' | 'emerald'> = {
  pending: 'amber',
  processing: 'indigo',
  shipped: 'slate',
  delivered: 'emerald',
};

const statusOptions: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered'];

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useStoreData();
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Orders</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{orders.length} orders placed</p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <ClipboardList size={28} className="text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">No orders yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Orders placed through checkout will show up here.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_1.2fr_0.8fr_0.8fr_0.8fr] gap-3 px-5 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800">
            <span>Order</span>
            <span>Customer</span>
            <span>Date</span>
            <span>Total</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => setActiveOrder(order)}
                className="w-full text-left grid grid-cols-2 sm:grid-cols-[1fr_1.2fr_0.8fr_0.8fr_0.8fr] gap-3 px-5 py-3.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span className="font-medium text-slate-900 dark:text-white">{order.orderNumber}</span>
                <span className="text-slate-600 dark:text-slate-400 truncate">{order.shipping.fullName}</span>
                <span className="hidden sm:block text-slate-500 dark:text-slate-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(order.totals.total)}
                </span>
                <span>
                  <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <Modal isOpen={!!activeOrder} onClose={() => setActiveOrder(null)} size="lg">
        {activeOrder && (
          <div>
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{activeOrder.orderNumber}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Placed {new Date(activeOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setActiveOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <div>
                <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
                  Shipping to
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeOrder.shipping.fullName}
                  <br />
                  {activeOrder.shipping.address}, {activeOrder.shipping.city} {activeOrder.shipping.postalCode}
                  <br />
                  {activeOrder.shipping.country}
                  <br />
                  {activeOrder.shipping.email} · {activeOrder.shipping.phone}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
                  Status
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {statusOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateOrderStatus(activeOrder.id, s)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                        activeOrder.status === s
                          ? 'bg-brand-600 border-brand-600 text-white'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-2">
              Items
            </h4>
            <div className="space-y-2 mb-4">
              {activeOrder.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 text-sm">
                  <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <span className="flex-1 min-w-0 truncate text-slate-700 dark:text-slate-300">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Subtotal</span>
                <span>{formatCurrency(activeOrder.totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Shipping</span>
                <span>{activeOrder.totals.shipping === 0 ? 'Free' : formatCurrency(activeOrder.totals.shipping)}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Tax</span>
                <span>{formatCurrency(activeOrder.totals.tax)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white pt-1.5">
                <span>Total</span>
                <span>{formatCurrency(activeOrder.totals.total)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
