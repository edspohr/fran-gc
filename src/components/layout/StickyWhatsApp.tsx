import { useLocation } from 'react-router-dom';
import { WHATSAPP_LINK } from '@/config/site';
import { trackWhatsAppClick } from '@/lib/analytics';
import { useClientProfile } from '@/contexts/ClientProfileContext';

const DEFAULT_MSG = encodeURIComponent(
  'Buenas, quisiera solicitar el catálogo y lista de precios mayorista de FRAN GC. Gracias.',
);

export default function StickyWhatsApp() {
  const { pathname } = useLocation();
  const { isVerified, isAdmin } = useClientProfile();

  if (pathname.startsWith('/admin')) return null;
  // Hide for verified clients — they should use the internal order flow.
  if (isVerified || isAdmin) return null;

  return (
    <a
      href={`${WHATSAPP_LINK}?text=${DEFAULT_MSG}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      onClick={() => trackWhatsAppClick('sticky')}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-ink shadow-lg hover:brightness-105 transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M12.04 2.003c-5.523 0-10 4.478-10 10 0 1.762.463 3.478 1.343 4.995L2 22l5.128-1.343A9.96 9.96 0 0 0 12.04 22c5.522 0 10-4.478 10-10s-4.478-9.997-10-9.997Zm0 18.181a8.18 8.18 0 0 1-4.17-1.14l-.3-.178-3.043.797.812-2.966-.196-.305a8.169 8.169 0 1 1 6.898 3.792Zm4.492-6.116c-.246-.123-1.457-.72-1.683-.802-.226-.082-.39-.123-.556.124-.164.246-.638.803-.783.968-.145.164-.288.184-.534.061-.246-.123-1.04-.383-1.98-1.222-.732-.653-1.226-1.459-1.37-1.706-.145-.246-.016-.379.108-.501.111-.11.246-.288.37-.432.123-.145.164-.246.246-.41.082-.164.041-.308-.02-.431-.062-.123-.556-1.34-.762-1.834-.2-.483-.404-.417-.556-.425l-.474-.008a.912.912 0 0 0-.66.308c-.226.246-.865.845-.865 2.06s.886 2.39 1.01 2.554c.123.164 1.74 2.656 4.213 3.725.589.254 1.048.406 1.407.52.591.188 1.128.161 1.553.098.474-.071 1.457-.596 1.664-1.171.205-.575.205-1.068.144-1.171-.062-.103-.226-.164-.472-.288Z" />
      </svg>
      <span className="hidden sm:inline text-sm font-medium">WhatsApp</span>
    </a>
  );
}
