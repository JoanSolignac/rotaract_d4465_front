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

const parseMetrics = (payload) => {
  if (!payload) {
    return {};
  }

  const source = payload?.data ?? payload;

  return {
    clubs: source?.clubs ?? source?.clubCount ?? source?.totalClubs ?? null,
    members: source?.members ?? source?.memberCount ?? source?.totalMembers ?? null,
    projects: source?.projects ?? source?.projectCount ?? source?.totalProjects ?? null,
  };
};

export const fetchHomeSnapshot = async () => {
  const results = await Promise.allSettled([
    httpClient.get(API_ENDPOINTS.clubs),
    httpClient.get(API_ENDPOINTS.events),
    httpClient.get(API_ENDPOINTS.metrics).catch((error) => {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      throw error;
    }),
  ]);

  const [clubsResult, eventsResult, metricsResult] = results;

  const clubs = clubsResult.status === 'fulfilled' ? toArray(clubsResult.value) : [];
  const events = eventsResult.status === 'fulfilled' ? toArray(eventsResult.value) : [];
  const metrics = metricsResult.status === 'fulfilled' ? parseMetrics(metricsResult.value) : {};

  const failedResources = [];

  if (clubsResult.status === 'rejected') {
    failedResources.push('los clubes');
  }

  if (eventsResult.status === 'rejected') {
    failedResources.push('los eventos');
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
    events,
    metrics,
    error: errorMessage,
  };
};
