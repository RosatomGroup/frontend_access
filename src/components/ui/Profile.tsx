// 'use client';
// import React, { useEffect, useState, useCallback, useMemo } from 'react';
// import { Button, Divider, Avatar, Upload, Col, DatePicker, Drawer, Form, Input, Row, Space, Modal, message } from 'antd';
// import dayjs from 'dayjs';
// import { UserOutlined, UploadOutlined } from '@ant-design/icons';
// import type { UploadProps, RcFile, UploadChangeParam } from 'antd/es/upload';

// interface UserData {
//   email: string;
//   name: string;
//   surname: string;
//   middle_name?: string;
//   phone?: string;
//   number?: string;
//   role?: string;
//   date?: dayjs.Dayjs;
//   avatar?: string;
//   job?: string;
//   otdel?: string;
// }

// interface ProfileProps {
//   open: boolean;
//   onClose: () => void;
//   onUserUpdate?: (user: UserData) => void;
// }

// const Profile: React.FC<ProfileProps> = ({ open, onClose, onUserUpdate }) => {
//   const [form] = Form.useForm<UserData>();
//   const [initialValues, setInitialValues] = useState<UserData>({} as UserData);
//   const [isDirty, setIsDirty] = useState(false);
//   const [confirmVisible, setConfirmVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [avatar, setAvatar] = useState<string>('');
//   const [messageApi, contextHolder] = message.useMessage();

//   const dateFormatList = useMemo(() => ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'], []);

//   // Генерация уникального имени файла для S3
//   const generateS3FileName = useCallback((file: RcFile) => {
//     const userEmail = localStorage.getItem('userEmail') || 'unknown';
//     const timestamp = Date.now();
//     const extension = file.name.split('.').pop();
//     return `avatars/${userEmail.split('@')[0]}-${timestamp}.${extension}`;
//   }, []);



//   const fetchCurrentUser = useCallback(async () => {
//     try {
//       const userEmail = localStorage.getItem('userEmail');
//       if (!userEmail) return;

//       const response = await fetch(`/api/profile?email=${encodeURIComponent(userEmail)}`);
//       if (!response.ok) return;

//       const user = await response.json();
//       const formattedUser = {
//         ...user,
//         date: user.date ? dayjs(user.date) : undefined
//       };

//       form.setFieldsValue(formattedUser);
//       setInitialValues(formattedUser);
//       setAvatar(user.avatar || '');
//       setIsDirty(false);
//     } catch (error) {
//       console.error('Ошибка при загрузке данных пользователя:', error);
//       messageApi.error('Не удалось загрузить данные профиля');
//     }
//   }, [form, messageApi]);

//   const resetForm = useCallback(() => {
//     setIsDirty(false);
//     setInitialValues({} as UserData);
//     setAvatar('');
//   }, [form]);

//   useEffect(() => {
//     if (!open) {
//       // resetForm();
//       return;
//     }
//     fetchCurrentUser();
//   }, [open, resetForm, fetchCurrentUser]);

//   const handleValuesChange = useCallback(() => {
//     const currentValues = form.getFieldsValue();
//     const hasChanges = Object.keys(currentValues).some(
//       key => JSON.stringify(currentValues[key as keyof UserData]) !==
//         JSON.stringify(initialValues[key as keyof UserData])
//     );
//     setIsDirty(hasChanges);
//   }, [initialValues, form]);

//   const onEditProfile = useCallback(async (values: UserData) => {
//     try {
//       const formattedValues = {
//         ...values,
//         date: values.date?.format('YYYY-MM-DD'),
//         avatar
//       };

//       const response = await fetch('/api/profile', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formattedValues),
//       });

//       if (!response.ok) throw new Error(await response.text());

//       const data = await response.json();
//       messageApi.success('Данные успешно сохранены!');
//       onUserUpdate?.(data.user);
//       setIsDirty(false);
//       onClose();
//     } catch (error) {
//       console.error('Ошибка сохранения:', error);
//       messageApi.error(error instanceof Error ? error.message : 'Неизвестная ошибка при сохранении данных');
//     }
//   }, [avatar, messageApi, onClose, onUserUpdate]);

