// src/hooks/useAuthFetch.ts
import { useState, useCallback } from 'react';
import { notification } from 'antd';
import { useRouter } from 'next/navigation';

export function useAuthFetch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        notification.error({
          message: 'Сессия истекла',
          description: 'Пожалуйста, войдите снова',
        });
        router.push('/login');
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Request failed');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return { fetchWithAuth, isLoading, error };
}