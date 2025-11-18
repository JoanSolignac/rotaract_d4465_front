import { AuthTokens, AuthUser } from "../types/auth";

const STORAGE_KEY = "rotaract-d4465-auth";

interface StoredAuth {
  user: AuthUser;
  tokens: AuthTokens;
}

export const persistAuth = (payload: StoredAuth) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const getStoredAuth = (): StoredAuth | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAuth;
  } catch (error) {
    console.error("Error reading stored auth", error);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const clearStoredAuth = () => localStorage.removeItem(STORAGE_KEY);

