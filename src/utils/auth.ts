import { AuthSession, AuthUser, UserRole, USER_ROLES } from "../types";

const roleDictionary: Record<string, UserRole> = USER_ROLES.reduce<Record<string, UserRole>>(
  (acc, role) => {
    acc[role.toUpperCase()] = role;
    return acc;
  },
  {},
);

const normalizeRole = (role?: string): UserRole => {
  if (!role) return "INTERESADO";
  const formatted = role.trim().toUpperCase();
  return roleDictionary[formatted] ?? "INTERESADO";
};

const resolveUser = (rawUser: unknown): AuthUser => {
  if (!rawUser || typeof rawUser !== "object") {
    return { correo: "", rol: "INTERESADO" };
  }
  const candidate = rawUser as Record<string, unknown>;
  const role = normalizeRole(
    (candidate.rol as string) ??
      (candidate.role as string),
  );
  return {
    id:
      (candidate.id as string) ??
      (candidate._id as string) ??
      (candidate.uid as string),
    correo:
      (candidate.correo as string) ??
      (candidate.email as string) ??
      "",
    nombre:
      (candidate.nombre as string) ??
      (candidate.nombres as string) ??
      (candidate.firstName as string),
    apellidos:
      (candidate.apellidos as string) ??
      (candidate.lastName as string),
    rol: role,
  };
};

export const normalizeAuthResponse = (payload: unknown): AuthSession => {
  if (!payload || typeof payload !== "object") {
    throw new Error("No se recibieron datos válidos del servidor.");
  }
  const source = payload as Record<string, unknown>;
  const accessToken =
    (source.accessToken as string) ??
    (source.token as string) ??
    (source.access_token as string) ??
    (source.data as Record<string, unknown> | undefined)?.accessToken;
  const refreshToken =
    (source.refreshToken as string) ??
    (source.refresh_token as string) ??
    (source.data as Record<string, unknown> | undefined)?.refreshToken;

  if (!accessToken) {
    throw new Error("No se recibieron tokens válidos del servidor.");
  }

  const rawUser =
    source.usuario ??
    source.user ??
    (source.data as Record<string, unknown> | undefined)?.usuario ??
    source;
  const user = resolveUser(rawUser);

  return {
    accessToken,
    refreshToken,
    user,
  };
};

export const getErrorMessage = (error: unknown) => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null) {
    const maybeAxios = error as { response?: { data?: any }; message?: string };
    const backendMessage =
      maybeAxios.response?.data?.message ??
      maybeAxios.response?.data?.error ??
      maybeAxios.message;
    if (backendMessage) return backendMessage;
  }
  return 'Ocurrió un error inesperado. Intenta nuevamente.';
};
