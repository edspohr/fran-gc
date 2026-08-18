import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import CartButton from '../cart/CartButton';
import CartDrawer from '../cart/CartDrawer';
import { useAuth } from '@/hooks/useAuth';
import { useClientProfile } from '@/contexts/ClientProfileContext';

const links = [
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/como-trabajamos', label: 'Cómo trabajamos' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin, isVerified, isPending, profile } = useClientProfile();

  return (
    <>
      <header className="sticky top-0 z-40 bg-ink/90 backdrop-blur border-b border-gold/15">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center" aria-label="FRAN GC — Inicio">
            <img
              src="/brand/logo-frangc-navbar.png"
              alt="FRAN GC"
              className="h-12 w-auto"
              width={180}
              height={48}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm tracking-wide transition-colors ${
                    isActive ? 'text-gold' : 'text-cream hover:text-gold-hover'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isVerified && (
              <Link
                to="/pedido"
                className="hidden md:inline-flex items-center px-3 py-1.5 text-xs uppercase tracking-eyebrow bg-gold text-ink rounded hover:bg-gold-hover"
              >
                Hacer pedido
              </Link>
            )}

            {!user ? (
              <Link to="/ingresar" className="hidden md:inline text-sm text-cream hover:text-gold-hover">
                Ingresar
              </Link>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenu((v) => !v)}
                  className="flex items-center gap-1.5 text-sm text-cream hover:text-gold-hover px-2 py-1.5"
                  aria-haspopup="true"
                  aria-expanded={userMenu}
                >
                  <span className="hidden sm:inline max-w-[10rem] truncate">
                    {profile?.company || profile?.name || user.email}
                  </span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {userMenu && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-surface-1 border border-gold/25 rounded shadow-lg py-2 z-50"
                    onMouseLeave={() => setUserMenu(false)}
                  >
                    {isPending && (
                      <p className="px-3 py-1.5 text-[0.65rem] uppercase tracking-eyebrow text-cream-muted border-b border-gold/10">
                        En revisión
                      </p>
                    )}
                    {isAdmin ? (
                      <Link to="/admin" onClick={() => setUserMenu(false)} className="block px-3 py-2 text-sm text-cream hover:bg-surface-2">
                        Panel admin
                      </Link>
                    ) : (
                      <>
                        {isVerified && (
                          <Link to="/pedido" onClick={() => setUserMenu(false)} className="block px-3 py-2 text-sm text-cream hover:bg-surface-2">
                            Hacer pedido
                          </Link>
                        )}
                        <Link to="/mis-pedidos" onClick={() => setUserMenu(false)} className="block px-3 py-2 text-sm text-cream hover:bg-surface-2">
                          Mis pedidos
                        </Link>
                        <Link to="/mi-cuenta" onClick={() => setUserMenu(false)} className="block px-3 py-2 text-sm text-cream hover:bg-surface-2">
                          Mi cuenta
                        </Link>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenu(false);
                        void signOut();
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-cream-muted hover:bg-surface-2 hover:text-cream border-t border-gold/10 mt-1"
                    >
                      Salir
                    </button>
                  </div>
                )}
              </div>
            )}

            <CartButton onClick={() => setCartOpen(true)} />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden text-cream p-2"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6"
              >
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <nav className="md:hidden border-t border-gold/15 bg-ink">
            <ul className="px-6 py-3 space-y-1">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block py-2 text-sm ${isActive ? 'text-gold' : 'text-cream'}`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
              <li className="pt-2 border-t border-gold/10">
                {!user ? (
                  <Link to="/ingresar" onClick={() => setOpen(false)} className="block py-2 text-sm text-cream">
                    Ingresar
                  </Link>
                ) : (
                  <>
                    {isVerified && (
                      <Link to="/pedido" onClick={() => setOpen(false)} className="block py-2 text-sm text-gold">
                        Hacer pedido
                      </Link>
                    )}
                    {!isAdmin && (
                      <>
                        <Link to="/mis-pedidos" onClick={() => setOpen(false)} className="block py-2 text-sm text-cream">
                          Mis pedidos
                        </Link>
                        <Link to="/mi-cuenta" onClick={() => setOpen(false)} className="block py-2 text-sm text-cream">
                          Mi cuenta {isPending && '· En revisión'}
                        </Link>
                      </>
                    )}
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setOpen(false)} className="block py-2 text-sm text-cream">
                        Panel admin
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        void signOut();
                      }}
                      className="block py-2 text-sm text-cream-muted"
                    >
                      Salir
                    </button>
                  </>
                )}
              </li>
            </ul>
          </nav>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
