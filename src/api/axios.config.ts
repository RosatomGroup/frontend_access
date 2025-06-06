import axios, { AxiosError, AxiosResponse } from 'axios';

interface ErrorResponse {
  message?: string;
  [key: string]: unknown;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001',
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        return Promise.reject({
          status,
          message: 'Не авторизован',
        });
      }
      // 403 — доступ запрещён
      if (status === 403) {
        console.error('Доступ запрещён');
      }
      // 404 — не найдено
      if (status === 404) {
        console.error('Ресурс не найден');
        return Promise.reject({
          status,
          message: 'Ресурс не найден',
        });
      }
      // 5xx — серверная ошибка
      if (status >= 500) {
        console.error('Ошибка сервера');
        return Promise.reject({
          status,
          message: data?.message || 'Ошибка сервера',
        });
      }
      return Promise.reject({
        status,
        message: data?.message || 'Произошла ошибка',
      });
    }

    if (error.request) {
      console.error('Не удалось получить ответ от сервера');
      return Promise.reject({
        status: null,
        message: 'Не удалось получить ответ от сервера',
      });
    }

    console.error('Ошибка настройки запроса', error.message);
    return Promise.reject({
      status: null,
      message: error.message || 'Ошибка настройки запроса',
    });
  },
);

export default api;

