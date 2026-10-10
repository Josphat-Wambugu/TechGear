import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/context/SidebarContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RouteLoading from '@/components/layout/RouteLoading';

// Route-level code-splitting: every page used to be imported eagerly here, so
// a first-time visitor's bundle included the entire admin dashboard (product
// forms, order/customer tables) whether or not they'd ever log in as admin.
// Each page is now its own chunk, fetched only when its route is visited.
const Home = lazy(() => import('@/pages/Home'));
const Catalog = lazy(() => import('@/pages/Catalog'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const Cart = lazy(() => import('@/pages/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));
const Profile = lazy(() => import('@/pages/Profile'));
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('@/pages/admin/AdminOrders'));
const AdminCustomers = lazy(() => import('@/pages/admin/AdminCustomers'));

function StoreLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route element={<StoreLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
