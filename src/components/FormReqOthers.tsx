// src/components/FormReqOthers.tsx
'use client';

import { notification } from 'antd';
import '@ant-design/v5-patch-for-react-19';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { reqOutdata } from '@/app/reqOut';
import { useRequestForm } from '@/hooks/useRequestForm';
import { RequestForm } from './RequestForm';
import React, { useState } from 'react';

interface RequestData {
  id: number;
  name: string;
  requestSubject: string;
  role: string;
  status: string;
  system: string;
  submissionTime: string;
  email: string;
}

export default function FormReqOthers({ onClose }: { onClose: () => void }) {
  const [componentSize, setComponentSize] = useState<SizeType>('default' as SizeType);
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [isRequestForOtherUser, setIsRequestForOtherUser] = useState(false);
  
  const {
    isLoading,
    availableSystems,
    filteredRoles,
    handleSystemChange,
    initialValues
  } = useRequestForm({
    lastName: 'Иванов',
    firstName: 'Иван',
    middleName: 'Иванович'
  });

  const handleSubmit = async (values: {
    lastName: string;
    firstName: string;
    middleName?: string;
    email: string;
    system: string;
    role: string;
  }) => {
    try {
      const newRequest: RequestData = {
        id: reqOutdata.length + 1,
        name: `${values.lastName} ${values.firstName} ${values.middleName || ''}`.trim(),
        requestSubject: "Предоставить доступ",
        role: values.role,
        status: 'в работе',
        system: values.system,
        submissionTime: new Date().toISOString(),
        email: values.email
      };

      reqOutdata.unshift(newRequest);

      const response = await fetch('/api/updateReqOut', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqOutdata),
      });

      if (response.ok) {
        notificationApi.success({
          message: 'Заявка успешно создана',
          description: 'Заявка на доступ для других пользователей отправлена',
        });
        onClose();
      } else {
        notificationApi.error({
          message: 'Ошибка',
          description: 'Не удалось сохранить заявку',
        });
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  const handleInputClick = () => {
    if (!isRequestForOtherUser) {
      setIsRequestForOtherUser(true);
    }
  };

  return (
    <div style={{ maxWidth: '100%', margin: '0 50px' }}>
      {notificationContextHolder}
      <RequestForm
        initialValues={initialValues}
        onFinish={handleSubmit}
        onFormLayoutChange={onFormLayoutChange}
        componentSize={componentSize}
        availableSystems={availableSystems}
        filteredRoles={filteredRoles}
        isLoading={isLoading}
        isRequestForOtherUser={isRequestForOtherUser}
        onCheckboxChange={setIsRequestForOtherUser}
        onInputClick={handleInputClick}
        onSystemChange={handleSystemChange}
      />
    </div>
  );
}