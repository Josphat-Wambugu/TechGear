import { CartProvider } from '@/context/CartContext';
import { FilterProvider } from '@/context/FilterContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { StoreDataProvider } from '@/context/StoreDataContext';
import AppRouter from '@/router/AppRouter';

export default function App() {
  return (
    <ThemeProvider>
      <StoreDataProvider>
        <CartProvider>
          <FilterProvider>
            <AppRouter />
          </FilterProvider>
        </CartProvider>
      </StoreDataProvider>
    </ThemeProvider>
  );
}
