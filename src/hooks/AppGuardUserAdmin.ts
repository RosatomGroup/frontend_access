import { useEffect, useState } from 'react';

interface UserData {
    id: number;
    email: string;
    name: string;
    surname: string;
    middleName: string | null;
    accessLevel: 'ADMIN' | 'USER';
    phone: string | null;
    avatarUrl: string;
    birthDate: string | null;
    subdivision: string;
    rang: string;
}

export function useUser(): UserData | null {
    const [user, setUser] = useState<UserData | null>(null);

    useEffect(() => {
        fetch('http://localhost:3001/auth/me', {
            credentials: 'include',
        })
            .then((res) => {
                if (!res.ok) throw new Error('Not authorized');
                return res.json();
            })
            .then((data: UserData) => {
                setUser(data);
            })
            .catch(() => setUser(null));
    }, []);

    return user;
}
