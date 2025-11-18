import { api } from "./axiosConfig";

export interface Convocatoria {
  id: number;
  titulo: string;
  descripcion: string;
  requisitos: string;
  cupoMaximo: number;
  fechaPublicacion: string;
  fechaCierre: string;
  fechaInicioPostulacion: string;
  fechaFinPostulacion: string;
  clubId: number;
  clubNombre: string;
  estado: string;
}

export interface ConvocatoriaInscripcion {
  id: number;
  usuarioId: number;
  usuarioNombre: string;
  usuarioCorreo: string;
  tipo: string;
  referenciaId: number;
  referenciaTitulo: string;
  estado: string;
  fechaRegistro: string;
}

export interface FetchPaginatedParams {
  page?: number;
  size?: number;
}

export interface CreateConvocatoriaPayload {
  titulo: string;
  descripcion: string;
  cupoMaximo: number;
  fechaPublicacion: string;
  fechaCierre: string;
  fechaInicioPostulacion: string;
  fechaFinPostulacion: string;
  requisitos: string;
}

export interface UpdateConvocatoriaPayload {
  titulo: string;
  descripcion: string;
  cupoMaximo: number;
  fechaCierre: string;
  fechaInicioPostulacion: string;
  fechaFinPostulacion: string;
  requisitos: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

type RawPaginated<T> = {
  [key: string]: unknown;
  content?: T[];
  items?: T[];
  data?: T[];
  results?: T[];
  registros?: T[];
  total?: number;
  totalItems?: number;
  totalElements?: number;
  totalRegistros?: number;
  totalPages?: number;
  paginas?: number;
  page?: number;
  pageNumber?: number;
  currentPage?: number;
  size?: number;
  pageSize?: number;
};

const extractItems = <T>(payload: RawPaginated<T> | T[]): T[] => {
  if (Array.isArray(payload)) return payload;
  return (
    payload.content ??
    payload.items ??
    payload.data ??
    payload.results ??
    payload.registros ??
    []
  );
};

const extractNumber = (payload: RawPaginated<unknown>, keys: string[], fallback: number): number => {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "number" && !Number.isNaN(value)) {
      return value;
    }
  }
  return fallback;
};

const buildPaginatedResult = <T>(
  payload: RawPaginated<T> | T[],
  params?: FetchPaginatedParams,
): PaginatedResult<T> => {
  const list = extractItems(payload);
  const total =
    !Array.isArray(payload) && typeof payload === "object"
      ? extractNumber(payload as RawPaginated<unknown>, ["totalElements", "totalItems", "total", "totalRegistros"], list.length)
      : list.length;

  const resolved = Array.isArray(payload)
    ? { page: params?.page ?? 0, size: params?.size ?? list.length }
    : payload;

  const page = extractNumber(resolved as RawPaginated<unknown>, ["page", "pageNumber", "currentPage"], params?.page ?? 0);
  const pageSize = extractNumber(resolved as RawPaginated<unknown>, ["size", "pageSize"], params?.size ?? list.length);
  const totalPages =
    !Array.isArray(payload) && typeof payload === "object"
      ? extractNumber(payload as RawPaginated<unknown>, ["totalPages", "paginas"], Math.max(1, Math.ceil(total / Math.max(pageSize, 1))))
      : Math.max(1, Math.ceil(total / Math.max(pageSize, 1)));

  return {
    items: list,
    total,
    page,
    pageSize,
    totalPages: totalPages || 1,
  };
};

const requestConvocatorias = async (
  endpoint: string,
  params?: FetchPaginatedParams,
) => {
  const response = await api.get<RawPaginated<Convocatoria> | Convocatoria[]>(endpoint, {
    params,
  });
  return buildPaginatedResult<Convocatoria>(response.data, params);
};

export const fetchPublicConvocatorias = (params?: FetchPaginatedParams) =>
  requestConvocatorias("/convocatorias/public", params);

export const fetchClubConvocatorias = (params?: FetchPaginatedParams) =>
  requestConvocatorias("/convocatorias", params);

export const fetchConvocatoriaInscripciones = async (
  convocatoriaId: number,
  params?: FetchPaginatedParams,
) => {
  const response = await api.get<RawPaginated<ConvocatoriaInscripcion> | ConvocatoriaInscripcion[]>(
    `/convocatorias/${convocatoriaId}/inscripciones`,
    { params },
  );

  return buildPaginatedResult<ConvocatoriaInscripcion>(response.data, params);
};

export const createConvocatoria = async (payload: CreateConvocatoriaPayload) => {
  const response = await api.post<Convocatoria>("/convocatorias", payload);
  return response.data;
};

export const updateConvocatoria = async (
  convocatoriaId: number,
  payload: UpdateConvocatoriaPayload,
) => {
  const response = await api.patch<Convocatoria>(
    `/convocatorias/${convocatoriaId}`,
    payload,
  );
  return response.data;
};

export const inscribirseConvocatoria = async (convocatoriaId: number) => {
  const response = await api.post(`/convocatorias/${convocatoriaId}/inscribirse`);
  return response.data;
};

export const aceptarInscripcion = async (
  convocatoriaId: number,
  inscripcionId: number,
) => {
  const response = await api.post(
    `/convocatorias/${convocatoriaId}/inscripciones/${inscripcionId}/aceptar`,
  );
  return response.data;
};

export const rechazarInscripcion = async (
  convocatoriaId: number,
  inscripcionId: number,
) => {
  const response = await api.post(
    `/convocatorias/${convocatoriaId}/inscripciones/${inscripcionId}/rechazar`,
  );
  return response.data;
};
