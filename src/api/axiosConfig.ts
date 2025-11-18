import axios, { AxiosError } from "axios";
import type { AuthTokens } from "../types/auth";

export const BASE_URL = "https://rotaractd4465api.up.railway.app/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

type ConfigureOptions = {
  getTokens: () => AuthTokens | null;
  onLogout: () => void;
};

let isConfigured = false;

export const configureAxiosInterceptors = ({ getTokens, onLogout }: ConfigureOptions) => {
  if (isConfigured) return;
  isConfigured = true;

  api.interceptors.request.use((config) => {
    const tokens = getTokens();
    if (tokens?.accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        onLogout();
      }
      return Promise.reject(error);
    },
  );
};
