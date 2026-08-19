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

/**
 * Queue an email to a single client recipient. Uses the same Firestore-based
 * Trigger Email extension as `notifyAdmins`. Failures are logged but never
 * thrown — the user action must succeed even if the notification queue does not.
 */
export async function notifyClient(to: string, subject: string, html: string): Promise<void> {
  if (!isFirebaseConfigured) return;
  try {
    // Firestore rule requires request.resource.data.to == [request.auth.token.email].
    // Auth token emails are lowercase; normalize here so any caller-side casing
    // difference never trips the rule.
    await addDoc(collection(db, 'mail'), {
      to: [to.toLowerCase()],
      message: { subject, html },
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[mail] notifyClient failed:', err);
  }
}
