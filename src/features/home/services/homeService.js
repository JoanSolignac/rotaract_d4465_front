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

export const fetchHomeSnapshot = async () => {
  const results = await Promise.allSettled([
    httpClient.get(API_ENDPOINTS.clubs),
    httpClient.get(API_ENDPOINTS.convocatorias),
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

export const normaliseConvocatoria = (convocatoria) => ({
  id: convocatoria?.id ?? convocatoria?.uuid ?? convocatoria?.slug ?? convocatoria?.name,
  name:
    convocatoria?.name ??
    convocatoria?.title ??
    convocatoria?.titulo ??
    convocatoria?.convocatoria ??
    'Convocatoria distrital',
  summary:
    convocatoria?.summary ??
    convocatoria?.description ??
    convocatoria?.descripcion ??
    convocatoria?.detalle ??
    'Revisa los requisitos y súmate a la experiencia Rotaract.',
  location:
    convocatoria?.location ??
    convocatoria?.city ??
    convocatoria?.ubicacion ??
    convocatoria?.modalidad ??
    'Por confirmar',
  date:
    convocatoria?.date ??
    convocatoria?.startDate ??
    convocatoria?.fechaInicio ??
    convocatoria?.fecha_inicio ??
    convocatoria?.fecha ??
    'Próximamente',
  closingDate:
    convocatoria?.closingDate ??
    convocatoria?.deadline ??
    convocatoria?.fechaCierre ??
    convocatoria?.fecha_cierre ??
    null,
  url:
    convocatoria?.url ??
    convocatoria?.link ??
    convocatoria?.enlace ??
    convocatoria?.form ??
    convocatoria?.formulario ??
    null,
});

export const normaliseClub = (club) => ({
  id: club?.id ?? club?.uuid ?? club?.slug ?? club?.name,
  name: club?.name ?? club?.nombre ?? 'Rotaract Club',
  city: club?.city ?? club?.district ?? club?.ciudad ?? 'Perú',
  speciality: club?.focus ?? club?.speciality ?? club?.especialidad ?? 'Servicio integral',
  email: club?.email ?? club?.contactEmail ?? club?.correo ?? null,
  phone: club?.phone ?? club?.contactPhone ?? club?.telefono ?? null,
  president:
    club?.president ??
    club?.presidente ??
    club?.board?.president ??
    club?.lider ??
    null,
});