//   const handleSave = useCallback(async () => {
//     try {
//       setLoading(true);
//       const values = await form.validateFields();
//       await onEditProfile(values);
//     } catch (error) {
//       console.error("Ошибка валидации:", error);
//       messageApi.error('Пожалуйста, заполните все обязательные поля');
//     } finally {
//       setLoading(false);
//     }
//   }, [form, messageApi, onEditProfile]);

//   const handleChange: UploadProps['onChange'] = useCallback(async (info: UploadChangeParam) => {
//     if (info.file.status === 'uploading') {
//       setLoading(true);
//       return;
//     }

//     if (info.file.status === 'done') {
//       try {
//         // Подготовка данных для загрузки
//         const formData = new FormData();
//         formData.append('file', info.file.originFileObj as Blob);
//         formData.append('fileName', generateS3FileName(info.file.originFileObj as RcFile));
//         formData.append('contentType', (info.file.originFileObj as RcFile).type);

//         // Загрузка в S3 через API route
//         const uploadResponse = await fetch('/api/upload-to-s3', {
//           method: 'POST',
//           body: formData,
//         });

//         if (!uploadResponse.ok) throw new Error('S3 upload failed');

//         const { url } = await uploadResponse.json();

//         // Обновление user.json
//         const updateResponse = await fetch('/api/update-user-avatar', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             email: localStorage.getItem('userEmail'),
//             avatar: url
//           }),
//         });

//         if (!updateResponse.ok) throw new Error('User update failed');

//         // Обновление состояния
//         const updatedUser = await updateResponse.json();
//         setAvatar(url);
//         setIsDirty(true);
//         messageApi.success('Аватар успешно обновлен');

//         if (onUserUpdate) {
//           onUserUpdate(updatedUser);
//         }
//       } catch (error) {
//         console.error('Error updating avatar:', error);
//         messageApi.error('Не удалось обновить аватар');
//       } finally {
//         setLoading(false);
//       }
//     }
//   }, [messageApi, onUserUpdate, generateS3FileName]);

//   const beforeUpload = useCallback((file: RcFile) => {
//     const isImage = file.type.startsWith('image/');
//     if (!isImage) {
//       message.error('Вы можете загрузить только изображения!');
//       return Upload.LIST_IGNORE;
//     }
//     const isLt2M = file.size / 1024 / 1024 < 2;
//     if (!isLt2M) {
//       message.error('Изображение должно быть меньше 2MB!');
//       return Upload.LIST_IGNORE;
//     }
//     return true;
//   }, []);

//   const uploadProps: UploadProps = useMemo(() => ({
//     name: 'avatar',
//     multiple: false,
//     showUploadList: false,
//     beforeUpload,
//     onChange: handleChange,
//     accept: 'image/*',
//   }), [beforeUpload, handleChange]);

//   const handleCloseAttempt = useCallback(() => {
//     if (isDirty) {
//       setConfirmVisible(true);
//     } else {
//       onClose();
//     }
//   }, [isDirty, onClose]);

//   const handleConfirmClose = useCallback((shouldClose: boolean) => {
//     setConfirmVisible(false);
//     if (shouldClose) onClose();
//   }, [onClose]);

//   return (
//     <>
//       {contextHolder}
//       <Drawer
//         title="Профиль пользователя"
//         width={720}
//         open={open}
//         onClose={handleCloseAttempt}
//         maskClosable={false}
//         keyboard={false}
//         styles={{ body: { paddingBottom: 80 } }}
//         extra={
//           <Space>
//             <Button onClick={handleCloseAttempt}>Отмена</Button>
//             <Button
//               onClick={handleSave}
//               type="primary"
//               loading={loading}
//               disabled={!isDirty}
//             >
//               Сохранить
//             </Button>
//           </Space>
//         }
//       >
//         <Form layout="vertical" form={form} onValuesChange={handleValuesChange}>
//           <Divider orientation="left">Аватар</Divider>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
//             <Avatar
//               size={72}
//               src={avatar || null}
//               icon={<UserOutlined style={{ fontSize: '24px' }} />}
//               style={{ backgroundColor: '#1677ff' }}
//               onError={() => false}
//             />
//             <Upload {...uploadProps}>
//               <Button icon={<UploadOutlined />} loading={loading}>
//                 Загрузить новое фото
//               </Button>
//             </Upload>
//           </div>

