'use client';

import {usePathname, useRouter} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {api} from "@/api/axios.config";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const pathname = usePathname();
    const router = useRouter();
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await api('/auth/me');
                // console.log('User:', res.data);
                setAuthChecked(true);
            } catch (err) {
                console.warn('Не авторизован');
                if (pathname !== '/login') {
                    router.push('/login');
                }
            }
        };

        checkAuth();
    }, [pathname, router]);

    if (!authChecked) {
        return null;
    }

    return <>{children}</>;
};

export default AuthGuard;

