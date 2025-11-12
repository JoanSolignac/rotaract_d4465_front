import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  fetchProfile,
  login as loginRequest,
  register as registerRequest,
} from '../../features/auth/services/authService.js';
import { setAuthToken } from '../../services/api/httpClient.js';

const STORAGE_KEY = 'rotaractd4465:auth';
const initialState = {
  token: null,
  user: null,
  status: 'idle',
  error: null,
};

const isBrowser = typeof window !== 'undefined';

const normaliseAuthPayload = (payload) => {
  if (!payload) {
    return { token: null, user: null };
  }

  const source = payload.data ?? payload;
  const token =
    source?.token ??
    source?.accessToken ??
    source?.access_token ??
    source?.jwt ??
    source?.authorization ??
    null;

  const user =
    source?.user ??
    source?.profile ??
    source?.account ??
    source?.data ??
    null;

  return { token, user };
};

const readPersistedAuth = () => {
  if (!isBrowser) {
    return initialState;
  }

  const persistedValue =
    window.localStorage.getItem(STORAGE_KEY) ?? window.sessionStorage.getItem(STORAGE_KEY);

  if (!persistedValue) {
    return initialState;
  }

  try {
    const parsed = JSON.parse(persistedValue);
    if (parsed?.token) {
      setAuthToken(parsed.token);
      return {
        token: parsed.token,
        user: parsed.user ?? null,
        status: 'authenticated',
        error: null,
      };
    }
  } catch (error) {
    console.warn('No fue posible recuperar la sesión almacenada.', error);
  }

  return initialState;
};

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => readPersistedAuth());

  useEffect(() => {
    setAuthToken(authState.token);
  }, [authState.token]);

  const persistAuth = useCallback((payload, remember) => {
    if (!isBrowser) {
      return;
    }

    const serialised = JSON.stringify(payload);

    if (remember) {
      window.localStorage.setItem(STORAGE_KEY, serialised);
      window.sessionStorage.removeItem(STORAGE_KEY);
    } else {
      window.sessionStorage.setItem(STORAGE_KEY, serialised);
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const clearStoredAuth = useCallback(() => {
    if (!isBrowser) {
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const login = useCallback(
    async (credentials, options = {}) => {
      setAuthState((previous) => ({
        ...previous,
        status: 'pending',
        error: null,
      }));

      try {
        const response = await loginRequest(credentials);
        const { token, user: initialUser } = normaliseAuthPayload(response);

        if (!token) {
          throw new Error(
            'La respuesta del servidor no contiene un token de autenticación válido. Contacta al administrador.',
          );
        }

        setAuthToken(token);

        let resolvedUser = initialUser ?? null;

        if (!resolvedUser) {
          try {
            const profileResponse = await fetchProfile();
            resolvedUser = profileResponse?.data ?? profileResponse ?? null;
          } catch (profileError) {
            console.warn('No fue posible cargar el perfil del usuario.', profileError);
          }
        }

        const payload = {
          token,
          user: resolvedUser,
        };

        persistAuth(payload, options.remember);

        setAuthState({
          token,
          user: resolvedUser,
          status: 'authenticated',
          error: null,
        });

        return payload;
      } catch (error) {
        const message =
          error?.message ??
          'No pudimos iniciar sesión con las credenciales proporcionadas. Verifica tus datos e inténtalo nuevamente.';

        setAuthState({
          token: null,
          user: null,
          status: 'error',
          error: message,
        });

        clearStoredAuth();
        setAuthToken(null);

        throw new Error(message);
      }
    },
    [persistAuth, clearStoredAuth],
  );

  const logout = useCallback(() => {
    clearStoredAuth();
    setAuthToken(null);
    setAuthState(initialState);
  }, [clearStoredAuth]);

  const register = useCallback(
    async (payload, options = { autoLogin: true }) => {
      setAuthState((previous) => ({
        ...previous,
        status: 'pending',
        error: null,
      }));

      try {
        const response = await registerRequest(payload);
        let autoLoginCompleted = false;

        if (options?.autoLogin !== false) {
          try {
            await login(
              { email: payload.email, password: payload.password },
              { remember: true },
            );
            autoLoginCompleted = true;
          } catch (autoLoginError) {
            console.warn('No fue posible iniciar sesión automáticamente después del registro.', autoLoginError);
          }
        }

        if (!autoLoginCompleted) {
          setAuthState((previous) => ({
            ...previous,
            status: 'idle',
            error: null,
          }));
        }

        return { response, autoLogin: autoLoginCompleted };
      } catch (error) {
        const message =
          error?.message ??
          'No pudimos crear tu cuenta en este momento. Revisa la información ingresada e inténtalo nuevamente.';

        setAuthState((previous) => ({
          ...previous,
          status: 'error',
          error: message,
        }));

        throw new Error(message);
      }
    },
    [login],
  );

  const value = useMemo(
    () => ({
      ...authState,
      isAuthenticated: Boolean(authState.token),
      login,
      logout,
      register,
      clearError: () =>
        setAuthState((previous) => ({
          ...previous,
          error: null,
        })),
    }),
    [authState, login, logout, register],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
