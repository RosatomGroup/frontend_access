import { useEffect, useState } from 'react';

export function useUser() {
  const [user, setUser] = useState<{ accessLevel: string } | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/auth/me', {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Not authorized');
        return res.json();
      })
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  return user;
}

