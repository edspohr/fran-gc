import { SITE_URL, WHATSAPP_LINK } from '@/config/site';
import { wrap } from './layout';

export interface ActivatedInput {
  name: string;
  company: string;
}

export function renderActivatedEmail(client: ActivatedInput): { subject: string; html: string } {
  const subject = 'Su cuenta en FRAN GC está activa';
  const firstName = client.name.trim().split(/\s+/)[0] || 'hola';
  const company = client.company.trim();
  const body = `
    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.55;">Hola ${firstName}, su cuenta de <strong>${company}</strong> ya está activa. Desde ahora puede armar sus pedidos directamente en el sitio: es más rápido que cotizar por WhatsApp y queda todo su historial guardado.</p>
    <div style="margin:24px 0;">
      <a href="${SITE_URL}/pedido" style="display:inline-block;background:#AE9A79;color:#121212;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:4px;letter-spacing:0.02em;">Hacer mi primer pedido</a>
    </div>
    <p style="margin:0;font-size:14px;color:#4a4a4a;line-height:1.55;">Si prefiere, seguimos atentos por <a href="${WHATSAPP_LINK}" style="color:#AE9A79;text-decoration:none;">WhatsApp</a>.</p>
  `;
  return { subject, html: wrap(body) };
}
