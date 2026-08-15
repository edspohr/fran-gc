import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Eyebrow from '../ui/Eyebrow';
import HairlineRule from '../ui/HairlineRule';
import GrainOverlay from '../ui/GrainOverlay';
import { WHATSAPP_LINK, COVERAGE } from '@/config/site';

const HERO_MSG = encodeURIComponent(
  'Buenas, quisiera solicitar el catálogo mayorista y la lista de precios de FRAN GC para mi negocio. Gracias.',
);

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink pt-16 pb-24 md:pt-24 md:pb-32">
      <GrainOverlay />
      <div className="relative mx-auto max-w-6xl px-6 grid gap-10 md:grid-cols-[1.05fr_1fr] items-center">
        <div className="space-y-6 text-center md:text-left">
          <Eyebrow>Charcutería fina · Distribución mayorista</Eyebrow>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight">
            Charcutería artesanal para su <span className="text-gold">negocio</span>.
          </h1>
          <HairlineRule className="mx-auto md:mx-0" />
          <p className="text-cream-muted text-lg max-w-xl mx-auto md:mx-0">
            FRAN GC SpA es el representante exclusivo en la V Región de{' '}
            <span className="text-cream">La Charcutería Artesanal</span>. Abastecemos a
            restaurantes, hoteles, cafés y emporios de {COVERAGE.split(',')[0]} con embutidos
            y cecinas madurados en seco, ahumados en roble austriaco y de receta europea.
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
            <Button
              as="a"
              href={`${WHATSAPP_LINK}?text=${HERO_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
            >
              Solicitar catálogo y lista de precios
            </Button>
            <Button as="a" href="/catalogo" variant="ghost" size="lg">
              Ver catálogo
            </Button>
          </div>
          <p className="pt-2 text-xs text-cream-muted/80">
            Solo venta mayorista · Sin precios en línea (negocio a negocio) ·{' '}
            <Link to="/como-trabajamos" className="text-gold hover:text-gold-hover">
              Cómo trabajamos →
            </Link>
          </p>
        </div>

        <div className="relative flex justify-center md:justify-end">
          <img
            src="/brand/logo-frangc-full.png"
            alt="FRAN GC · Venta de Charcutería Fina · Representante V Región"
            className="max-h-[420px] w-auto drop-shadow-[0_0_40px_rgba(174,154,121,0.15)]"
            width={480}
            height={480}
          />
        </div>
      </div>
    </section>
  );
}
