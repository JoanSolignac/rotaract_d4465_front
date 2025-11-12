import { API_ENDPOINTS } from '../../../services/api/endpoints.js';
import { ApiError, httpClient } from '../../../services/api/httpClient.js';

const normaliseString = (value) => (typeof value === 'string' ? value.trim() : value);

const ensureCredentials = (credentials = {}) => {
  const correo = normaliseString(credentials.correo ?? credentials.email);
  const contrasena = credentials.contrasena ?? credentials.password;

  if (!correo || !contrasena) {
    throw new Error('Ingresa tu correo electrónico y contraseña para continuar.');
  }
};

export const login = async (credentials) => {
  ensureCredentials(credentials);

  try {
    const payload = {
      correo: normaliseString(credentials.correo ?? credentials.email),
      contrasena: credentials.contrasena ?? credentials.password,
    };

    return await httpClient.post(API_ENDPOINTS.auth.login, payload);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const register = async (payload) => {
  try {
    return await httpClient.post(API_ENDPOINTS.auth.register, payload);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const fetchProfile = async () => {
  try {
    return await httpClient.get(API_ENDPOINTS.auth.profile);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw error;
  }
};
