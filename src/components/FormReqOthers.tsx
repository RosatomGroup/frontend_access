'use client';

import React, { useState, useEffect } from 'react';
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export default function FormReqOthers({ onClose }: { onClose: () => void }) {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isRequestForOtherUser, setIsRequestForOtherUser] = useState(false);
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const { fetchWithAuth } = useAuthFetch();
  const [formValues, setFormValues] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    email: ''
  });

  const {
    isLoading,
    availableSystems,
    filteredRoles,
    handleSystemChange,
    initialValues,
    allRoles
  } = useRequestForm({
    lastName: '',
    firstName: '',
    middleName: ''
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await fetchWithAuth(`${API_BASE_URL}/auth/me`);
        setCurrentUser(user);
        if (!isRequestForOtherUser) {
          setFormValues({
            lastName: user.surname || '',
            firstName: user.name || '',
            middleName: user.middleName || '',
            email: user.email || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        notificationApi.error({
          message: 'Ошибка',
          description: 'Не удалось загрузить данные пользователя'
        });
      }
    };

    fetchCurrentUser();
  }, [fetchWithAuth, notificationApi, isRequestForOtherUser]);

  const handleSubmit = async (values: FormSubmitValues) => {
    if (!currentUser) {
      notificationApi.error({
        message: 'Ошибка',
        description: 'Не удалось определить текущего пользователя'
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
      userId: Number(currentUser.id)
    };

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      notificationApi.success({
        message: 'Успех',
        description: 'Заявка успешно создана',
        duration: 3
      });
      onClose();
    } catch (error: any) {
      console.error('Error creating request:', error);
      if (error.message.includes('уже существует')) {
        notificationApi.warning({
          message: 'Заявка уже существует',
          description: error.message,
          duration: 5
        });
      } else {
        notificationApi.error({
          message: 'Ошибка',
          description: error.message || 'Не удалось создать заявку',
          duration: 5
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
        email: ''
      });
    } else if (currentUser) {
      setFormValues({
        lastName: currentUser.surname || '',
        firstName: currentUser.name || '',
        middleName: currentUser.middleName || '',
        email: currentUser.email || ''
      });
    }
  };

  const handleValuesChange = (changedValues: any, allValues: any) => {
    setFormValues(prev => ({
      ...prev,
      ...changedValues
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
        componentSize="default"
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