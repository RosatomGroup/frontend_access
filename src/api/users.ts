import axios from 'axios';

export interface User {
    id: number;
    name: string;
    rang: string;
    subdivision: string;
    email: string;
}

const api = axios.create({
    baseURL: 'http://localhost:3001',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});


export const fetchUsers = async (): Promise<User[]> => {
    try {
        const response = await api.get('/management/users/');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.message);
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
            }
        } else {
            console.error('Unexpected error:', error);
        }
        return [];
    }
};
