import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { ADMIN_EMAILS } from './admin';

interface MailPayload {
  subject: string;
  html: string;
  to?: readonly string[];
}

/**
 * Queue an email to the admins. Uses the "Trigger Email from Firestore"
 * Firebase Extension: any doc in `mail/` with { to, message: { subject, html } }
 * is picked up and delivered.
 *
 * If SMTP/extension is not yet configured, docs remain in `mail/` and can be
 * read from the admin inbox — no data is lost.
 */
export async function notifyAdmins(payload: MailPayload): Promise<void> {
  if (!isFirebaseConfigured) return;
  try {
    await addDoc(collection(db, 'mail'), {
      to: payload.to ?? ADMIN_EMAILS,
      message: {
        subject: payload.subject,
        html: payload.html,
      },
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    // Non-fatal — the user action succeeded, only the notification failed.
    // eslint-disable-next-line no-console
    console.warn('[mail] notifyAdmins failed:', err);
  }
}
