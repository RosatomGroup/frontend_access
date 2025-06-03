'use client';

import { useEffect, useState } from 'react';
import { Form, notification } from 'antd';
import { useRequestForm } from '@/hooks/useRequestForm';
import { RequestForm } from './RequestForm';
import { useAuthFetch } from '@/hooks/useAuthFetch';
import type { SizeType } from 'antd/es/config-provider/SizeContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

interface UserData {
  id: number;
  name: string;
  surname: string;
  middleName: string | null;
  email: string;
}

interface FormValues {
  lastName: string;
  firstName: string;
  middleName: string;
  email: string;
  system: number;
  role: number;
}

// interface CreateRequestResponse {
//     id: number;
// }

export default function FormReqRevoke({ onClose }: { onClose: () => void }) {
  const [form] = Form.useForm();
  const [isRequestForOtherUser, setIsRequestForOtherUser] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [api, contextHolder] = notification.useNotification();
  const { fetchWithAuth } = useAuthFetch();
  const [formValues, setFormValues] = useState<Omit<FormValues, 'system' | 'role'>>({
    lastName: '',
    firstName: '',
    middleName: '',
    email: '',
  });
  const [componentSize] = useState<SizeType>('default');

  const { isLoading, availableSystems, filteredRoles, handleSystemChange } = useRequestForm({
    lastName: '',
    firstName: '',
    middleName: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await fetchWithAuth(`${API_BASE_URL}/auth/me`);
        setCurrentUser({
          id: user.id,
          name: user.name,
          surname: user.surname,
          middleName: user.middleName,
          email: user.email,
        });

        if (!isRequestForOtherUser) {
          setFormValues({
            lastName: user.surname,
            firstName: user.name,
            middleName: user.middleName || '',
            email: user.email,
          });
          form.setFieldsValue({
            lastName: user.surname,
            firstName: user.name,
            middleName: user.middleName || '',
            email: user.email,
          });
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        api.error({
          message: 'Ошибка',
          description: 'Не удалось загрузить данные пользователя',
          duration: 5,
        });
      }
    };
    fetchUser();
  }, [fetchWithAuth, form, api, isRequestForOtherUser]);

  const handleSubmit = async (values: FormValues): Promise<void> => {
    try {
      const middleName = values.middleName?.trim() || null;

      if (middleName && typeof middleName !== 'string') {
        throw new Error('Отчество должно быть строкой или пустым');
      }

      const payload = {
        surname: values.lastName,
        name: values.firstName,
        middleName: middleName,
        email: values.email,
        resourceId: Number(values.system),
        roleId: Number(values.role),
        requestType: 'REVOKE_ACCESS' as const,
        userId: currentUser?.id ? Number(currentUser.id) : undefined,
      };

      await fetchWithAuth(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      api.success({
        message: 'Успех',
        description: 'Заявка на отзыв успешно создана',
        duration: 3,
      });
      onClose();
    } catch (error: unknown) {
      console.error('Error creating revoke request:', error);
      let errorMessage = 'Не удалось создать заявку на отзыв';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      api.error({
        message: 'Ошибка',
        description: errorMessage,
        duration: 5,
      });
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
      form.setFieldsValue({
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
      form.setFieldsValue({
        lastName: currentUser.surname,
        firstName: currentUser.name,
        middleName: currentUser.middleName || '',
        email: currentUser.email,
      });
    }
  };

  const handleValuesChange = (changedValues: Partial<FormValues>) => {
    setFormValues((prev) => ({
      ...prev,
      ...changedValues,
    }));
  };

  return (
    <div style={{ maxWidth: '100%', margin: '0 50px' }}>
      {contextHolder}
      <RequestForm
        form={form}
        initialValues={formValues}
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
        componentSize={componentSize}
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
