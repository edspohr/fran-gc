import Eyebrow from '@/components/ui/Eyebrow';
import HairlineRule from '@/components/ui/HairlineRule';
import { useSeo } from '@/lib/seo';
import { LEGAL_NAME } from '@/config/site';

export default function Terms() {
  useSeo({
    title: 'Términos y condiciones · FRAN GC',
    description: `Términos de uso del catálogo digital de ${LEGAL_NAME}.`,
    path: '/terminos',
    noindex: true,
  });

  return (
    <main>
      <section className="pt-14 pb-8 border-b border-gold/10">
        <div className="mx-auto max-w-3xl px-6 space-y-3">
          <Eyebrow>Legal</Eyebrow>
          <h1 className="font-serif text-4xl">Términos y condiciones</h1>
          <HairlineRule />
          <p className="text-xs text-cream-muted">Última actualización: agosto 2026.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6 space-y-6 text-cream-muted text-sm leading-relaxed">
          <div>
            <h2 className="font-serif text-xl text-cream">Alcance del sitio</h2>
            <HairlineRule className="mt-2" />
            <p className="mt-3">
              Este sitio web es el catálogo digital de {LEGAL_NAME}, distribuidora mayorista de
              charcutería artesanal en la V Región. No es un canal de venta al consumidor final
              ni ofrece precios públicos.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-cream">Cotizaciones y precios</h2>
            <HairlineRule className="mt-2" />
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>Los precios se comunican de manera privada, según volumen y frecuencia.</li>
              <li>
                Las cotizaciones enviadas desde este sitio son solo una solicitud. Una vez
                confirmadas por WhatsApp, se envían pesos, valores y forma de pago.
              </li>
              <li>Los precios están sujetos a cambio sin previo aviso hasta la confirmación del pedido.</li>
              <li>Compra mínima: 5 kg surtidos entre los productos del catálogo.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl text-cream">Despacho y responsabilidad</h2>
            <HairlineRule className="mt-2" />
            <p className="mt-3">
              Los despachos se coordinan con anticipación mínima de 3 días hábiles y se
              programan dentro del calendario semanal de rutas en la V Región. Cambios de
              dirección u horario deben avisarse con al menos 24 horas de anticipación.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-cream">Devoluciones</h2>
            <HairlineRule className="mt-2" />
            <p className="mt-3">
              Como producto perecible, la charcutería no admite devoluciones una vez recibida
              conforme. Cualquier observación de calidad debe realizarse al momento de la
              entrega para evaluar en conjunto.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-cream">Facturación</h2>
            <HairlineRule className="mt-2" />
            <p className="mt-3">
              Emitimos factura electrónica formal contra pago por transferencia bancaria o
              contra entrega. No se opera con crédito.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
