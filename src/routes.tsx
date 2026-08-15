import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import HowWeWork from './pages/HowWeWork';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import AdminGate from './components/admin/AdminGate';
import AdminLogin from './pages/admin/Login';
import AdminProducts from './pages/admin/Products';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalogo" element={<Catalog />} />
      <Route path="/como-trabajamos" element={<HowWeWork />} />
      <Route path="/nosotros" element={<About />} />
      <Route path="/contacto" element={<Contact />} />
      <Route path="/politica-de-privacidad" element={<Privacy />} />
      <Route path="/terminos" element={<Terms />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminGate />}>
        <Route path="/admin" element={<AdminProducts />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
