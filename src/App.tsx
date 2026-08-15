import { useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AppRoutes from './routes';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';

function LayoutOrBare({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return <>{children}</>;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <LayoutOrBare>
          <AppRoutes />
        </LayoutOrBare>
      </CartProvider>
    </AuthProvider>
  );
}
