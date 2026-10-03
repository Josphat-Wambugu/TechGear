import { Link } from 'react-router-dom';
import { ArrowRight, Headphones, Laptop, Watch, Camera, Monitor, Cable, UserCircle, LayoutDashboard } from 'lucide-react';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import ProductGrid from '@/components/ecommerce/ProductGrid';

const categoryLinks = [
  { label: 'Laptops', value: 'Laptops', icon: Laptop },
  { label: 'Audio', value: 'Audio', icon: Headphones },
  { label: 'Wearables', value: 'Wearables', icon: Watch },
  { label: 'Monitors', value: 'Monitors', icon: Monitor },
  { label: 'Cameras', value: 'Cameras', icon: Camera },
  { label: 'Accessories', value: 'Accessories', icon: Cable },
];

export default function Home() {
  const featured = useFeaturedProducts(4);
  const { currentUser } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-white border-b border-slate-200/80 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 dark:text-indigo-400 text-xs font-semibold mb-4">
              New arrivals every week
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              Tech gear built for how you actually work.
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Curated laptops, audio, wearables, and accessories — hand-picked for performance,
              reliability, and clean design.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl
                  font-medium shadow-sm hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200"
              >
                Shop the Catalog <ArrowRight size={16} />
              </Link>
              <Link
                to="/catalog?category=Laptops"
                className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-700
                  px-6 py-3 rounded-xl font-medium shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
              >
                View Laptops
              </Link>
              {currentUser ? (
                <Link
                  to={currentUser.role === 'admin' ? '/admin' : '/profile'}
                  className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400
                    px-4 py-3 rounded-xl font-medium transition-colors duration-200"
                >
                  {currentUser.role === 'admin' ? <LayoutDashboard size={16} /> : <UserCircle size={16} />}
                  {currentUser.role === 'admin' ? 'Admin Dashboard' : 'My Account'}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400
                    px-4 py-3 rounded-xl font-medium transition-colors duration-200"
                >
                  <UserCircle size={16} /> Sign In
                </Link>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&q=80"
                alt="Featured laptop"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category quick-links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
          {categoryLinks.map(({ label, value, icon: Icon }) => (
            <Link
              key={value}
              to={`/catalog?category=${encodeURIComponent(value)}`}
              className="flex flex-col items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-xl p-4
                shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center">
                <Icon size={18} className="text-indigo-600" />
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 text-center">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Featured Products</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Our most popular picks this month.</p>
          </div>
          <Link
            to="/catalog"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      {/* Value props */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid sm:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Free Shipping</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">On all orders over $75</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">30-Day Returns</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">No questions asked</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">2-Year Warranty</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">On every product we sell</p>
          </div>
        </div>
      </section>
    </div>
  );
}
