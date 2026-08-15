import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import CartButton from '../cart/CartButton';
import CartDrawer from '../cart/CartDrawer';

const links = [
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/como-trabajamos', label: 'Cómo trabajamos' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

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
            <ul className="px-6 py-3 space-y-3">
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
            </ul>
          </nav>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
