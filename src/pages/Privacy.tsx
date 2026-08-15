import Eyebrow from '@/components/ui/Eyebrow';
import HairlineRule from '@/components/ui/HairlineRule';
import { useSeo } from '@/lib/seo';
import { LEGAL_NAME, WHATSAPP_DISPLAY } from '@/config/site';

export default function Privacy() {
  useSeo({
    title: 'Política de privacidad · FRAN GC',
    description: `Política de privacidad de ${LEGAL_NAME}.`,
    path: '/politica-de-privacidad',
    noindex: true,
  });

  return (
    <main>
      <section className="pt-14 pb-8 border-b border-gold/10">
        <div className="mx-auto max-w-3xl px-6 space-y-3">
          <Eyebrow>Legal</Eyebrow>
          <h1 className="font-serif text-4xl">Política de privacidad</h1>
          <HairlineRule />
          <p className="text-xs text-cream-muted">Última actualización: agosto 2026.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6 space-y-6 text-cream-muted text-sm leading-relaxed">
          <p>
            {LEGAL_NAME} respeta su privacidad. Este sitio es un catálogo digital orientado a
            clientes mayoristas y no procesa pagos ni realiza registros de usuarios finales.
          </p>

          <div>
            <h2 className="font-serif text-xl text-cream">Datos que recopilamos</h2>
            <HairlineRule className="mt-2" />
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>
                <span className="text-cream">Cotizaciones enviadas por WhatsApp:</span> nombre
                del negocio, comuna y notas que usted incluya. Estos datos viajan directamente
                por WhatsApp y no se almacenan en este sitio.
              </li>
              <li>
                <span className="text-cream">Cotización local:</span> los productos que agrega
                a su cotización se guardan únicamente en su navegador (localStorage). No se
                envían a nuestros servidores hasta que usted decide enviarlos por WhatsApp.
              </li>
              <li>
                <span className="text-cream">Analítica agregada:</span> podemos usar Google
                Analytics 4 para medir tráfico anónimo del sitio (páginas vistas, dispositivos,
                origen). No se recopila información que permita identificarlo personalmente.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl text-cream">Sus derechos</h2>
            <HairlineRule className="mt-2" />
            <p className="mt-3">
              Si desea consultar, corregir o eliminar cualquier dato que le concierna, escríbanos
              a WhatsApp {WHATSAPP_DISPLAY}. Responderemos dentro de plazos razonables.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-cream">Cookies</h2>
            <HairlineRule className="mt-2" />
            <p className="mt-3">
              Este sitio no instala cookies propias con fines de perfilamiento. Google Analytics
              puede instalar cookies analíticas de acuerdo a su propia política.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
