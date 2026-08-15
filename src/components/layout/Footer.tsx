import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-gold/15 bg-ink-900">
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-4">
          <img
            src="/brand/logo-frangc-full.png"
            alt="FRAN GC — Venta de Charcutería Fina — Representante V Región"
            className="h-24 w-auto"
            width={220}
            height={96}
          />
          <p className="text-sm text-cream-muted max-w-sm">
            Distribuidora mayorista de charcutería artesanal en la V Región de Valparaíso.
          </p>
        </div>

        <div className="space-y-4">
          <p className="eyebrow">Navegación</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/catalogo" className="hover:text-gold-hover">Catálogo</Link></li>
            <li><Link to="/como-trabajamos" className="hover:text-gold-hover">Cómo trabajamos</Link></li>
            <li><Link to="/nosotros" className="hover:text-gold-hover">Nosotros</Link></li>
            <li><Link to="/contacto" className="hover:text-gold-hover">Contacto</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <p className="eyebrow">Marca aliada</p>
          <img
            src="/brand/logo-lacharcuteria.png"
            alt="La Charcutería Artesanal"
            className="h-14 w-auto"
            width={200}
            height={56}
          />
          <p className="text-xs text-cream-muted">
            Representante oficial en la V Región de La Charcutería Artesanal.
          </p>
        </div>
      </div>

      <div className="border-t border-gold/10">
        <div className="mx-auto max-w-7xl px-6 py-4 text-xs text-cream-muted flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p>© {year} FRAN GC SpA · Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link to="/politica-de-privacidad" className="hover:text-cream">
              Política de privacidad
            </Link>
            <Link to="/terminos" className="hover:text-cream">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
