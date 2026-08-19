import type { Order } from '@/types/order';
import { wrap } from './layout';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatQty(q: number, unit: string): string {
  const n = Number.isInteger(q) ? String(q) : q.toString();
  return `${n} ${unit === 'kg' ? 'kg' : unit}`;
}

export function renderOrderReceiptEmail(order: Order): { subject: string; html: string } {
  const subject = `Pedido ${order.id} recibido — FRAN GC`;
  const clientName = order.clientSnapshot.name.trim().split(/\s+/)[0] || 'hola';
  const deliveryStr = order.deliveryDate.toDate().toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const rows = order.items
    .map(
      (it) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #ececec;font-size:14px;color:#121212;">
          <div style="font-weight:600;">${escapeHtml(it.name)}</div>
          <div style="font-size:12px;color:#6b6b6b;">${escapeHtml(it.presentation)}</div>
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #ececec;font-size:14px;color:#121212;text-align:right;white-space:nowrap;">${escapeHtml(formatQty(it.quantity, it.unitType))}</td>
      </tr>`,
    )
    .join('');

  const notesBlock = order.notes
    ? `<div style="margin-top:20px;padding:12px 14px;background:#f7f3ec;border-left:3px solid #AE9A79;font-size:13px;color:#3a3a3a;"><strong style="display:block;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#6b6b6b;margin-bottom:4px;">Notas</strong>${escapeHtml(order.notes)}</div>`
    : '';

  const body = `
    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.55;">Hola ${escapeHtml(clientName)}, recibimos su pedido <strong>${order.id}</strong>.</p>
    <p style="margin:0 0 20px 0;font-size:14px;color:#3a3a3a;">Fecha de entrega solicitada: <strong style="color:#121212;">${deliveryStr}</strong>.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:8px;">
      <thead>
        <tr>
          <th align="left" style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#6b6b6b;padding:0 0 6px 0;border-bottom:1px solid #d9d1c1;">Producto</th>
          <th align="right" style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#6b6b6b;padding:0 0 6px 0;border-bottom:1px solid #d9d1c1;">Cantidad</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    ${notesBlock}
    <p style="margin:24px 0 0 0;font-size:14px;color:#3a3a3a;line-height:1.55;">Le avisaremos cuando su pedido entre en preparación.</p>
  `;
  return { subject, html: wrap(body) };
}
