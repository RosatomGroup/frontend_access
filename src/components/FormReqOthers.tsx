// 'use client';

// import { notification } from 'antd';
// import type { SizeType } from 'antd/es/config-provider/SizeContext';
// import { useRequestForm } from '@/hooks/useRequestForm';
// import { RequestForm } from './RequestForm';
// import React, { useState, useEffect } from 'react';
// import { useAuthFetch } from '@/hooks/useAuthFetch';

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

// interface UserData {
//   id: number;
//   email: string;
// }

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// export default function FormReqOthers({ onClose }: { onClose: () => void }) {
//   const [componentSize, setComponentSize] = useState<SizeType>('default');
//   const [notificationApi, notificationContextHolder] = notification.useNotification();
//   const [isRequestForOtherUser, setIsRequestForOtherUser] = useState<boolean>(false);
//   const [currentUser, setCurrentUser] = useState<UserData | null>(null);
//   const { fetchWithAuth } = useAuthFetch();

//   const {
//     isLoading,
//     availableSystems,
//     filteredRoles,
//     handleSystemChange,
//     initialValues,
//     allRoles
//   } = useRequestForm({
//     lastName: 'Иванов',
//     firstName: 'Иван',
//     middleName: 'Иванович'
//   });

//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const user = await fetchWithAuth(`${API_BASE_URL}/auth/me`);
//         setCurrentUser(user);
//       } catch (error) {
//         console.error('Failed to fetch current user:', error);
//       }
//     };

//     fetchCurrentUser();
//   }, [fetchWithAuth]);

//   const handleSubmit = async (values: FormSubmitValues) => {
//     try {
//       const payload: CreateRequestPayload = {
//         surname: values.lastName,
//         name: values.firstName,
//         middleName: values.middleName || '',
//         email: values.email,
//         resourceId: values.system,
//         roleId: values.role,
//         requestType: 'GRANT_ACCESS',
//         userId: currentUser?.id
//       };

//       console.log('Отправляемые данные:', payload);

//       const response = await fetchWithAuth(`${API_BASE_URL}/requests`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Ошибка сервера при создании заявки');
//       }

//       notificationApi.success({
//         message: 'Заявка успешно создана',
//         description: 'Заявка на предоставление доступа отправлена.',
//       });
//       onClose();
//     } catch (error) {
//       console.error('Error creating request:', error);
//       notificationApi.error({
//         message: 'Ошибка',
//         description: error instanceof Error ? error.message : 'Не удалось создать заявку',
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








// 'use client';

// import React, { useState, useEffect } from 'react';
// import { notification } from 'antd';
// import { useRequestForm } from '@/hooks/useRequestForm';
// import { RequestForm } from './RequestForm';
// import { useAuthFetch } from '@/hooks/useAuthFetch';

// interface UserData {
//   id: number;
//   email: string;
//   name?: string;
//   surname?: string;
//   middleName?: string | null;
// }

// interface FormSubmitValues {
//   lastName: string;
//   firstName: string;
//   middleName: string;
//   email: string;
//   system: number;
//   role: number;
// }

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// export default function FormReqOthers({ onClose }: { onClose: () => void }) {
//   const [currentUser, setCurrentUser] = useState<UserData | null>(null);
//   const [isRequestForOtherUser, setIsRequestForOtherUser] = useState(false);
//   const [notificationApi, notificationContextHolder] = notification.useNotification();
//   const { fetchWithAuth } = useAuthFetch();

//   const {
//     isLoading,
//     availableSystems,
//     filteredRoles,
//     handleSystemChange,
//     initialValues,
//     allRoles
//   } = useRequestForm({
//     lastName: 'Иванов',
//     firstName: 'Иван',
//     middleName: 'Иванович'
//   });

//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const user = await fetchWithAuth(`${API_BASE_URL}/auth/me`);
//         console.log('Fetched current user:', user);
//         setCurrentUser(user);
//       } catch (error) {
//         console.error('Failed to fetch current user:', error);
//         notificationApi.error({
//           message: 'Ошибка',
//           description: 'Не удалось загрузить данные пользователя'
//         });
//       }
//     };

//     fetchCurrentUser();
//   }, [fetchWithAuth, notificationApi]);

//   const handleSubmit = async (values: FormSubmitValues) => {
//     if (!currentUser) {
//       notificationApi.error({
//         message: 'Ошибка',
//         description: 'Не удалось определить текущего пользователя'
//       });
//       return;
//     }

//     const payload = {
//       surname: values.lastName,
//       name: values.firstName,
//       middleName: values.middleName || null,
//       email: values.email,
//       resourceId: Number(values.system),
//       roleId: Number(values.role),
//       requestType: 'GRANT_ACCESS' as const,
//       userId: Number(currentUser.id)
//     };

//     console.log('Submitting request with payload:', payload);

//     try {
//       const response = await fetchWithAuth(`${API_BASE_URL}/requests`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       notificationApi.success({
//         message: 'Успех',
//         description: 'Заявка успешно создана',
//         duration: 3
//       });
//       onClose();
//     } catch (error: any) {
//       console.error('Error creating request:', error);

//       if (error.message.includes('уже существует')) {
//         notificationApi.warning({
//           message: 'Заявка уже существует',
//           description: error.message,
//           duration: 5
//         });
//       } else {
//         notificationApi.error({
//           message: 'Ошибка',
//           description: error.message || 'Не удалось создать заявку',
//           duration: 5
//         });
//       }
//     }
//   };

//   const handleCheckboxChange = (checked: boolean) => {
//     setIsRequestForOtherUser(checked);
//   };

//   return (
//     <div style={{ maxWidth: '100%', margin: '0 50px' }}>
//       {notificationContextHolder}
//       <RequestForm
//         initialValues={{
//           lastName: currentUser?.surname || initialValues.lastName,
//           firstName: currentUser?.name || initialValues.firstName,
//           middleName: currentUser?.middleName || initialValues.middleName,
//           email: currentUser?.email || ''
//         }}
//         onFinish={handleSubmit}
//         onFormLayoutChange={({ size }) => console.log('Form size changed:', size)}
//         componentSize="default"
//         availableSystems={availableSystems}
//         filteredRoles={filteredRoles}
//         isLoading={isLoading}
//         isRequestForOtherUser={isRequestForOtherUser}
//         onCheckboxChange={handleCheckboxChange}
//         onInputClick={() => console.log('Input clicked')}
//         onSystemChange={handleSystemChange}
//       />
//     </div>
//   );
// }


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