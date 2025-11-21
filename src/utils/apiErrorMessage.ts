import axios from "axios";

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Ocurrió un error. Intenta nuevamente.",
): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as {
      errors?: unknown;
      message?: unknown;
      status?: unknown;
      timestamp?: unknown;
    };

    const errorList =
      Array.isArray(data?.errors) && data?.errors.length > 0
        ? data.errors
        : undefined;
    const firstError =
      errorList && typeof errorList[0] === "string"
        ? errorList[0]
        : Array.isArray(errorList) && errorList.length > 0
          ? String(errorList[0])
          : null;

    const message =
      typeof data?.message === "string"
        ? data.message
        : data?.message
          ? String(data.message)
          : null;

    if (firstError) return firstError;
    if (message) return message;
    if (error.response?.statusText) return error.response.statusText;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
};
