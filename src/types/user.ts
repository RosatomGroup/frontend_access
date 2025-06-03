export interface User {
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
  
