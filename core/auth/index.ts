// Mock auth service
import { loginAPI } from '../api/auth';

export type Role = 'salesperson' | 'manager';

export interface User {
  id: string;
  name: string;
  role: Role;
  organization_id: string;
}

export interface Session {
  token: string;
  user: User;
}

const SESSION_KEY = 'followupx_session';

export const getSession = (): Session | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const setSession = (session: Session): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearSession = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
};

export const getToken = (): string | null => {
  const session = getSession();
  return session?.token || null;
};

export const login = async (phone_number: string, password: string): Promise<{token: string, user: User} | null> => {
  try {
    const res = await loginAPI(phone_number, password);
    return res as {token: string, user: User};
  } catch {
    return null;
  }
};

export const getRoleHome = (role: Role): string => {
  return role === 'salesperson' ? '/sales' : '/manager';
};