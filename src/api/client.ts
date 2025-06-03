// src/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем интерцептор для обработки ошибок
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Обработка ошибок HTTP
      const { status, data } = error.response;
      
      if (status === 401) {
        // Перенаправление на страницу входа или обновление токена
        console.error('Не авторизован');
      } else if (status === 403) {
        console.error('Доступ запрещен');
      } else if (status === 404) {
        console.error('Ресурс не найден');
      } else if (status >= 500) {
        console.error('Ошибка сервера');
      }
      
      return Promise.reject({
        status,
        message: data.message || 'Произошла ошибка',
      });
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен
      console.error('Не удалось получить ответ от сервера');
      return Promise.reject({
        status: null,
        message: 'Не удалось получить ответ от сервера',
      });
    } else {
      // Произошла ошибка при настройке запроса
      console.error('Ошибка настройки запроса', error.message);
      return Promise.reject({
        status: null,
        message: 'Ошибка настройки запроса',
      });
    }
  }
);

export default apiClient;