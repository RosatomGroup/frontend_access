'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '@/api/axios.config';

export interface UserData {
  id: number;
  email: string;
  name: string;
  surname: string;
  middleName: string | null;
  accessLevel: string;
  phone: string | null;
  avatarUrl: string;
  birthDate: string | null;
  subdivision: string;
  rang: string;
}

interface UserContextValue {
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  isLoading: true,
  error: null,
  refresh: async () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<UserData>('/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error(err);
      setUser(null);
      setError('Ошибка загрузки пользователя');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ user, isLoading, error, refresh: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  return useContext(UserContext);
}

