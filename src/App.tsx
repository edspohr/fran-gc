import { useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AppRoutes from './routes';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { ClientProfileProvider } from './contexts/ClientProfileContext';
import OnboardingModal from './components/auth/OnboardingModal';

function LayoutOrBare({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return <>{children}</>;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <AuthProvider>
      <ClientProfileProvider>
        <CartProvider>
          <LayoutOrBare>
            <AppRoutes />
          </LayoutOrBare>
          <OnboardingModal />
        </CartProvider>
      </ClientProfileProvider>
    </AuthProvider>
  );
}
