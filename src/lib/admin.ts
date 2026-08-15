export const ADMIN_EMAILS: readonly string[] = [
  'francisca@spohr.cl',
  'edmundo@spohr.cl',
  'edmundo@growthbuddies.cl',
];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
