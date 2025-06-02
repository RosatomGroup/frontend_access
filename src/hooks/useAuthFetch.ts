// src/hooks/useAuthFetch.ts
// import { useState, useCallback } from 'react';
// import { notification } from 'antd';
// import { useRouter } from 'next/navigation';

// export function useAuthFetch() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<Error | null>(null);
//   const router = useRouter();

//   const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}) => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const response = await fetch(url, {
//         ...options,
//         credentials: 'include',
//         headers: {
//           ...options.headers,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.status === 401) {
//         notification.error({
//           message: 'Сессия истекла',
//           description: 'Пожалуйста, войдите снова',
//         });
//         router.push('/login');
//         throw new Error('Unauthorized');
//       }

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Request failed');
//       }

//       return await response.json();
//     } catch (err) {
//       setError(err instanceof Error ? err : new Error('Unknown error'));
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   }, [router]);

//   return { fetchWithAuth, isLoading, error };
// }

import { useState, useCallback } from 'react';
import { notification } from 'antd';
import { useRouter } from 'next/navigation';

export function useAuthFetch() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Making request to: ${url}`, options);
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
        },
      });

      console.log('Received response:', response);

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Response data:', data);
          return data;
        }
        return null;
      }

      let errorData;
      try {
        errorData = await response.json();
      } catch (jsonError) {
        errorData = {
          message: response.statusText || 'Request failed',
          statusCode: response.status
        };
      }

      console.error('Request failed with error:', errorData);

      if (response.status === 401) {
        notification.error({
          message: 'Session expired',
          description: 'Please login again',
        });
        router.push('/login');
      }

      const errorMessage = errorData.message || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('Error in fetchWithAuth:', error);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return { fetchWithAuth, isLoading, error };
}