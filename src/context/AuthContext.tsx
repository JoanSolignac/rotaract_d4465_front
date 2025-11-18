import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { loginRequest, registerRequest, type RegisterPayload } from "../api/auth";
import { configureAxiosInterceptors } from "../api/axiosConfig";
import type { AuthResponse, AuthTokens, AuthUser, UserRole } from "../types/auth";
import {
  clearStoredAuth,
  getStoredAuth,
  persistAuth,
} from "../utils/authStorage";
import { normalizeUser } from "../utils/roleMapping";

interface AuthContextValue {
  user: AuthUser | null;
  role: UserRole | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  login: (correo: string, contrasena: string) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const tokensRef = useRef<AuthTokens | null>(null);

  const syncTokens = useCallback((next: AuthTokens, nextUser?: AuthUser) => {
    setTokens(next);
    tokensRef.current = next;
    const auth = getStoredAuth();
    const userToPersist =
      nextUser ?? (auth?.user ? normalizeUser(auth.user) : null);
    if (userToPersist) {
      persistAuth({ user: userToPersist, tokens: next });
    }
  }, []);

  const handleBootstrap = useCallback(() => {
    const stored = getStoredAuth();
    if (stored) {
      const normalized = normalizeUser(stored.user);
      setUser(normalized);
      setTokens(stored.tokens);
      tokensRef.current = stored.tokens;
      persistAuth({ user: normalized, tokens: stored.tokens });
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    handleBootstrap();
  }, [handleBootstrap]);

  const logout = useCallback(() => {
    setUser(null);
    setTokens(null);
    tokensRef.current = null;
    clearStoredAuth();
  }, []);

  useEffect(() => {
    configureAxiosInterceptors({
      getTokens: () => tokensRef.current,
      onLogout: logout,
    });
  }, [logout]);

  const handleAuthSuccess = useCallback(
    (payload: AuthResponse): AuthUser => {
      const nextUser = normalizeUser({
        correo: payload.correo,
        rol: payload.rol,
      });
      const nextTokens = {
        accessToken: payload.accessToken,
      };
      setUser(nextUser);
      syncTokens(nextTokens, nextUser);
      return nextUser;
    },
    [syncTokens],
  );

  const login = useCallback(async (correo: string, contrasena: string) => {
    const response = await loginRequest({ correo, contrasena });
    return handleAuthSuccess(response);
  }, [handleAuthSuccess]);

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const response = await registerRequest(payload);
      return handleAuthSuccess(response);
    },
    [handleAuthSuccess],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: user?.rol ?? null,
      tokens,
      isLoading,
      login,
      register,
      logout,
    }),
    [isLoading, login, logout, register, tokens, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
