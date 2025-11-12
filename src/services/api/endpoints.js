export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://rotaractd4465api.up.railway.app/api/v1';

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    profile: '/auth/me',
  },
  clubs: '/clubs',
  clubsPublic: '/clubs/public/',
  convocatorias: '/convocatorias',
  convocatoriasPublic: '/convocatorias/public/',
  metrics: '/metrics/district',
};

export const buildEndpoint = (path) => {
  const base = API_BASE_URL.replace(/\/$/, '');
  if (!path) {
    return base;
  }

  return path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};
