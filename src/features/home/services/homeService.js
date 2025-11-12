import { API_ENDPOINTS } from '../../../services/api/endpoints.js';
import { ApiError, httpClient } from '../../../services/api/httpClient.js';

const toArray = (payload) => {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.content)) {
    return payload.content;
  }

  return [];
};

const toNumberOrNull = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
};

const parseMetrics = (payload) => {
  if (!payload) {
    return {};
  }

  const source = payload?.data ?? payload;

  return {
    clubs:
      toNumberOrNull(source?.clubs) ??
      toNumberOrNull(source?.clubCount) ??
      toNumberOrNull(source?.totalClubs) ??
      null,
    members:
      toNumberOrNull(source?.members) ??
      toNumberOrNull(source?.memberCount) ??
      toNumberOrNull(source?.totalMembers) ??
      null,
    projects:
      toNumberOrNull(source?.projects) ??
      toNumberOrNull(source?.projectCount) ??
      toNumberOrNull(source?.totalProjects) ??
      null,
  };
};

const fetchDistrictClubs = () =>
  httpClient.get(API_ENDPOINTS.clubsPublic).catch((error) => {
    if (error instanceof ApiError && error.status === 404 && API_ENDPOINTS.clubs) {
      return httpClient.get(API_ENDPOINTS.clubs);
    }

    throw error;
  });

const fetchDistrictConvocatorias = () =>
  httpClient.get(API_ENDPOINTS.convocatoriasPublic).catch((error) => {
    if (error instanceof ApiError && error.status === 404 && API_ENDPOINTS.convocatorias) {
      return httpClient.get(API_ENDPOINTS.convocatorias);
    }

    throw error;
  });

export const fetchHomeSnapshot = async () => {
  const results = await Promise.allSettled([
    fetchDistrictClubs(),
    fetchDistrictConvocatorias(),
    httpClient.get(API_ENDPOINTS.metrics).catch((error) => {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      throw error;
    }),
  ]);

  const [clubsResult, convocatoriasResult, metricsResult] = results;

  const clubs = clubsResult.status === 'fulfilled' ? toArray(clubsResult.value) : [];
  const convocatorias =
    convocatoriasResult.status === 'fulfilled' ? toArray(convocatoriasResult.value) : [];
  const metrics = metricsResult.status === 'fulfilled' ? parseMetrics(metricsResult.value) : {};

  const failedResources = [];

  if (clubsResult.status === 'rejected') {
    failedResources.push('los clubes');
  }

  if (convocatoriasResult.status === 'rejected') {
    failedResources.push('las convocatorias');
  }

  if (metricsResult.status === 'rejected') {
    failedResources.push('las métricas distritales');
  }

  const errorMessage =
    failedResources.length > 0
      ? `No pudimos cargar ${failedResources.join(' y ')} en tiempo real. Te mostramos información referencial.`
      : null;

  return {
    clubs,
    convocatorias,
    metrics,
    error: errorMessage,
  };
};

export const fetchConvocatoriaById = async (id) => {
  if (!id) {
    throw new Error('Identificador de convocatoria inválido.');
  }

  const response = await httpClient.get(`${API_ENDPOINTS.convocatoriasPublic}${id}`);
  const source = response?.data ?? response;

  return normaliseConvocatoria(source);
};

export const fetchClubById = async (id) => {
  if (!id) {
    throw new Error('Identificador de club inválido.');
  }

  const response = await httpClient.get(`${API_ENDPOINTS.clubsPublic}${id}`);
  const source = response?.data ?? response;

  return normaliseClub(source);
};

export const normaliseConvocatoria = (convocatoria = {}) => {
  const date =
    convocatoria?.fechaInicio ??
    convocatoria?.startDate ??
    convocatoria?.date ??
    convocatoria?.fecha ??
    null;

  const closingDate =
    convocatoria?.fechaFin ??
    convocatoria?.endDate ??
    convocatoria?.closingDate ??
    convocatoria?.fecha_cierre ??
    null;

  const clubName = convocatoria?.nombreClub ?? convocatoria?.club ?? null;
  const requirements = convocatoria?.requisitos ?? convocatoria?.requisito ?? null;
  const description =
    convocatoria?.titulo ??
    convocatoria?.name ??
    convocatoria?.title ??
    convocatoria?.nombre ??
    'Convocatoria distrital';
  const summary =
    convocatoria?.descripcion ??
    convocatoria?.summary ??
    convocatoria?.description ??
    convocatoria?.detalle ??
    convocatoria?.body ??
    'Revisa los requisitos y súmate a la experiencia Rotaract.';

  const location =
    convocatoria?.lugar ??
    convocatoria?.location ??
    convocatoria?.city ??
    convocatoria?.ubicacion ??
    convocatoria?.modalidad ??
    'Por confirmar';

  const projectUrl =
    convocatoria?.url ??
    convocatoria?.link ??
    convocatoria?.enlace ??
    convocatoria?.form ??
    convocatoria?.formulario ??
    null;

  const isActive =
    typeof convocatoria?.activo === 'boolean'
      ? convocatoria.activo
      : typeof convocatoria?.active === 'boolean'
        ? convocatoria.active
        : null;

  return {
    id: convocatoria?.id ?? convocatoria?.uuid ?? convocatoria?.slug ?? description,
    name: description,
    summary,
    location,
    date,
    closingDate,
    url: projectUrl,
    clubName,
    requirements,
    isActive,
  };
};

export const normaliseClub = (club = {}) => {
  const department = club?.departamento ?? club?.department ?? null;
  const city = club?.city ?? club?.ciudad ?? club?.district ?? null;
  const foundedAt = club?.fechaCreacion ?? club?.fecha_creacion ?? club?.foundedAt ?? null;
  const isActive =
    typeof club?.activo === 'boolean'
      ? club.activo
      : typeof club?.active === 'boolean'
        ? club.active
        : null;

  return {
    id: club?.id ?? club?.uuid ?? club?.slug ?? club?.name,
    name: club?.name ?? club?.nombre ?? 'Rotaract Club',
    city: city ?? department ?? 'Distrito 4465',
    department,
    foundedAt,
    isActive,
    speciality:
      club?.focus ??
      club?.speciality ??
      club?.especialidad ??
      (department ? `Departamento: ${department}` : 'Servicio integral'),
    email: club?.email ?? club?.contactEmail ?? club?.correo ?? null,
    phone: club?.phone ?? club?.contactPhone ?? club?.telefono ?? null,
    president:
      club?.president ??
      club?.presidente ??
      club?.board?.president ??
      club?.lider ??
      null,
  };
};

export const fetchPublicConvocatorias = async () => {
  const response = await fetchDistrictConvocatorias();
  return toArray(response).map((item) => normaliseConvocatoria(item));
};

export const fetchPublicClubs = async () => {
  const response = await fetchDistrictClubs();
  return toArray(response).map((club) => normaliseClub(club));
};
