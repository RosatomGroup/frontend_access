'use client';

import React, { createContext, useContext, useEffect, useCallback, useState } from 'react';
import  api  from '../api/axios.config';
import { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useUserAuthFetch() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [nonce, setNonce] = useState(0);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<User>('/auth/me');
      setUser(response.data);
    } catch (err) {
      console.error('Ошибка при загрузке данных пользователя:', err);
      setUser(null);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []); // Зависимость от nonce позволяет принудительно перезапускать fetch (удалила nonce)

  useEffect(() => {
    fetchUser();
  }, [fetchUser, nonce]); //добавила nonce

  const refetch = useCallback(() => {
    setNonce((prev) => prev + 1);
  }, []);

  return { user, isLoading, error, refetch };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, error, refetch } = useUserAuthFetch();

  const refetchUser = useCallback(() => {
    refetch();
  }, [refetch]);

  const value = { user, isLoading, error, refetchUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

