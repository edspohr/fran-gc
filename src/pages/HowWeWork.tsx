import { Link } from 'react-router-dom';
import Eyebrow from '@/components/ui/Eyebrow';
import HairlineRule from '@/components/ui/HairlineRule';
import Button from '@/components/ui/Button';
import { useSeo } from '@/lib/seo';
import { WHATSAPP_LINK } from '@/config/site';

const STEPS = [
  {
    n: '01',
    title: 'Anticipación de 3 días',
    body: 'Los pedidos se despachan con tres días hábiles de anticipación. Esto nos permite asegurar stock fresco y coordinar rutas en la V Región.',
  },
  {
    n: '02',
    title: 'Compra mínima: 5 kg surtidos',
    body: 'El pedido mínimo son 5 kilos, combinando libremente cualquier variedad del catálogo. Sin límites por producto individual.',
  },
  {
    n: '03',
    title: 'Confirmación por WhatsApp',
    body: 'Envíe su cotización desde el catálogo. Confirmamos disponibilidad, pesos exactos y el total con la lista de precios mayorista actualizada.',
  },
  {
    n: '04',
    title: 'Pago por transferencia o contra entrega',
    body: 'Aceptamos transferencia bancaria y pago contra entrega. Emitimos factura formal para su contabilidad. No trabajamos con crédito.',
  },
  {
    n: '05',
    title: 'Despacho semanal en la V Región',
    body: 'Ruta programada semanal por Valparaíso, Viña del Mar, Concón, Reñaca, Quilpué, Villa Alemana, Casablanca y litoral central. Coordinamos horario con usted.',
  },
];

const CTA_MSG = encodeURIComponent(
  'Buenas, quisiera coordinar un primer pedido mayorista con FRAN GC. ¿Podrían enviarme el catálogo y la lista de precios? Gracias.',
);

export default function HowWeWork() {
  useSeo({
    title: 'Cómo trabajamos · FRAN GC',
    description:
      'Condiciones mayoristas de FRAN GC: 3 días de anticipación, 5 kg mínimos surtidos, entrega semanal en la V Región, pago por transferencia o contra entrega, facturación formal.',
    path: '/como-trabajamos',
  });

  return (
    <main>
      <section className="pt-14 pb-8 border-b border-gold/10">
        <div className="mx-auto max-w-4xl px-6 space-y-3">
          <Eyebrow>Proceso mayorista</Eyebrow>
          <h1 className="font-serif text-4xl md:text-5xl">Cómo trabajamos con nuestros clientes</h1>
          <HairlineRule />
          <p className="text-cream-muted max-w-2xl">
            Somos una distribuidora boutique. Nuestro proceso está pensado para restaurantes,
            hoteles y emporios que valoran la trazabilidad y la relación cercana con quien los
            provee.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <ol className="space-y-8">
            {STEPS.map((s) => (
              <li key={s.n} className="grid grid-cols-[auto_1fr] gap-6 items-start pb-8 border-b border-gold/10 last:border-0">
                <span className="font-display text-4xl text-gold">{s.n}</span>
                <div>
                  <h2 className="font-serif text-2xl">{s.title}</h2>
                  <p className="text-cream-muted mt-2">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-4xl px-6 text-center space-y-4">
          <h2 className="font-serif text-3xl">¿Listo para su primer pedido?</h2>
          <p className="text-cream-muted max-w-xl mx-auto">
            Solicítenos el catálogo y la lista de precios mayorista. Coordinamos su primera
            entrega en la V Región en pocos días.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Button as="a" href={`${WHATSAPP_LINK}?text=${CTA_MSG}`} target="_blank" rel="noopener noreferrer" size="lg">
              Escribirnos por WhatsApp
            </Button>
            <Link
              to="/catalogo"
              className="inline-flex items-center justify-center border border-gold/60 text-cream hover:text-ink hover:bg-cream transition-colors px-7 py-3.5 text-base font-medium tracking-wide"
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
