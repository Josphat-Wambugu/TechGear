import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Users, Package, ArrowRight, AlertTriangle } from 'lucide-react';
import { useStoreData } from '@/hooks/useStoreData';
import { formatCurrency } from '@/utils/formatCurrency';
import Badge from '@/components/common/Badge';
import StatCard from '@/components/admin/StatCard';

const statusVariant = {
  pending: 'amber',
  processing: 'indigo',
  shipped: 'slate',
  delivered: 'emerald',
} as const;

export default function AdminDashboard() {
  const { orders, customers, products } = useStoreData();

  const revenue = orders.reduce((sum, o) => sum + o.totals.total, 0);
  const lowStock = products.filter((p) => p.inStock && p.stockCount <= 5);
  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">An overview of your store's activity.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Revenue"
          value={formatCurrency(revenue)}
          icon={<DollarSign size={18} />}
          hint={`${orders.length} order${orders.length === 1 ? '' : 's'}`}
        />
        <StatCard
          label="Orders"
          value={String(orders.length)}
          icon={<ShoppingBag size={18} />}
          accent="emerald"
          hint={`${orders.filter((o) => o.status === 'pending').length} pending`}
        />
        <StatCard
          label="Customers"
          value={String(customers.length)}
          icon={<Users size={18} />}
          accent="amber"
        />
        <StatCard
          label="Products"
          value={String(products.length)}
          icon={<Package size={18} />}
          accent="rose"
          hint={`${lowStock.length} low on stock`}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Orders</h2>
            <Link
              to="/admin/orders"
              className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 px-5 py-8 text-center">No orders placed yet.</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white truncate">{order.orderNumber}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{order.shipping.fullName}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                    <span className="font-semibold text-slate-900 dark:text-white w-20 text-right">
                      {formatCurrency(order.totals.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <AlertTriangle size={15} className="text-amber-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Low Stock</h2>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 px-5 py-8 text-center">
              All products are well stocked.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {lowStock.slice(0, 6).map((p) => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="text-slate-700 dark:text-slate-300 truncate">{p.name}</span>
                  <Badge variant="amber">{p.stockCount} left</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
