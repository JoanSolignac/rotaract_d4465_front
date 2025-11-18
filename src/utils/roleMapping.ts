import type { AuthUser, UserRole } from "../types/auth";

const roleDictionary: Record<string, UserRole> = {
  INTERESADO: "INTERESADO",
  SOCIO: "SOCIO",
  MIEMBRO: "SOCIO",
  "PRESIDENTE DEL CLUB": "PRESIDENTE DEL CLUB",
  PRESIDENTE: "PRESIDENTE DEL CLUB",
  "REPRESENTANTE DISTRITAL": "REPRESENTANTE DISTRITAL",
  REPRESENTANTE: "REPRESENTANTE DISTRITAL",
  DISTRITAL: "REPRESENTANTE DISTRITAL",
};

export const normalizeRole = (role?: string | null): UserRole => {
  if (!role) return "INTERESADO";
  const normalizedKey = role.trim().toUpperCase();
  // If a backend sends a non-supported role (e.g., INVITADO), fallback to INTERESADO without mapping it explicitly
  return roleDictionary[normalizedKey] ?? "INTERESADO";
};

export const normalizeUser = (user: AuthUser | (Omit<AuthUser, "rol"> & { rol: string })) => ({
  ...user,
  rol: normalizeRole(user.rol),
});

