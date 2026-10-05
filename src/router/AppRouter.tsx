import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/context/SidebarContext';
import Home from '@/pages/Home';
import Catalog from '@/pages/Catalog';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Profile from '@/pages/Profile';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminCustomers from '@/pages/admin/AdminCustomers';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

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
    </BrowserRouter>
  );
}
