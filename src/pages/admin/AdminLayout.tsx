import { Link, NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ClipboardList, Cpu, ArrowLeft } from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package, end: false },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList, end: false },
  { to: '/admin/customers', label: 'Customers', icon: Users, end: false },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      <aside className="hidden md:flex md:flex-col w-60 flex-shrink-0 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Link to="/" className="flex items-center gap-2 px-5 h-16 border-b border-slate-200/80 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Cpu size={16} className="text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-slate-900 dark:text-white">TechGear</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Admin</p>
          </div>
        </Link>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to store
          </Link>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-around py-2">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-[11px] font-medium ${
                isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </div>

      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-6">
        <Outlet />
      </main>
    </div>
  );
}
