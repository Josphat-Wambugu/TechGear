import { Link } from 'react-router-dom';
import { Cpu, MessageCircle, Send, Rss } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-700 mt-16">
      <PageContainer className="py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <Cpu size={16} className="text-white" />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white">TechGear</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Thoughtfully selected tech gear for work, creativity, and everyday life.
            </p>
            {/* These don't have real destinations yet (no blog/chat/contact backend),
                so they're rendered as disabled rather than as href="#" links that
                silently do nothing when clicked. */}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-slate-300 dark:text-slate-700 cursor-not-allowed" aria-disabled="true" title="Coming soon">
                <Rss size={18} />
              </span>
              <span className="text-slate-300 dark:text-slate-700 cursor-not-allowed" aria-disabled="true" title="Coming soon">
                <MessageCircle size={18} />
              </span>
              <span className="text-slate-300 dark:text-slate-700 cursor-not-allowed" aria-disabled="true" title="Coming soon">
                <Send size={18} />
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/catalog?category=Laptops" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Laptops</Link></li>
              <li><Link to="/catalog?category=Audio" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Audio</Link></li>
              <li><Link to="/catalog?category=Wearables" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Wearables</Link></li>
              <li><Link to="/catalog" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">All Products</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Support</h4>
            {/* No support/legal backend exists behind these yet. A href="#" link
                looks clickable but silently does nothing — worse than admitting
                it's not built, so these render as disabled text instead. */}
            <ul className="space-y-2 text-sm text-slate-400 dark:text-slate-600">
              <li className="cursor-not-allowed" title="Coming soon">Shipping &amp; Returns</li>
              <li className="cursor-not-allowed" title="Coming soon">Track Order</li>
              <li className="cursor-not-allowed" title="Coming soon">Contact Us</li>
              <li className="cursor-not-allowed" title="Coming soon">FAQ</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400 dark:text-slate-600">
              <li className="cursor-not-allowed" title="Coming soon">About Us</li>
              <li className="cursor-not-allowed" title="Coming soon">Careers</li>
              <li className="cursor-not-allowed" title="Coming soon">Privacy Policy</li>
              <li className="cursor-not-allowed" title="Coming soon">Terms of Service</li>
              <li>
                <Link to="/admin" className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200/80 dark:border-slate-700 mt-10 pt-6 text-sm text-slate-400 dark:text-slate-500 text-center">
          © {new Date().getFullYear()} TechGear Store. All rights reserved.
        </div>
      </PageContainer>
    </footer>
  );
}
