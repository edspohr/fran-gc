import Eyebrow from '@/components/ui/Eyebrow';
import HairlineRule from '@/components/ui/HairlineRule';
import JsonLd from '@/components/seo/JsonLd';
import { useSeo } from '@/lib/seo';
import {
  COVERAGE,
  LEGAL_NAME,
  SITE_URL,
  SUPPLIER_NAME,
  SUPPLIER_ORIGIN,
  WHATSAPP_DISPLAY,
} from '@/config/site';

export default function About() {
  useSeo({
    title: 'Nosotros · FRAN GC',
    description: `${LEGAL_NAME}, distribuidora mayorista de charcutería artesanal en ${COVERAGE}. Representante exclusivo de ${SUPPLIER_NAME}.`,
    path: '/nosotros',
  });

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: LEGAL_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-frangc-full.png`,
    description: `Distribuidora mayorista de charcutería artesanal. Representante V Región de ${SUPPLIER_NAME}.`,
    areaServed: { '@type': 'AdministrativeArea', name: COVERAGE },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: WHATSAPP_DISPLAY,
      areaServed: 'CL',
      availableLanguage: 'es',
    },
    sameAs: [`https://wa.me/56935913941`],
  };

  return (
    <main>
      <JsonLd id="org-jsonld" data={orgJsonLd} />
      <section className="pt-14 pb-10 border-b border-gold/10">
        <div className="mx-auto max-w-4xl px-6 space-y-3">
          <Eyebrow>Nosotros</Eyebrow>
          <h1 className="font-serif text-4xl md:text-5xl">Una distribuidora boutique en la V Región</h1>
          <HairlineRule />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6 space-y-8 text-cream-muted">
          <p>
            <span className="text-cream">{LEGAL_NAME}</span> nace en la V Región de Valparaíso
            con una convicción simple: los restaurantes, hoteles y emporios de la costa merecen
            acceso directo a charcutería artesanal de nivel europeo, sin intermediarios y con
            servicio cercano.
          </p>
          <p>
            Somos el <span className="text-cream">representante oficial en la V Región</span> de{' '}
            <span className="text-cream">{SUPPLIER_NAME}</span>, ubicada en {SUPPLIER_ORIGIN}.
            Su tradición europea de tres generaciones, guiada por el maestro charcutero Yury
            Karpitski, se refleja en cada pieza: ahumado natural en roble austriaco,
            maduración en seco por meses y recetas fieles a sus orígenes españoles, italianos,
            alemanes y franceses.
          </p>

          <div className="pt-4">
            <h2 className="font-serif text-2xl text-cream">Nuestro rol</h2>
            <HairlineRule className="mt-2" />
            <p className="mt-4">
              Cerramos la cadena: seleccionamos, coordinamos la logística fría desde Santiago y
              entregamos semanalmente en Valparaíso, Viña del Mar, Concón, Reñaca, Quilpué,
              Villa Alemana, Casablanca y el litoral central. La cercanía nos permite conocer
              la carta de cada cliente y sugerir el producto exacto para cada preparación.
            </p>
          </div>

          <div className="pt-4">
            <h2 className="font-serif text-2xl text-cream">Nuestro sello</h2>
            <HairlineRule className="mt-2" />
            <ul className="mt-4 space-y-2 list-disc pl-5">
              <li>Elaboración 100% artesanal, sin humo líquido ni aditivos innecesarios.</li>
              <li>Ahumado natural en roble austriaco.</li>
              <li>Maduración en seco de 4 a 6 meses según el producto.</li>
              <li>Marcas confiadas ya presentes en cadenas como Renaissance, Marriott, Ritz-Carlton y DoubleTree by Hilton.</li>
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-6 mt-12 pt-8 border-t border-gold/15 flex flex-col md:flex-row items-center gap-6">
          <img
            src="/brand/logo-lacharcuteria.png"
            alt={SUPPLIER_NAME}
            className="h-16 w-auto"
            width={200}
            height={64}
          />
          <p className="text-sm text-cream-muted">
            Alianza exclusiva V Región con {SUPPLIER_NAME}.
          </p>
        </div>
      </section>
    </main>
  );
}
