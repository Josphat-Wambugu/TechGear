import { CartProvider } from '@/context/CartContext';
import { FilterProvider } from '@/context/FilterContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { StoreDataProvider } from '@/context/StoreDataContext';
import { AuthProvider } from '@/context/AuthContext';
import AppRouter from '@/router/AppRouter';

export default function App() {
  return (
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
  );
}
