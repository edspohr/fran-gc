import Eyebrow from '../ui/Eyebrow';
import HairlineRule from '../ui/HairlineRule';

const CUES = [
  {
    title: 'Elaboración artesanal',
    body: 'Recetas europeas de tres generaciones, guiadas por el maestro charcutero Yury Karpitski en el barrio Franklin de Santiago.',
  },
  {
    title: 'Ahumado natural',
    body: 'Ahumamos con madera de roble austriaco. Sin humo líquido, sin aditivos innecesarios.',
  },
  {
    title: 'Cadena de frío en la V Región',
    body: 'Distribución semanal directa desde Santiago hacia HORECA y retail especializado del litoral central.',
  },
];

export default function TrustCues() {
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center md:text-left space-y-3 mb-10">
          <Eyebrow>Nuestro sello</Eyebrow>
          <h2 className="font-serif text-3xl md:text-4xl">
            Charcutería fina, hecha como corresponde.
          </h2>
          <HairlineRule className="mx-auto md:mx-0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CUES.map((c) => (
            <div key={c.title} className="space-y-3">
              <h3 className="font-serif text-xl">{c.title}</h3>
              <p className="text-sm text-cream-muted">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-10 border-t border-gold/15 flex flex-col md:flex-row items-center gap-6">
          <img
            src="/brand/logo-lacharcuteria.png"
            alt="La Charcutería Artesanal"
            className="h-16 w-auto"
            width={200}
            height={64}
          />
          <p className="text-sm text-cream-muted md:max-w-lg">
            Representante oficial en la V Región de{' '}
            <span className="text-cream">La Charcutería Artesanal</span> — fabricantes de
            embutidos y cecinas premium, con distribución en hoteles como Renaissance,
            Ritz-Carlton, Marriott y DoubleTree.
          </p>
        </div>
      </div>
    </section>
  );
}