//           <Divider orientation="left">Личная информация</Divider>
//           <Row gutter={16}>
//             <Col span={8}>
//               <Form.Item name="name" label="Имя" rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}>
//                 <Input placeholder="Введите имя" />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item name="middle_name" label="Отчество">
//                 <Input placeholder="Введите отчество" />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item name="surname" label="Фамилия" rules={[{ required: true, message: 'Пожалуйста, введите фамилию' }]}>
//                 <Input placeholder="Введите фамилию" />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Пожалуйста, введите email', type: 'email' }]}>
//                 <Input placeholder="Введите email" disabled />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item name="role" label="Роль в системе">
//                 <Input placeholder="User" disabled />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item name="number" label="Табельный номер" rules={[{ required: true, message: 'Пожалуйста, введите табельный номер' }]}>
//                 <Input placeholder="Введите табельный номер" />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item name="phone" label="Телефон" rules={[{ required: true, message: 'Пожалуйста, введите телефон' }]}>
//                 <Input placeholder="Введите телефон" />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 name="otdel"
//                 label="Подразделение"
//               // rules={[{ required: true, message: 'Пожалуйста, введите ваше подразделение' }]}
//               >
//                 <Input placeholder="Ваше подразделение" />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 name="job"
//                 label="Должность"
//               // rules={[{ required: true, message: 'Пожалуйста, введите вашу должность' }]}
//               >
//                 <Input placeholder="Ваша должность" />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item name="date" label="Дата рождения">
//                 <DatePicker format={dateFormatList} style={{ width: '100%' }} />
//               </Form.Item>
//             </Col>
//           </Row>
//         </Form>
//       </Drawer>

//       <Modal
//         title="Подтверждение"
//         open={confirmVisible}
//         onOk={() => handleConfirmClose(true)}
//         onCancel={() => handleConfirmClose(false)}
//         okText="Закрыть без сохранения"
//         cancelText="Продолжить редактирование"
//       >
//         <p>У вас есть несохраненные изменения. Вы уверены, что хотите закрыть?</p>
//       </Modal>
//     </>
//   );
// };

// export default Profile;


// src/components/ui/Profile.tsx



// src/components/ui/Profile.tsx
'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Divider, Avatar, Upload, Col, DatePicker, Drawer, Form, Input, Row, Space, Modal, message } from 'antd';
import dayjs from 'dayjs';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps, RcFile, UploadChangeParam } from 'antd/es/upload';
import { useUser, UserData as UserContextData } from '../UserContext'; // Импортируем useUser и UserData из контекста
import { api } from '@/api/axios.config'; // Используем настроенный axios инстанс
import { AxiosError } from 'axios'; // <-- Добавляем импорт AxiosError

// Определяем интерфейс для данных формы, который должен соответствовать UpdateUserDto на бэкенде
// и данным из UserContextData.
interface ProfileFormData {
    id: number; // Идентификатор пользователя (из UserContextData)
    email: string;
    name: string;
    surname: string;
    middleName: string | null; // middleName на бэкенде и в UserContextData
    phone: string | null;
    avatarUrl: string; // avatarUrl на бэкенде и в UserContextData
    birthDate: dayjs.Dayjs | null; // Дата рождения в формате Dayjs для DatePicker
    subdivision: string; // subdivision на бэкенде и в UserContextData (ранее otdel)
    rang: string; // rang на бэкенде и в UserContextData (ранее job)
    accessLevel?: string; // Добавлено, так как используется в форме
}

interface ProfileProps {
    open: boolean;
    onClose: () => void;
    onUserUpdate?: () => void; // Вызывается после успешного обновления данных
}

