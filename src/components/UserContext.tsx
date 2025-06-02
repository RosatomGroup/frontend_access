'use client';

import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {api} from '@/api/axios.config';

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
    refresh: () => void;
}

const UserContext = createContext<UserContextValue>({
    user: null,
    isLoading: true,
    error: null,
    refresh: () => {
    },
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = () => {
        setIsLoading(true);
        setError(null);
        api
            .get<UserData>('/auth/me')
            .then((res) => setUser(res.data))
            .catch((err) => {
                setUser(null);
                setError(err?.response?.data?.message || 'Ошибка загрузки пользователя');
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const contextValue = useMemo(
        () => ({
            user,
            isLoading,
            error,
            refresh: fetchUser,
        }),
        [user, isLoading, error]
    );

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export function useUser() {
    return useContext(UserContext);
}
