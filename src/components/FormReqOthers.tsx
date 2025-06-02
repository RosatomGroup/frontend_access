// 'use client';

// import { notification } from 'antd';
// import '@ant-design/v5-patch-for-react-19';
// import type { SizeType } from 'antd/es/config-provider/SizeContext';
// import { useRequestForm } from '@/hooks/useRequestForm';
// import { RequestForm } from './RequestForm';
// import React, { useState } from 'react';

// interface FormSubmitValues {
//   lastName: string;
//   firstName: string;
//   middleName: string;
//   email: string;
//   system: number;
//   role: number;
// }

// interface CreateRequestPayload {
//   name: string;
//   surname: string;
//   middleName: string;
//   email: string;
//   resourceId: number;
//   roleId: number;
//   requestType: 'GRANT_ACCESS' | 'REVOKE_ACCESS';
//   userId?: number;
// }

// const API_BASE_URL = 'http://localhost:3001';

// export default function FormReqOthers({ onClose }: { onClose: () => void }) {
//   const [componentSize, setComponentSize] = useState<SizeType>('default' as SizeType);
//   const [notificationApi, notificationContextHolder] = notification.useNotification();
//   const [isRequestForOtherUser, setIsRequestForOtherUser] = useState(false);

//   const {
//     isLoading,
//     availableSystems,
//     filteredRoles,
//     handleSystemChange,
//     initialValues
//   } = useRequestForm({
//     lastName: 'Иванов',
//     firstName: 'Иван',
//     middleName: 'Иванович'
//   });

//   const handleSubmit = async (values: FormSubmitValues) => {
//     const payload: CreateRequestPayload = {
//       surname: values.lastName,
//       name: values.firstName,
//       middleName: values.middleName || '', // Отправляем пустую строку, если не заполнено
//       email: values.email,
//       resourceId: values.system,
//       roleId: values.role,
//       requestType: 'GRANT_ACCESS',
//     };

//     try {
//       const response = await fetch(`${API_BASE_URL}/requests`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         notificationApi.success({
//           message: 'Заявка успешно создана',
//           description: 'Заявка на предоставление доступа отправлена.',
//         });
//         onClose();
//       } else {
//         const errorData = await response.json();
//         console.error('Backend error:', errorData);
//         notificationApi.error({
//           message: 'Ошибка при создании заявки',
//           description: errorData.message || 'Не удалось сохранить заявку. Попробуйте снова.',
//         });
//       }
//     } catch (error) {
//       console.error('Network or other error:', error);
//       notificationApi.error({
//         message: 'Сетевая ошибка',
//         description: 'Не удалось связаться с сервером. Проверьте ваше интернет-соединение.',
//       });
//     }
//   };

//   const onFormLayoutChange = ({ size }: { size: SizeType }) => {
//     setComponentSize(size);
//   };

//   const handleInputClick = () => {
//     if (!isRequestForOtherUser) {
//       setIsRequestForOtherUser(true);
//     }
//   };

//   return (
//     <div style={{ maxWidth: '100%', margin: '0 50px' }}>
//       {notificationContextHolder}
//       <RequestForm
//         initialValues={initialValues}
//         onFinish={handleSubmit}
//         onFormLayoutChange={onFormLayoutChange}
//         componentSize={componentSize}
//         availableSystems={availableSystems}
//         filteredRoles={filteredRoles}
//         isLoading={isLoading}
//         isRequestForOtherUser={isRequestForOtherUser}
//         onCheckboxChange={setIsRequestForOtherUser}
//         onInputClick={handleInputClick}
//         onSystemChange={handleSystemChange}
//       />
//     </div>
//   );
// }

// src/components/FormReqOthers.tsx
'use client';

import { notification } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { useRequestForm } from '@/hooks/useRequestForm';
import { RequestForm } from './RequestForm';
import React, { useState } from 'react';
import { useAuthFetch } from '@/hooks/useAuthFetch';

interface FormSubmitValues {
  lastName: string;
  firstName: string;
  middleName: string;
  email: string;
  system: number;
  role: number;
}

interface CreateRequestPayload {
  name: string;
  surname: string;
  middleName: string;
  email: string;
  resourceId: number;
  roleId: number;
  requestType: 'GRANT_ACCESS' | 'REVOKE_ACCESS';
  userId?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export default function FormReqOthers({ onClose }: { onClose: () => void }) {
  const [componentSize, setComponentSize] = useState<SizeType>('default' as SizeType);
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [isRequestForOtherUser, setIsRequestForOtherUser] = useState(false);
  const { fetchWithAuth } = useAuthFetch();

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

  const handleSubmit = async (values: FormSubmitValues) => {
    const payload: CreateRequestPayload = {
      surname: values.lastName,
      name: values.firstName,
      middleName: values.middleName || '',
      email: values.email,
      resourceId: values.system,
      roleId: values.role,
      requestType: 'GRANT_ACCESS',
    };

    try {
      await fetchWithAuth(`${API_BASE_URL}/requests`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      notificationApi.success({
        message: 'Заявка успешно создана',
        description: 'Заявка на предоставление доступа отправлена.',
      });
      onClose();
    } catch (error) {
      notificationApi.error({
        message: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось создать заявку',
      });
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