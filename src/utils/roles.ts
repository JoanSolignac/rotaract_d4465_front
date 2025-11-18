import { roleRouteMap, type UserRole } from "../types/auth";

export const getDashboardPath = (role: UserRole) => roleRouteMap[role];

export const roleChipClasses: Record<UserRole, string> = {
  INTERESADO: "bg-primary/10 text-primary border-primary/30",
  SOCIO: "bg-secondary/10 text-secondary border-secondary/30",
  "PRESIDENTE DEL CLUB": "bg-accent/10 text-accent border-accent/30",
  "REPRESENTANTE DISTRITAL": "bg-primary-dark/10 text-primary-dark border-primary-dark/30",
};

