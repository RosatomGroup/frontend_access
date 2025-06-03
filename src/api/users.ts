import api from "@/api/axios.config";

export interface User {
    id: number;
    name: string;
    rang: string;
    subdivision: string;
    email: string;
}


export const fetchUsers = async (): Promise<User[]> => {
    try {
        const response = await api.get('/management/users/');
        return response.data;
    } catch (error) {
        return [];
    }
};
