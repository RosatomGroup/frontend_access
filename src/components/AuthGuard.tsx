'use client';

import {usePathname, useRouter} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {api} from "@/api/axios.config";

interface AuthGuardProps {
    children: (user: any) => React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({children}) => {
    const pathname = usePathname();
    const router = useRouter();
    const [authChecked, setAuthChecked] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get('/auth/me');
                setCurrentUser(res.data);
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
        return null; // Или индикатор загрузки
    }
    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {currentUser});
        }
        return child;
    });

    return <>{childrenWithProps}</>;
};

export default AuthGuard;