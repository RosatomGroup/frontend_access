'use client';

import React, { useEffect, useState } from 'react';
import { notification } from 'antd';
import { useRequestForm } from '@/hooks/useRequestForm';
import { RequestForm } from './RequestForm';
import { useAuthFetch } from '@/hooks/useAuthFetch';

interface UserData {
    id: number;
    email: string;
    name?: string;
    surname?: string;
    middleName?: string | null;
}

interface FormSubmitValues {
    lastName: string;
    firstName: string;
    middleName: string;
    email: string;
    system: number;
    role: number;
}

interface ChangedValues {
    lastName?: string;
    firstName?: string;
    middleName?: string;
    email?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export default function FormReqOthers({ onClose }: { onClose: () => void }) {
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [isRequestForOtherUser, setIsRequestForOtherUser] = useState(false);
    const [notificationApi, notificationContextHolder] = notification.useNotification();
    const { fetchWithAuth, postWithAuth } = useAuthFetch(); // Добавлен postWithAuth
    const [formValues, setFormValues] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        email: '',
    });

    const { isLoading, availableSystems, filteredRoles, handleSystemChange } = useRequestForm({
        lastName: '',
        firstName: '',
        middleName: '',
    });

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                // Исправлено: Явно указываем тип UserData для fetchWithAuth
                const user = await fetchWithAuth<UserData>(`${API_BASE_URL}/auth/me`);
                setCurrentUser(user);
                if (!isRequestForOtherUser) {
                    setFormValues({
                        lastName: user.surname || '',
                        firstName: user.name || '',
                        middleName: user.middleName || '',
                        email: user.email || '',
                    });
                }
            } catch (error) {
                console.error('Failed to fetch current user:', error);
                notificationApi.error({
                    message: 'Ошибка',
                    description: 'Не удалось загрузить данные пользователя',
                });
            }
        };

        fetchCurrentUser();
    }, [fetchWithAuth, notificationApi, isRequestForOtherUser]);

    const handleSubmit = async (values: FormSubmitValues) => {
        if (!currentUser) {
            notificationApi.error({
                message: 'Ошибка',
                description: 'Не удалось определить текущего пользователя',
            });
            return;
        }

        const payload = {
            surname: values.lastName,
            name: values.firstName,
            middleName: values.middleName || null,
            email: values.email,
            resourceId: Number(values.system),
            roleId: Number(values.role),
            requestType: 'GRANT_ACCESS' as const,
            userId: Number(currentUser.id),
        };

        try {
            // Используем postWithAuth для POST запроса
            await postWithAuth(`${API_BASE_URL}/requests`, payload);

            notificationApi.success({
                message: 'Успех',
                description: 'Заявка успешно создана',
                duration: 3,
            });
            onClose();
            setTimeout(() => location.reload(), 1500);
        } catch (error: unknown) {
            console.error('Error creating request:', error);
            const errorMessage = error instanceof Error ? error.message : 'Не удалось создать заявку';

            if (errorMessage.includes('уже существует')) {
                notificationApi.warning({
                    message: 'Заявка уже существует',
                    description: errorMessage,
                    duration: 5,
                });
            } else {
                notificationApi.error({
                    message: 'Ошибка',
                    description: errorMessage || 'Не удалось создать заявку',
                    duration: 5,
                });
            }
        }
    };

    const handleCheckboxChange = (checked: boolean) => {
        setIsRequestForOtherUser(checked);
        if (checked) {
            setFormValues({
                lastName: '',
                firstName: '',
                middleName: '',
                email: '',
            });
        } else if (currentUser) {
            setFormValues({
                lastName: currentUser.surname || '',
                firstName: currentUser.name || '',
                middleName: currentUser.middleName || '',
                email: currentUser.email || '',
            });
        }
    };

    const handleValuesChange = (changedValues: ChangedValues) => {
        setFormValues((prev) => ({
            ...prev,
            ...changedValues,
        }));
    };

    return (
        <div style={{ maxWidth: '100%', margin: '0 50px' }}>
            {notificationContextHolder}
            <RequestForm
                initialValues={formValues}
                onFinish={handleSubmit}
                onValuesChange={handleValuesChange}
                onFormLayoutChange={({ size }) => console.log('Form size changed:', size)}
                componentSize="middle"
                availableSystems={availableSystems}
                filteredRoles={filteredRoles}
                isLoading={isLoading}
                isRequestForOtherUser={isRequestForOtherUser}
                onCheckboxChange={handleCheckboxChange}
                onSystemChange={handleSystemChange}
            />
        </div>
    );
}