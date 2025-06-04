import { useState, useCallback } from 'react';
import { notification } from 'antd'; // Импортируем notification из antd
import { useRouter } from 'next/navigation'; // Импортируем useRouter из Next.js
import axios, { AxiosError, AxiosResponse } from 'axios'; // Импортируем axios, AxiosError, AxiosResponse
import api from '@/api/axios.config'; // Импортируем настроенный инстанс axios

export function useAuthFetch() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();

    const fetchWithAuth = useCallback(async <T>(url: string, options?: object): Promise<T> => { // options теперь object, так как RequestInit для fetch
        setIsLoading(true);
        setError(null);

        try {
            // Используем настроенный инстанс Axios для GET запросов
            const response: AxiosResponse<T> = await api.get<T>(url, options);
            return response.data;
        } catch (err) {
            // Ловим ошибки Axios
            const error = err instanceof AxiosError ? err : new Error('Unknown error');
            setError(error);
            
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                notification.error({
                    message: 'Сессия истекла',
                    description: 'Пожалуйста, войдите снова',
                });
                router.push('/login');
            }
            throw error; // Перебрасываем ошибку для обработки в вызывающем коде
        } finally {
            setIsLoading(false); // Всегда сбрасываем состояние загрузки
        }
    }, [router]); // Зависимость от router

    const postWithAuth = useCallback(async <T, D>(url: string, data: D, options?: object): Promise<T> => {
        setIsLoading(true);
        setError(null);

        try {
            // Используем настроенный инстанс Axios для POST запросов
            const response: AxiosResponse<T> = await api.post<T>(url, data, options);
            return response.data;
        } catch (err) {
            const error = err instanceof AxiosError ? err : new Error('Unknown error');
            setError(error);

            if (axios.isAxiosError(error) && error.response?.status === 401) {
                notification.error({
                    message: 'Сессия истекла',
                    description: 'Пожалуйста, войдите снова',
                });
                router.push('/login');
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    // Вы можете добавить другие методы (put, patch, delete) по аналогии
    // const putWithAuth = useCallback(async <T, D>(url: string, data: D, options?: object): Promise<T> => { /* ... */ }, [router]);
    // const patchWithAuth = useCallback(async <T, D>(url: string, data: D, options?: object): Promise<T> => { /* ... */ }, [router]);
    // const deleteWithAuth = useCallback(async <T>(url: string, options?: object): Promise<T> => { /* ... */ }, [router]);

    return { fetchWithAuth, postWithAuth, isLoading, error }; // Возвращаем функции и состояния
}
