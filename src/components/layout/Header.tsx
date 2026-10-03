import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Cpu } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Navbar from './Navbar';
import CartDrawer from './CartDrawer';
import ThemeToggle from '../common/ThemeToggle';

const mobileCategories = ['All', 'Laptops', 'Audio', 'Wearables', 'Monitors', 'Cameras', 'Accessories'];

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState('');
  const { totals } = useCart();
  const navigate = useNavigate();

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/catalog?search=${encodeURIComponent(mobileSearch)}`);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200/80 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition-colors">
              <Cpu size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">TechGear</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <button
              className="relative p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:-translate-y-0.5"
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
            >
              <ShoppingCart size={20} />
              {totals.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totals.itemCount > 9 ? '9+' : totals.itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <Navbar />

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-4 space-y-4">
            <form onSubmit={handleMobileSearch} className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-slate-100/70 dark:bg-slate-800 border border-transparent rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800"
              />
            </form>
            <nav className="flex flex-col gap-1">
              {mobileCategories.map((c) => (
                <Link
                  key={c}
                  to={`/catalog?category=${encodeURIComponent(c)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 transition-colors"
                >
                  {c === 'All' ? 'All Products' : c}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
