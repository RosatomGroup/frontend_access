'use client';

import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);

    if (!authStatus && pathname !== '/login') {
      router.push('/login');
    }
  }, [router, pathname]);

  if (!isAuthenticated && pathname !== '/login') {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
