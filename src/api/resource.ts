import api from '@/api/axios.config';

export interface Resource {
  id: number;
  name: string;
  description: string;
  link: string;
  owner: string;
}

export interface CreateResourceDto {
  name: string;
  description: string;
  link: string;
  owner: string;
}

export interface UpdateResourceDto {
  name?: string;
  description?: string;
  owner?: string;
}

export const fetchResources = async (): Promise<Resource[]> => {
  try {
    const response = await api.get('/management/resources');
    return response.data;
  } catch (error) {
    console.log(error);

    return [];
  }
};

export const fetchResourceById = async (id: number): Promise<Resource | null> => {
  try {
    const response = await api.get(`/management/resources/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createResource = async (resourceData: CreateResourceDto): Promise<Resource> => {
  try {
    const response = await api.post('/management/resources', resourceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateResource = async (
  id: number,
  resourceData: UpdateResourceDto,
): Promise<Resource> => {
  try {
    const response = await api.patch(`/management/resources/${id}`, resourceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteResource = async (id: number): Promise<void> => {
  try {
    await api.delete(`/management/resources/${id}`);
  } catch (error) {
    throw error;
  }
};

