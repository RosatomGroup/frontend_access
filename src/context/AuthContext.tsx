
"use client"; // Этот директива необходима для компонентов, использующих клиентский API в Next.js App Router

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { api } from "@/api/axios.config"; // Путь к вашему настроенному axios инстансу
import { User } from '../types/user'; // Путь к вашему типу User
import axios, { AxiosError } from "axios";

// 2. Определяем интерфейс для состояния контекста
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Для отслеживания состояния загрузки пользователя
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
  // Добавьте fetchUser, если хотите иметь возможность принудительно обновить данные пользователя
  fetchUser: () => Promise<void>;
}

// 3. Создаем сам контекст
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Создаем провайдер контекста
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Начинаем в состоянии загрузки

  // Функция для получения данных пользователя
  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get<User>("/auth/me");
      setUser(response.data);
      console.log("Данные пользователя загружены:", response.data);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Ожидаемое 401: пользователь не авторизован или сессия истекла
        setUser(null);
        console.log("Пользователь не аутентифицирован (401).");
      } else {
        console.error("Ошибка при загрузке данных пользователя:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Эффект для первоначальной загрузки данных пользователя при монтировании
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Функция логина
  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean) => {
      setIsLoading(true);
      try {
        const response = await api.post("/auth/login", {
          email,
          password,
          rememberMe,
        });
        // Если логин успешен, данные пользователя обновятся при следующем fetchUser
        // или вы можете обновить их прямо здесь, если бэкенд возвращает полные данные пользователя.
        // Сейчас я предполагаю, что бэкенд при логине возвращает user, как в вашем AuthController
        setUser(response.data.user);
        console.log("Успешный вход:", response.data.message);
        // После логина, принудительно обновим пользователя (чтобы убедиться, что все куки установлены)
        await fetchUser();
      } catch (error: any) {
        console.error("Ошибка входа:", error);
        throw error; // Перебрасываем ошибку для обработки в UI
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUser]
  );

  // Функция логаута
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.post("/auth/logout");
      setUser(null);
      console.log("Выход выполнен.");
    } catch (error) {
      console.error("Ошибка выхода:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user, // true, если user не null
    isLoading,
    login,
    logout,
    fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 5. Хук для удобного использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};