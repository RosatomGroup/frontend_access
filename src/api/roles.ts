import axios from 'axios';

export interface Role {
    key: number;
    name: string;
    description: string;
    system: string;
    owner: string;
}

const api = axios.create({
    baseURL: 'http://localhost:3001',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const fetchRoles = async (): Promise<Role[]> => {
    try {
        const response = await api.get('/roles/management');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.message);
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);

                if (error.response.status === 401) {
                    window.location.href = '/login';
                }
            }
        } else {
            console.error('Unexpected error:', error);
        }
        return [];
    }
};