import { API_BASE_URL } from './endpoints.js';

export class ApiError extends Error {
  constructor(message, { status, data, cause } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    if (cause) {
      this.cause = cause;
    }
  }
}

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token ?? null;
};

const buildUrl = (path, params) => {
  const trimmedBase = API_BASE_URL.replace(/\/$/, '');
  const finalPath = path?.startsWith('http')
    ? path
    : `${trimmedBase}${path?.startsWith('/') ? '' : '/'}${path ?? ''}`;

  const url = new URL(finalPath);

  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return;
      }
      url.searchParams.append(key, value);
    });
  }

  return url.toString();
};

const parseResponseBody = async (response) => {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  if (contentType.startsWith('text/')) {
    try {
      return await response.text();
    } catch (error) {
      return null;
    }
  }

  return null;
};

const request = async (path, { method = 'GET', data, params, headers, signal } = {}) => {
  const endpoint = buildUrl(path, params);
  const payload =
    data === undefined || data === null
      ? undefined
      : typeof data === 'string'
        ? data
        : JSON.stringify(data);

  const finalHeaders = {
    Accept: 'application/json',
    ...(payload ? { 'Content-Type': 'application/json' } : {}),
    ...headers,
  };

  if (authToken) {
    finalHeaders.Authorization = `Bearer ${authToken}`;
  }

  let response;

  try {
    response = await fetch(endpoint, {
      method,
      headers: finalHeaders,
      body: payload,
      signal,
    });
  } catch (networkError) {
    throw new ApiError('No fue posible conectar con el servicio. Revisa tu conexión e inténtalo nuevamente.', {
      cause: networkError,
    });
  }

  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    const message =
      responseBody?.message ||
      responseBody?.error ||
      `La solicitud falló con el código ${response.status}.`;

    throw new ApiError(message, {
      status: response.status,
      data: responseBody,
    });
  }

  return responseBody;
};

export const httpClient = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, data, options) => request(path, { ...options, method: 'POST', data }),
  put: (path, data, options) => request(path, { ...options, method: 'PUT', data }),
  patch: (path, data, options) => request(path, { ...options, method: 'PATCH', data }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};
