import { UserRole, USER_ROLES } from '../types';

export const ROLE_ROUTES: Record<UserRole, string> = {
  INTERESADO: '/dashboard/interesado',
  SOCIO: '/dashboard/socio',
  'PRESIDENTE DEL CLUB': '/dashboard/presidente',
  'REPRESENTANTE DISTRITAL': '/dashboard/representante',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  INTERESADO: 'Interesado',
  SOCIO: 'Socio',
  'PRESIDENTE DEL CLUB': 'Presidente del Club',
  'REPRESENTANTE DISTRITAL': 'Representante Distrital',
};

export const isValidRole = (role?: string): role is UserRole => {
  if (!role) return false;
  return USER_ROLES.includes(role.toUpperCase() as UserRole);
};

export const getDashboardRoute = (role?: UserRole | null) => {
  if (!role) return '/login';
  return ROLE_ROUTES[role];
};
