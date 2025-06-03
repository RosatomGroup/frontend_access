// src/api/requests.ts

import api from "@/api/axios.config";

// Типы DTO уже определены в вашем файле
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

// Получить все заявки
export const fetchRequests = async (): Promise<BackendRequestDataType[]> => {
    try {
        const response = await api.get<BackendRequestDataType[]>('/requests');
        return response.data;
    } catch (error) {
        // централизованная обработка ошибок
        // handleApiError(error); // если есть функция
        throw error;
    }
};

// Получить заявки по пользователю
export const fetchRequestsByUserId = async (id: number): Promise<BackendRequestDataType[] | null> => {
    try {
        const response = await api.get<BackendRequestDataType[]>(`/requests/users/${id}`);
        return response.data;
    } catch (error) {
        // handleApiError(error);
        return null;
    }
};

// Создать заявку
export const createRequest = async (dto: CreateRequestDto): Promise<BackendRequestDataType> => {
    try {
        const response = await api.post<BackendRequestDataType>('/requests', dto);
        return response.data;
    } catch (error) {
        // handleApiError(error);
        throw error;
    }
};

// Обновить статус заявки
export const updateRequestStatus = async (id: number, dto: UpdateRequestStatusDto): Promise<BackendRequestDataType> => {
    try {
        const response = await api.patch<BackendRequestDataType>(`/request/${id}/status/`, dto);
        return response.data;
    } catch (error) {
        // handleApiError(error);
        throw error;
    }
};
