import { WHATSAPP_LINK } from '@/config/site';
import { formatUnit } from './format';
import { trackWhatsAppClick, type WhatsAppSource as GaSource } from './analytics';
import type { CartState } from '@/types/cart';

export function buildQuoteMessage(state: CartState): string {
  const { businessName, comuna, note } = state.meta;
  const lines: string[] = [];

  if (businessName || comuna) {
    const parts = [businessName || 'un cliente', comuna ? `(${comuna})` : ''].join(' ').trim();
    lines.push(`Buenas, escribo desde ${parts}.`);
  } else {
    lines.push('Buenas, quisiera cotizar los siguientes productos:');
  }
  lines.push('Quisiera cotizar los siguientes productos de su catálogo:');
  lines.push('');

  for (const item of state.items) {
    const qty = formatUnit(item.quantity, item.unitType);
    lines.push(`• ${item.name} — ${item.presentation} — ${qty}`);
  }

  lines.push('');
  if (note.trim()) {
    lines.push(`Notas: ${note.trim()}`);
    lines.push('');
  }
  lines.push('Quedo atento(a) a su respuesta y a la lista de precios mayorista. Gracias.');

  return lines.join('\n');
}

export type WhatsAppSource = GaSource;

export function openWhatsApp(message: string, source: WhatsAppSource = 'cart-submit'): void {
  trackWhatsAppClick(source);
  const url = `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener');
}
