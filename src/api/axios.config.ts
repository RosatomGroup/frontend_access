// src/api/client.ts

import axios, {AxiosError} from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
    timeout: 5000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        if (error.response) {
            const {status, data} = error.response;
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
                    message: data && typeof data === 'object' && 'message' in data
                        ? (data as any).message
                        : 'Ошибка сервера',
                });
            }
            return Promise.reject({
                status,
                message: data && typeof data === 'object' && 'message' in data
                    ? (data as any).message
                    : 'Произошла ошибка',
            });
        } else if (error.request) {
            console.error('Не удалось получить ответ от сервера');
            return Promise.reject({
                status: null,
                message: 'Не удалось получить ответ от сервера',
            });
        } else {
            console.error('Ошибка настройки запроса', error.message);
            return Promise.reject({
                status: null,
                message: error.message || 'Ошибка настройки запроса',
            });
        }
    }
);

export default api;
