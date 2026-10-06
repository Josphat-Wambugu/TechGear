import { Link, useLocation } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen, X, Cpu } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import { navLinks } from '@/data/navLinks';
import { useOverlay } from '@/hooks/useOverlay';

function NavList({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const location = useLocation();

  return (
    <nav className="flex flex-col gap-1">
      {navLinks.map(({ label, value, icon: Icon }) => {
        const isActive = location.pathname === '/catalog' && location.search.includes(value);
        return (
          <Link
            key={value}
            to={`/catalog?category=${encodeURIComponent(value)}`}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className={`flex items-center rounded-xl text-sm font-medium transition-colors ${
              collapsed ? 'justify-center h-10 w-10 mx-auto' : 'gap-3 px-3 py-2.5'
            } ${
              isActive
                ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon size={collapsed ? 18 : 16} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

function BrandMark() {
  return (
    <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
      <Cpu size={14} className="text-white" />
    </div>
  );
}

export default function Sidebar() {
  const { collapsed, toggleCollapsed, mobileOpen, closeMobile } = useSidebar();
  const panelRef = useOverlay(mobileOpen, closeMobile);

  return (
    <>
      {/* Desktop / tablet: persistent, collapsible rail */}
      <aside
        className={`hidden md:flex md:flex-col flex-shrink-0 border-r border-slate-200/80 dark:border-slate-700
          bg-white dark:bg-slate-900 transition-[width] duration-200 ${collapsed ? 'w-[72px]' : 'w-60'}`}
      >
        <div className={`flex items-center h-16 flex-shrink-0 ${collapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2 min-w-0">
              <BrandMark />
              <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight truncate">
                TechGear
              </span>
            </Link>
          )}
          <button
            onClick={toggleCollapsed}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors flex-shrink-0"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>
        <div className={`flex-1 overflow-y-auto ${collapsed ? 'px-2' : 'px-3'} pb-4`}>
          <NavList collapsed={collapsed} />
        </div>
      </aside>

      {/* Mobile: off-canvas drawer */}
      <div
        className={`md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-overlay-backdrop transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobile}
      />
      <aside
        ref={panelRef as React.RefObject<HTMLElement>}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={`md:hidden fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-white dark:bg-slate-900 z-overlay-panel shadow-xl
          border-r border-slate-200/80 dark:border-slate-700 flex flex-col transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-4 h-16 flex-shrink-0 border-b border-slate-100 dark:border-slate-800">
          <Link to="/" onClick={closeMobile} className="flex items-center gap-2">
            <BrandMark />
            <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">TechGear</span>
          </Link>
          <button
            onClick={closeMobile}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <NavList collapsed={false} onNavigate={closeMobile} />
        </div>
      </aside>
    </>
  );
}
