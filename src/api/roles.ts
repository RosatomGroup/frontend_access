import api from "@/api/axios.config";

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
        return [];
    }
};

export const fetchResources = async (): Promise<Resource[]> => {
    try {
        const response = await api.get('/management/resources');
        return response.data;
    } catch (error) {
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
        throw error;
    }
};
