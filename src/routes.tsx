import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import HowWeWork from './pages/HowWeWork';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import Ingresar from './pages/Ingresar';
import MiCuenta from './pages/MiCuenta';
import MisPedidos from './pages/MisPedidos';
import PedidoDetalle from './pages/PedidoDetalle';
import Pedido from './pages/Pedido';
import RequireAuth from './components/auth/RequireAuth';
import AdminGate from './components/admin/AdminGate';
import AdminLogin from './pages/admin/Login';
import AdminProducts from './pages/admin/Products';
import AdminClientes from './pages/admin/Clientes';
import AdminPedidos from './pages/admin/Pedidos';
import AdminPedidoDetalle from './pages/admin/PedidoDetalle';
import AdminPedidoNuevo from './pages/admin/PedidoNuevo';
import AdminConsolidado from './pages/admin/Consolidado';

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
      <Route path="/ingresar" element={<Ingresar />} />

      <Route element={<RequireAuth />}>
        <Route path="/mi-cuenta" element={<MiCuenta />} />
        <Route path="/pedido" element={<Pedido />} />
        <Route path="/mis-pedidos" element={<MisPedidos />} />
        <Route path="/mis-pedidos/:orderId" element={<PedidoDetalle />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminGate />}>
        <Route path="/admin" element={<AdminProducts />} />
        <Route path="/admin/clientes" element={<AdminClientes />} />
        <Route path="/admin/pedidos" element={<AdminPedidos />} />
        <Route path="/admin/pedidos/nuevo" element={<AdminPedidoNuevo />} />
        <Route path="/admin/pedidos/:orderId" element={<AdminPedidoDetalle />} />
        <Route path="/admin/consolidado" element={<AdminConsolidado />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
