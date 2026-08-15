const GA_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID ?? '').trim();
const enabled = Boolean(GA_ID) && typeof window !== 'undefined';

type GtagFn = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

let loaded = false;

export function loadAnalytics(): void {
  if (!enabled || loaded) return;
  loaded = true;

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer ?? [];
  const gtag: GtagFn = (...args: unknown[]) => {
    window.dataLayer!.push(args);
  };
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
}

export type WhatsAppSource = 'cart-submit' | 'sticky' | 'home-cta' | 'contact' | 'catalog-cta';

export function trackWhatsAppClick(source: WhatsAppSource): void {
  if (!enabled || !window.gtag) return;
  window.gtag('event', 'whatsapp_click', { source });
}

export function trackPageView(path: string): void {
  if (!enabled || !window.gtag) return;
  window.gtag('event', 'page_view', { page_path: path });
}
