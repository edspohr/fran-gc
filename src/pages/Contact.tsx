import Eyebrow from '@/components/ui/Eyebrow';
import HairlineRule from '@/components/ui/HairlineRule';
import Button from '@/components/ui/Button';
import { useSeo } from '@/lib/seo';
import { COMUNAS, LEGAL_NAME, WHATSAPP_DISPLAY, WHATSAPP_LINK } from '@/config/site';

const MSG = encodeURIComponent(
  'Buenas, escribo desde mi negocio. Quisiera coordinar un pedido mayorista con FRAN GC. Gracias.',
);

export default function Contact() {
  useSeo({
    title: 'Contacto · FRAN GC',
    description: `Contáctenos por WhatsApp al ${WHATSAPP_DISPLAY}. Cobertura: V Región completa, entrega semanal.`,
    path: '/contacto',
  });

  return (
    <main>
      <section className="pt-14 pb-8 border-b border-gold/10">
        <div className="mx-auto max-w-4xl px-6 space-y-3">
          <Eyebrow>Contacto</Eyebrow>
          <h1 className="font-serif text-4xl md:text-5xl">Hablemos por WhatsApp</h1>
          <HairlineRule />
          <p className="text-cream-muted max-w-2xl">
            Somos una distribuidora pequeña y respondemos personalmente. WhatsApp es la vía más
            rápida para cotizar y coordinar.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <p className="eyebrow">WhatsApp</p>
              <p className="font-serif text-3xl mt-2">{WHATSAPP_DISPLAY}</p>
              <Button
                as="a"
                href={`${WHATSAPP_LINK}?text=${MSG}`}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                className="mt-4"
              >
                Escribirnos ahora
              </Button>
            </div>

            <div>
              <p className="eyebrow">Razón social</p>
              <p className="mt-2">{LEGAL_NAME}</p>
            </div>

            <div>
              <p className="eyebrow">Modalidad</p>
              <p className="mt-2 text-cream-muted text-sm">
                Solo venta mayorista (HORECA y retail). Compra mínima 5 kg surtidos, pedidos con
                3 días de anticipación.
              </p>
            </div>
          </div>

          <div>
            <p className="eyebrow">Cobertura</p>
            <p className="font-serif text-2xl mt-2">V Región de Valparaíso</p>
            <HairlineRule className="mt-3" />
            <ul className="mt-4 grid grid-cols-2 gap-y-1 text-sm text-cream-muted">
              {COMUNAS.map((c) => (
                <li key={c}>· {c}</li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-cream-muted">
              ¿Su comuna no aparece? Consúltenos igualmente — evaluamos entregas puntuales fuera
              de ruta.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
