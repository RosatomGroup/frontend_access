import api from '@/api/axios.config';

export interface BackendRequestDataType {
  id: number;
  name: string;
  surname: string;
  middleName: string;
  email: string;
  requestType: 'GRANT_ACCESS' | 'REVOKE_ACCESS';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createDate: string;
  completeDate?: string;
  resourceId: number;
  roleId: number;
  resourceName: string;
  roleName: string;
  resourceLink?: string;
  userId?: number;
}

export interface Accesses {
  id: number;
  role: string;
  system: string;
  createDate: Date;
}

export interface CreateRequestDto {
  name: string;
  surname: string;
  middleName: string;
  email: string;
  resourceId: number;
  roleId: number;
  requestType: 'GRANT_ACCESS' | 'REVOKE_ACCESS';
  userId?: number;
}

export interface UpdateRequestStatusDto {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export const fetchRequests = async (): Promise<BackendRequestDataType[]> => {
  try {
    const response = await api.get<BackendRequestDataType[]>('/requests');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchRequestsByUserId = async (
  id: number,
): Promise<BackendRequestDataType[] | null> => {
  try {
    const response = await api.get<BackendRequestDataType[]>(`/requests/users/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const fetchAccesses = async (userId: number): Promise<BackendRequestDataType[] | null> => {
  try {
    const response = await api.get(`/requests/accesses/${userId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createRequest = async (dto: CreateRequestDto): Promise<BackendRequestDataType> => {
  try {
    const response = await api.post<BackendRequestDataType>('/requests', dto);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRequestStatus = async (
  id: number,
  dto: UpdateRequestStatusDto,
): Promise<BackendRequestDataType> => {
  try {
    const response = await api.patch<BackendRequestDataType>(`/request/${id}/status/`, dto);
    return response.data;
  } catch (error) {
    throw error;
  }
};

