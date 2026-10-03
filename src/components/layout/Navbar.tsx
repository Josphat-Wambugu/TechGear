import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';

const categories: { label: string; value: string }[] = [
  { label: 'All Products', value: 'All' },
  { label: 'Laptops', value: 'Laptops' },
  { label: 'Audio', value: 'Audio' },
  { label: 'Wearables', value: 'Wearables' },
  { label: 'Monitors', value: 'Monitors' },
  { label: 'Cameras', value: 'Cameras' },
  { label: 'Accessories', value: 'Accessories' },
];

export default function Navbar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/catalog?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="hidden md:flex items-center gap-6 border-t border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12">
        <nav className="flex items-center gap-6">
          {categories.map((c) => (
            <Link
              key={c.value}
              to={`/catalog?category=${encodeURIComponent(c.value)}`}
              className={`text-sm font-medium transition-colors ${
                location.search.includes(c.value)
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {c.label}
            </Link>
          ))}
        </nav>
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
            className="bg-slate-100/70 dark:bg-slate-800 border border-transparent rounded-lg pl-9 pr-3 py-1.5 text-sm w-56 text-slate-900 dark:text-slate-100 placeholder-slate-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800
              transition-all duration-200"
          />
        </form>
      </div>
    </div>
  );
}
