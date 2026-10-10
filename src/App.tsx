import { CartProvider } from '@/context/CartContext';
import { FilterProvider } from '@/context/FilterContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { StoreDataProvider } from '@/context/StoreDataContext';
import { AuthProvider } from '@/context/AuthContext';
import AppRouter from '@/router/AppRouter';
import ErrorBoundary from '@/components/layout/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <StoreDataProvider>
            <CartProvider>
              <FilterProvider>
                <AppRouter />
              </FilterProvider>
            </CartProvider>
          </StoreDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
