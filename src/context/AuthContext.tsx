'use client';

import React, { createContext, useContext, useEffect, useCallback, useState } from 'react';
import { api } from '../api/axios.config'; // Используем ваш настроенный API
import { User } from '../types/user'; // Путь к вашему типу User

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: any;
  refetchUser: () => void; // Функция для принудительной перезагрузки данных пользователя
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Кастомный хук для получения данных пользователя
export function useUserAuthFetch() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [nonce, setNonce] = useState(0); // Для принудительного перезапуска fetchUser

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<User>('/auth/me'); // Запрос к вашей конечной точке /auth/me
      setUser(response.data);
    } catch (err: any) {
      console.error('Ошибка при загрузке данных пользователя:', err);
      setUser(null);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [nonce]); // Зависимость от nonce позволяет принудительно перезапускать fetch

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const refetch = useCallback(() => {
    setNonce(prev => prev + 1); // Увеличиваем nonce для повторного вызова fetchUser
  }, []);

  return { user, isLoading, error, refetch };
}


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, error, refetch } = useUserAuthFetch(); // Используем новый хук

  const refetchUser = useCallback(() => {
    refetch();
  }, [refetch]);

  const value = { user, isLoading, error, refetchUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};