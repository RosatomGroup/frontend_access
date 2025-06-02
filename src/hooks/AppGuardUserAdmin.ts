import { useEffect, useState } from 'react';
import axios from 'axios';

// Расширенный интерфейс User, соответствующий данным схемы призма на бекенд
interface User {
  id: number;
  email: string;
  name: string | null;
  surname: string | null;
  middleName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  birthDate: string | null; 
  subdivision: string | null;
  rang: string | null;
  serviceNumber?: number;
  accessLevel: string;
  roleId: number | null;
  role: {
    id: number;
    name: string;
    description: string;
    resourceId: number;
  } | null;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get<User>('http://localhost:3001/auth/me', {
          withCredentials: true,
        });

        if (res.status === 200) {
          setUser(res.data);
        } else {
          setUser(null);
          throw new Error('Not authorized');
        }
      } catch (err) {
        console.error('Ошибка в useUser:', err);
        setUser(null);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, isLoading, error };
}
