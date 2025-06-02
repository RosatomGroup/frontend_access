'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/components/UserContext';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoading } = useUser();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user && pathname !== '/login') {
            router.push('/login');
        }
    }, [isLoading, user, pathname, router]);

    if (isLoading) return null;

    if (!user && pathname !== '/login') return null;

    return <>{children}</>;
};

export default AuthGuard;
