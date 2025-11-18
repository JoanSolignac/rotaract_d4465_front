import { AxiosError } from "axios";

export const parseApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const responseMessage =
      (error.response?.data as { message?: string })?.message;
    if (responseMessage) return responseMessage;
    if (error.message) return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocurrió un error inesperado. Inténtalo nuevamente.";
};

