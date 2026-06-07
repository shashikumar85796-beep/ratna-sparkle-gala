// Simple session-based admin auth using localStorage
// In production, use Supabase Auth with RLS policies

const ADMIN_KEY = 'bcs_admin_session';
const ADMIN_CREDENTIALS = { username: 'bcsadmin', password: 'BCS@2026' };

export function adminLogin(username: string, password: string): boolean {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    if (typeof window === 'undefined') return false;
    const session = { username, loginTime: Date.now(), expires: Date.now() + 24 * 60 * 60 * 1000 };
    localStorage.setItem(ADMIN_KEY, JSON.stringify(session));
    return true;
  }
  return false;
}

export function adminLogout(): void {
  localStorage.removeItem(ADMIN_KEY);
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw);
    if (Date.now() > session.expires) {
      localStorage.removeItem(ADMIN_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function getAdminName(): string {
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    if (!raw) return 'Admin';
    const session = JSON.parse(raw);
    return session.username ?? 'Admin';
  } catch {
    return 'Admin';
  }
}