const Profile: React.FC<ProfileProps> = ({ open, onClose, onUserUpdate }) => {
    const { user, isLoading, refresh } = useUser(); // Получаем данные пользователя и функцию refresh из контекста
    const [form] = Form.useForm<ProfileFormData>();
    const [initialValues, setInitialValues] = useState<ProfileFormData>({} as ProfileFormData);
    const [isDirty, setIsDirty] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [savingLoading, setSavingLoading] = useState(false); // Отдельное состояние для сохранения данных формы
    const [avatarUploadLoading, setAvatarUploadLoading] = useState(false); // Отдельное состояние для загрузки аватара
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string>(''); // Для отображения текущего аватара
    const [messageApi, contextHolder] = message.useMessage();

    const dateFormatList = useMemo(() => ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'], []);

    // Генерация уникального имени файла для S3
    const generateS3FileName = useCallback((file: RcFile) => {
        const userEmail = user?.email || 'unknown'; // Используем email из контекста
        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        return `avatars/${userEmail.split('@')[0]}-${timestamp}.${extension}`;
    }, [user]);

    // Функция для установки начальных значений формы из контекста
    const setFormInitialValues = useCallback(() => {
        if (user) {
            const formattedUser: ProfileFormData = {
                id: user.id,
                email: user.email,
                name: user.name,
                surname: user.surname,
                middleName: user.middleName,
                phone: user.phone,
                avatarUrl: user.avatarUrl,
                // Преобразуем строковую дату в объект Dayjs для DatePicker
                birthDate: user.birthDate ? dayjs(user.birthDate) : null,
                subdivision: user.subdivision,
                rang: user.rang,
                accessLevel: user.accessLevel, // Добавляем accessLevel из контекста
            };
            form.setFieldsValue(formattedUser);
            setInitialValues(formattedUser);
            setAvatarPreviewUrl(user.avatarUrl || '');
            setIsDirty(false);
        }
    }, [user, form]);

    // useEffect для инициализации формы при открытии Drawer или изменении user из контекста
    useEffect(() => {
        if (open && user && !isLoading) {
            setFormInitialValues();
        }
        if (!open) {
            form.resetFields();
            setIsDirty(false);
            setAvatarPreviewUrl('');
            setInitialValues({} as ProfileFormData);
        }
    }, [open, user, isLoading, form, setFormInitialValues]);

    const handleValuesChange = useCallback(() => {
        const currentValues = form.getFieldsValue();
        const hasChanges = Object.keys(currentValues).some(
            key => {
                const initialValue = initialValues[key as keyof ProfileFormData];
                const currentValue = currentValues[key as keyof ProfileFormData];

                // Специальная обработка для Dayjs (birthDate)
                if (key === 'birthDate') {
                    const initialDate = initialValue as dayjs.Dayjs | null;
                    const currentDate = currentValue as dayjs.Dayjs | null;
                    if (initialDate && currentDate) {
                        return !initialDate.isSame(currentDate, 'day');
                    }
                    return initialDate !== currentDate; // Если одно из них null
                }

                // Проверка на undefined vs null для строк
                if (typeof initialValue === 'string' && typeof currentValue === 'string') {
                    if ((initialValue === '' || initialValue === null) && (currentValue === '' || currentValue === null)) {
                        return false; // '' и null считаем одинаковыми для пустых строк
                    }
                }
                return JSON.stringify(currentValue) !== JSON.stringify(initialValue);
            }
        );
        setIsDirty(hasChanges);
    }, [initialValues, form]);

    const onEditProfile = useCallback(async (values: ProfileFormData) => {
        if (!user?.id) {
            messageApi.error('ID пользователя не найден.');
            return;
        }

        try {
            // Преобразуем поля формы в формат, ожидаемый бэкендом (UpdateUserDto)
            // Убедитесь, что имена полей здесь совпадают с вашим UpdateUserDto
            const payload = {
                name: values.name,
                surname: values.surname,
                middleName: values.middleName,
                phone: values.phone,
                avatarUrl: avatarPreviewUrl, // Актуальный URL аватара
                birthDate: values.birthDate?.format('YYYY-MM-DD') || null, // Отправляем как 'YYYY-MM-DD' или null
                subdivision: values.subdivision,
                rang: values.rang,
                // email не редактируется через этот PUT/PATCH роут
                // id не отправляется в теле, он в URL
            };

            // Используем PATCH запрос к /users/:id
            const response = await api.patch<UserContextData>(`/users/${user.id}`, payload);

            if (response.status !== 200) {
                // Если статус не 200, ошибка может быть в response.data?.message
                throw new Error(response.data?.message || 'Ошибка обновления профиля');
            }

            messageApi.success('Данные успешно сохранены!');
            setIsDirty(false);
            onClose();
            refresh(); // Обновляем глобальное состояние пользователя
            onUserUpdate?.(); // Вызываем пропс для дополнительной логики в родительском компоненте
        } catch (error) { // <-- Здесь ловим ошибку
            console.error('Ошибка сохранения:', error);
            let errorMessage = 'Неизвестная ошибка при сохранении данных';

            if (error instanceof AxiosError) { // <-- Проверяем, является ли ошибка AxiosError
                errorMessage = error.response?.data?.message || error.message;
            } else if (error instanceof Error) { // <-- Или стандартной ошибкой
                errorMessage = error.message;
            }
            messageApi.error(errorMessage);
        }
    }, [avatarPreviewUrl, messageApi, onClose, onUserUpdate, refresh, user]);

    const handleSave = useCallback(async () => {
        try {
            setSavingLoading(true);
            const values = await form.validateFields();
            await onEditProfile(values);
        } catch (error) {
            console.error("Ошибка валидации:", error);
            messageApi.error('Пожалуйста, заполните все обязательные поля');
        } finally {
            setSavingLoading(false);
        }
    }, [form, messageApi, onEditProfile]);

    const handleChange: UploadProps['onChange'] = useCallback(async (info: UploadChangeParam) => {
        if (info.file.status === 'uploading') {
            setAvatarUploadLoading(true);
            return;
        }

        if (info.file.status === 'done') {
            try {
                const originalFile = info.file.originFileObj as RcFile;
                if (!originalFile) {
                    throw new Error('Файл не найден.');
                }
                if (!user?.id) { // Убедимся, что user.id доступен для обновления
                    throw new Error('ID пользователя не доступен для обновления аватара.');
                }

                const formData = new FormData();
                formData.append('file', originalFile);
                formData.append('fileName', generateS3FileName(originalFile));
                formData.append('contentType', originalFile.type);

                // Шаг 1: Загрузка изображения на S3 через ваш Next.js API Route
                const uploadResponse = await fetch('/api/upload-to-s3', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    const errorText = await uploadResponse.text();
                    throw new Error(`S3 upload failed: ${errorText}`);
                }

                const { url } = await uploadResponse.json();

                // Шаг 2: Обновление URL аватара в профиле пользователя через ваш бэкенд
                // Используем PATCH запрос к /users/:id для обновления только avatarUrl
                const updateResponse = await api.patch<UserContextData>(`/users/${user.id}`, {
                    avatarUrl: url
                });

                if (updateResponse.status !== 200) {
                    throw new Error(updateResponse.data?.message || 'Не удалось обновить URL аватара пользователя в БД');
                }

                setAvatarPreviewUrl(url); // Обновляем URL для предпросмотра
                setIsDirty(true); // Форма технически изменилась, но мы сразу сохранили аватар
                messageApi.success('Аватар успешно обновлен');

                refresh(); // Обновляем глобальное состояние пользователя
                onUserUpdate?.();

            } catch (error) { // <-- Здесь ловим ошибку
                console.error('Error updating avatar:', error);
                let errorMessage = 'Не удалось обновить аватар';

                if (error instanceof AxiosError) { // <-- Проверяем, является ли ошибка AxiosError
                    errorMessage = error.response?.data?.message || error.message;
                } else if (error instanceof Error) { // <-- Или стандартной ошибкой
                    errorMessage = error.message;
                }
                messageApi.error(errorMessage);
            } finally {
                setAvatarUploadLoading(false);
            }
        } else if (info.file.status === 'error') {
            setAvatarUploadLoading(false);
            messageApi.error('Ошибка загрузки файла.');
            console.error('Upload error:', info.file.error);
        }
    }, [messageApi, onUserUpdate, generateS3FileName, user, refresh]);

    const beforeUpload = useCallback((file: RcFile) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Вы можете загрузить только изображения!');
            return Upload.LIST_IGNORE;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Изображение должно быть меньше 2MB!');
            return Upload.LIST_IGNORE;
        }
        return true;
    }, []);

    const uploadProps: UploadProps = useMemo(() => ({
        name: 'avatar',
        multiple: false,
        showUploadList: false,
        beforeUpload,
        onChange: handleChange,
        accept: 'image/*',
    }), [beforeUpload, handleChange]);

    const handleCloseAttempt = useCallback(() => {
        if (isDirty) {
            setConfirmVisible(true);
        } else {
            onClose();
        }
    }, [isDirty, onClose]);

    const handleConfirmClose = useCallback((shouldClose: boolean) => {
        setConfirmVisible(false);
        if (shouldClose) onClose();
    }, [onClose]);

    // Если пользователь не загружен или есть ошибка загрузки (из контекста)
    if (isLoading || !user) {
        return null; // Или можно отобразить лоадер/сообщение об ошибке
    }

    return (
        <>
            {contextHolder}
            <Drawer
                title="Профиль пользователя"
                width={720}
                open={open}
                onClose={handleCloseAttempt}
                maskClosable={false}
                keyboard={false}
                styles={{ body: { paddingBottom: 80 } }}
                extra={
                    <Space>
                        <Button onClick={handleCloseAttempt}>Отмена</Button>
                        <Button
                            onClick={handleSave}
                            type="primary"
                            loading={savingLoading}
                            disabled={!isDirty || savingLoading}
                        >
                            Сохранить
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical" form={form} onValuesChange={handleValuesChange}>
                    <Divider orientation="left">Аватар</Divider>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                        <Avatar
                            size={72}
                            src={avatarPreviewUrl || null}
                            icon={<UserOutlined style={{ fontSize: '24px' }} />}
                            style={{ backgroundColor: '#1677ff' }}
                            onError={() => {
                                console.warn('Ошибка загрузки аватара, используем дефолтное изображение.');
                                return false; // Предотвращает отображение broken image icon
                            }}
                        />
                        <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />} loading={avatarUploadLoading}>
                                Загрузить новое фото
                            </Button>
                        </Upload>
                    </div>

                    <Divider orientation="left">Личная информация</Divider>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="name" label="Имя" rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}>
                                <Input placeholder="Введите имя" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="middleName" label="Отчество">
                                <Input placeholder="Введите отчество" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="surname" label="Фамилия" rules={[{ required: true, message: 'Пожалуйста, введите фамилию' }]}>
                                <Input placeholder="Введите фамилию" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Пожалуйста, введите email', type: 'email' }]}>
                                <Input placeholder="Введите email" disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="accessLevel" label="Роль в системе">
                                <Input placeholder="User" disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="id" label="ID пользователя">
                                <Input placeholder="ID" disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="phone" label="Телефон" rules={[{ required: true, message: 'Пожалуйста, введите телефон' }]}>
                                <Input placeholder="Введите телефон" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="subdivision"
                                label="Подразделение"
                            >
                                <Input placeholder="Ваше подразделение" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="rang"
                                label="Должность"
                            >
                                <Input placeholder="Ваша должность" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="birthDate" label="Дата рождения">
                                <DatePicker format={dateFormatList} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>

            <Modal
                title="Подтверждение"
                open={confirmVisible}
                onOk={() => handleConfirmClose(true)}
                onCancel={() => handleConfirmClose(false)}
                okText="Закрыть без сохранения"
                cancelText="Продолжить редактирование"
            >
                <p>У вас есть несохраненные изменения. Вы уверены, что хотите закрыть?</p>
            </Modal>
        </>
    );
};

export default Profile;