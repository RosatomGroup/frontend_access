import axios from 'axios';
import {api} from "@/api/axios.config";

export interface Role {
    id: number;
    name: string;
    description: string;
    resourceId: number;
    resourceName: string;
}

export interface Resource {
    id: number;
    name: string;
    description: string;
}


export const fetchRoles = async (): Promise<Role[]> => {
    try {
        const response = await api.get('/management/roles');
        return response.data;
    } catch (error) {
        handleApiError(error);
        return [];
    }
};

export const fetchResources = async (): Promise<Resource[]> => {
    try {
        const response = await api.get('/management/resources');
        return response.data;
    } catch (error) {
        handleApiError(error);
        return [];
    }
};

export const createRole = async (roleData: {
    name: string;
    description: string;
    resourceId: number;
}): Promise<Role> => {
    try {
        const response = await api.post('/management/roles', roleData);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

const handleApiError = (error: unknown) => {
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
};