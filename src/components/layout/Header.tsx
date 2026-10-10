import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, Cpu } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useSidebar } from '@/hooks/useSidebar';
import CartDrawer from './CartDrawer';
import ThemeToggle from '../common/ThemeToggle';
import AccountMenu from './AccountMenu';

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { totals } = useCart();
  const { toggleMobile } = useSidebar();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/catalog?search=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <header className="sticky top-0 z-header bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200/80 dark:border-slate-700">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1 md:flex-initial md:w-72">
            <button
              className="md:hidden p-2 -ml-1 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
              onClick={toggleMobile}
              aria-label="Toggle navigation menu"
            >
              <Menu size={20} />
            </button>
            <Link to="/" className="flex items-center gap-2 group md:hidden min-w-0">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-sm group-hover:bg-brand-700 transition-colors flex-shrink-0">
                <Cpu size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate">
                TechGear
              </span>
            </Link>

            <form onSubmit={handleSearch} className="hidden md:block relative w-full">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-slate-100/70 dark:bg-slate-800 border border-transparent rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400
                  focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200"
              />
            </form>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            <AccountMenu />
            <button
              className="relative p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:-translate-y-0.5"
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
            >
              <ShoppingCart size={20} />
              {totals.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totals.itemCount > 9 ? '9+' : totals.itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile-only search row — desktop/tablet search lives in the row above */}
        <div className="md:hidden border-t border-slate-200/80 dark:border-slate-700 px-4 py-3">
          <form onSubmit={handleSearch} className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-slate-100/70 dark:bg-slate-800 border border-transparent rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400
                focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 focus:bg-white dark:focus:bg-slate-800"
            />
          </form>
        </div>
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
