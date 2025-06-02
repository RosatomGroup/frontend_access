'use client';

import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import { useUser } from '../hooks/AppGuardUserAdmin';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, error } = useUser();

  useEffect(() => {
    // Если пользователь загружается, ничего не делаем пока
    if (isLoading) {
      return;
    }

    // Если нет пользователя (или есть ошибка, указывающая на неавторизованность)
    // и текущий путь не /login, перенаправляем на /login
    if (!user) {
      console.warn('Пользователь не авторизован или произошла ошибка загрузки.');
      if (pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [isLoading, user, pathname, router]);

  // Пока данные загружаются, или если пользователь не авторизован,
  // и мы находимся не на странице входа, ничего не рендерим.
  // Это предотвращает мигание контента до проверки аутентификации.
  if (isLoading || (!user && pathname !== '/login')) {
    return null; // Или можно показать какой-то лоадер
  }
  // Если пользователь авторизован, или если мы на странице логина (даже если user === null)
  // рендерим дочерние элементы.
  return <>{children}</>;
};

export default AuthGuard;
