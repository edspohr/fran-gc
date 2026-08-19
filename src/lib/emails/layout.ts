import { WHATSAPP_DISPLAY, LEGAL_NAME } from '@/config/site';

export function wrap(body: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f5f2ec;padding:24px 12px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#121212;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;padding:32px 28px;">
      <tr><td>
        <div style="font-family:'Playfair Display',Georgia,serif;font-size:22px;letter-spacing:0.02em;color:#121212;margin-bottom:8px;">FRAN GC</div>
        <div style="height:1px;background:#AE9A79;opacity:0.5;margin:0 0 24px 0;"></div>
        ${body}
        <div style="height:1px;background:#e5e0d5;margin:32px 0 16px 0;"></div>
        <div style="font-size:12px;color:#6b6b6b;line-height:1.5;">${LEGAL_NAME} · V Región · WhatsApp: ${WHATSAPP_DISPLAY}</div>
      </td></tr>
    </table>
  </body></html>`;
}
