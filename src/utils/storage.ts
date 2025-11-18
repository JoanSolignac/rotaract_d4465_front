import { AuthSession } from '../types';
import { SESSION_STORAGE_KEY } from './constants';

const isBrowser = typeof window !== 'undefined';

export const saveSession = (session: AuthSession) => {
  if (!isBrowser) return;
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const getSession = (): AuthSession | null => {
  if (!isBrowser) return null;
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch (error) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
};

export const clearSession = () => {
  if (!isBrowser) return;
  localStorage.removeItem(SESSION_STORAGE_KEY);
};
