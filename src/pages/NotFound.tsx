import { Link } from 'react-router-dom';
import Eyebrow from '@/components/ui/Eyebrow';
import HairlineRule from '@/components/ui/HairlineRule';
import { useSeo } from '@/lib/seo';

export default function NotFound() {
  useSeo({
    title: 'Página no encontrada · FRAN GC',
    description: 'La página que busca no existe.',
    noindex: true,
  });
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <div className="text-center space-y-4 max-w-md">
        <Eyebrow>Error 404</Eyebrow>
        <h1 className="font-serif text-4xl">Página no encontrada</h1>
        <HairlineRule className="mx-auto" />
        <p className="text-cream-muted">
          La página que busca no existe o fue movida. Puede volver al inicio o explorar el
          catálogo mayorista.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Link
            to="/"
            className="inline-block text-gold hover:text-gold-hover underline underline-offset-4"
          >
            Volver al inicio
          </Link>
          <span className="text-cream-muted">·</span>
          <Link
            to="/catalogo"
            className="inline-block text-gold hover:text-gold-hover underline underline-offset-4"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    </main>
  );
}
