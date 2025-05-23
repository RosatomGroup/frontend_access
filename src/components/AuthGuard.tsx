'use client';

import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:3001/auth/me', {
          withCredentials: true,
        });
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

