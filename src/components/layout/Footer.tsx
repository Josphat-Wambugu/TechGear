import { Link } from 'react-router-dom';
import { Cpu, MessageCircle, Send, Rss } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Cpu size={16} className="text-white" />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white">TechGear</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Thoughtfully selected tech gear for work, creativity, and everyday life.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="Updates feed">
                <Rss size={18} />
              </a>
              <a href="#" className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="Chat with us">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="Send us a message">
                <Send size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/catalog?category=Laptops" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Laptops</Link></li>
              <li><Link to="/catalog?category=Audio" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Audio</Link></li>
              <li><Link to="/catalog?category=Wearables" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Wearables</Link></li>
              <li><Link to="/catalog" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">All Products</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200/80 dark:border-slate-700 mt-10 pt-6 text-sm text-slate-400 dark:text-slate-500 text-center">
          © {new Date().getFullYear()} TechGear Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
