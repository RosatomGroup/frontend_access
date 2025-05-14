'use client';

import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuth = !!token;

    if (!isAuth && pathname !== '/login') {
      router.push('/login');
    } else {
      setAuthChecked(true);
    }
  }, [router, pathname]);

  if (!authChecked) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;

