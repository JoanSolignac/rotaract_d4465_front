import { api } from "./axiosConfig";
import type { AuthResponse } from "../types/auth";

export interface LoginPayload {
  correo: string;
  contrasena: string;
}

export interface RegisterPayload {
  nombre: string;
  correo: string;
  contrasena: string;
  ciudad: string;
  fechaNacimiento: string;
}

export const loginRequest = async (payload: LoginPayload) => {
  const response = await api.post<AuthResponse>("/auth/login", payload);
  return response.data;
};

export const registerRequest = async (payload: RegisterPayload) => {
  const response = await api.post<AuthResponse>("/auth/register", payload);
  return response.data;
};
