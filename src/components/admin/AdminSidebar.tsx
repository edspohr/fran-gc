import { NavLink } from 'react-router-dom';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';

const linkCls =
  'flex items-center justify-between gap-3 px-3 py-2 rounded text-sm text-cream-muted hover:text-cream hover:bg-surface-2 transition-colors';
const activeCls = 'bg-surface-2 text-cream';

function Badge({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[0.65rem] font-bold rounded-full bg-wine text-cream">
      {n}
    </span>
  );
}

export default function AdminSidebar() {
  const { pendingClients, newOrders } = useAdminNotifications();

  return (
    <nav className="flex flex-wrap md:flex-col gap-1 md:gap-1 md:w-56 md:shrink-0">
      <NavLink to="/admin/pedidos" className={({ isActive }) => `${linkCls} ${isActive ? activeCls : ''}`}>
        <span>Pedidos</span>
        <Badge n={newOrders} />
      </NavLink>
      <NavLink to="/admin/pedidos/nuevo" className={({ isActive }) => `${linkCls} ${isActive ? activeCls : ''}`}>
        <span>Nuevo pedido</span>
      </NavLink>
      <NavLink to="/admin/consolidado" className={({ isActive }) => `${linkCls} ${isActive ? activeCls : ''}`}>
        <span>Consolidado</span>
      </NavLink>
      <NavLink to="/admin/clientes" className={({ isActive }) => `${linkCls} ${isActive ? activeCls : ''}`}>
        <span>Clientes</span>
        <Badge n={pendingClients} />
      </NavLink>
      <NavLink to="/admin" end className={({ isActive }) => `${linkCls} ${isActive ? activeCls : ''}`}>
        <span>Productos</span>
      </NavLink>
    </nav>
  );
}
