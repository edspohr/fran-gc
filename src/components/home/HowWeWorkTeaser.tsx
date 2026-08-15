import { Link } from 'react-router-dom';
import Eyebrow from '../ui/Eyebrow';
import HairlineRule from '../ui/HairlineRule';

const STEPS = [
  {
    n: '01',
    title: 'Anticipación',
    body: 'Los pedidos se despachan con tres días de anticipación para asegurar stock fresco.',
  },
  {
    n: '02',
    title: 'Compra mínima',
    body: '5 kg surtidos entre nuestros productos. Sin restricciones por variedad.',
  },
  {
    n: '03',
    title: 'Entrega semanal',
    body: 'Ruta programada en toda la V Región: Valparaíso, Viña, Concón, Quilpué y más.',
  },
  {
    n: '04',
    title: 'Facturación formal',
    body: 'Pago por transferencia o contra entrega. Factura para su contabilidad.',
  },
];

export default function HowWeWorkTeaser() {
  return (
    <section className="py-20 md:py-24 bg-surface-1/40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center md:text-left space-y-3 mb-10">
          <Eyebrow>Cómo trabajamos</Eyebrow>
          <h2 className="font-serif text-3xl md:text-4xl">Condiciones mayoristas claras</h2>
          <HairlineRule className="mx-auto md:mx-0" />
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {STEPS.map((s) => (
            <li key={s.n} className="p-6 bg-ink border border-gold/10 rounded">
              <span className="font-display text-2xl text-gold">{s.n}</span>
              <h3 className="font-serif text-xl mt-3">{s.title}</h3>
              <p className="text-sm text-cream-muted mt-2">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 text-center md:text-left">
          <Link
            to="/como-trabajamos"
            className="text-sm text-gold hover:text-gold-hover underline underline-offset-4"
          >
            Ver el proceso completo →
          </Link>
        </div>
      </div>
    </section>
  );
}
