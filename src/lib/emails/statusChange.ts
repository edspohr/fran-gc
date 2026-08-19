import type { Order } from '@/types/order';
import { SITE_URL } from '@/config/site';
import { wrap } from './layout';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export type ClientNotifiableStatus = 'en-preparacion' | 'entregado';

export function renderStatusChangeEmail(
  order: Order,
  to: ClientNotifiableStatus,
): { subject: string; html: string } {
  const clientName = order.clientSnapshot.name.trim().split(/\s+/)[0] || 'hola';
  const link = `${SITE_URL}/mis-pedidos/${order.id}`;
  const subject =
    to === 'en-preparacion'
      ? `Su pedido ${order.id} está en preparación`
      : `Su pedido ${order.id} fue entregado`;

  const lead =
    to === 'en-preparacion'
      ? `Su pedido <strong>${order.id}</strong> entró en preparación. Estamos coordinando la entrega y le avisaremos cuando salga.`
      : `Su pedido <strong>${order.id}</strong> fue entregado. Gracias por confiar en FRAN GC.`;

  const differenceLine =
    to === 'entregado' && order.hasDifference
      ? `<p style="margin:16px 0 0 0;font-size:14px;color:#7a2b2b;line-height:1.55;">Este pedido se entregó con diferencias respecto a lo solicitado. Puede revisar el detalle en su cuenta.</p>`
      : '';

  const body = `
    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.55;">Hola ${escapeHtml(clientName)},</p>
    <p style="margin:0 0 20px 0;font-size:15px;line-height:1.55;">${lead}</p>
    <div style="margin:20px 0;">
      <a href="${link}" style="display:inline-block;background:#AE9A79;color:#121212;text-decoration:none;font-weight:600;padding:11px 20px;border-radius:4px;letter-spacing:0.02em;">Ver detalle del pedido</a>
    </div>
    ${differenceLine}
  `;
  return { subject, html: wrap(body) };
}
