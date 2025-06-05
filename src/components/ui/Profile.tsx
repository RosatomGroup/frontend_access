'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Row,
  Space,
  Upload,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import type { RcFile, UploadChangeParam, UploadProps } from 'antd/es/upload';
import { AxiosError } from 'axios';
import { User } from '../../types/user';
import api from '@/api/axios.config';
import { useUser } from '@/components/UserContext';

interface ProfileProps {
  open: boolean;
  onClose: () => void;
  onUserUpdate?: () => void;
}

type UserForm = Omit<User, 'birthDate'> & { birthDate?: Dayjs | null };

const Profile: React.FC<ProfileProps> = ({ open, onClose, onUserUpdate }) => {
  const { user, isLoading, refresh } = useUser();
  const [form] = Form.useForm<UserForm>();
  const [initialValues, setInitialValues] = useState<UserForm>({} as UserForm);
  const [isDirty, setIsDirty] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
  const [avatarUploadLoading, setAvatarUploadLoading] = useState(false);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string>('');
  const [messageApi, contextHolder] = message.useMessage();

  const dateFormatList = useMemo(() => ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'], []);

  // Генерация уникального имени файла для S3
  const generateS3FileName = useCallback(
    (file: RcFile) => {
      const userEmail = user?.email || 'unknown';
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      return `avatars/${userEmail.split('@')[0]}-${timestamp}.${extension}`;
    },
    [user],
  );

  // Функция для установки начальных значений формы из контекста
  const setFormInitialValues = useCallback(() => {
    if (user) {
      const formattedUser: UserForm = {
        ...user,
        birthDate: user.birthDate ? dayjs(user.birthDate) : null,
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
      setInitialValues({} as UserForm);
    }
  }, [open, user, isLoading, form, setFormInitialValues]);

  const handleValuesChange = useCallback(() => {
    const currentValues = form.getFieldsValue();
    const hasChanges = Object.keys(currentValues).some((key) => {
      const initialValue = initialValues[key as keyof UserForm];
      const currentValue = currentValues[key as keyof UserForm];

      // Специальная обработка для Dayjs (birthDate)
      if (key === 'birthDate') {
        const initialDate = initialValue as Dayjs | null | undefined;
        const currentDate = currentValue as Dayjs | null | undefined;
        if (initialDate && currentDate) {
          return !initialDate.isSame(currentDate, 'day');
        }
        return initialDate !== currentDate;
      }

      // Проверка на undefined vs null для строк
      if (typeof initialValue === 'string' && typeof currentValue === 'string') {
        if (
          (initialValue === '' || initialValue === null) &&
          (currentValue === '' || currentValue === null)
        ) {
          return false;
        }
      }
      return JSON.stringify(currentValue) !== JSON.stringify(initialValue);
    });
    setIsDirty(hasChanges);
  }, [initialValues, form]);

  const onEditProfile = useCallback(
    async (values: UserForm) => {
      if (!user?.id) {
        messageApi.error('ID пользователя не найден.');
        return;
      }

      try {
        const payload = {
          name: values.name,
          surname: values.surname,
          middleName: values.middleName,
          phone: values.phone,
          avatarUrl: avatarPreviewUrl,
          birthDate: values.birthDate
            ? dayjs.isDayjs(values.birthDate)
              ? values.birthDate.format('YYYY-MM-DD')
              : null
            : null,
          subdivision: values.subdivision,
          rang: values.rang,
        };

        await api.patch(`/users/${user.id}`, payload);

        messageApi.success('Данные успешно сохранены!');
        setIsDirty(false);
        onClose();
        refresh();
        onUserUpdate?.();
      } catch (error) {
        console.error('Ошибка сохранения:', error);
        let errorMessage = 'Неизвестная ошибка при сохранении данных';

        if (error instanceof AxiosError) {
          errorMessage = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        messageApi.error(errorMessage);
      }
    },
    [avatarPreviewUrl, messageApi, onClose, onUserUpdate, refresh, user],
  );

  const handleSave = useCallback(async () => {
    try {
      setSavingLoading(true);
      const values = await form.validateFields();
      await onEditProfile(values);
    } catch (error) {
      console.error('Ошибка валидации:', error);
      messageApi.error('Пожалуйста, заполните все обязательные поля');
    } finally {
      setSavingLoading(false);
    }
  }, [form, messageApi, onEditProfile]);

  const handleChange: UploadProps['onChange'] = useCallback(
    async (info: UploadChangeParam) => {
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
          if (!user?.id) {
            throw new Error('ID пользователя не доступен для обновления аватара.');
          }

          const formData = new FormData();
          formData.append('file', originalFile);
          formData.append('fileName', generateS3FileName(originalFile));
          formData.append('contentType', originalFile.type);

          const uploadResponse = await fetch('/api/upload-to-s3', {
            method: 'POST',
            body: formData,
          });

          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            throw new Error(`S3 upload failed: ${errorText}`);
          }

          const { url } = await uploadResponse.json();

          setAvatarPreviewUrl(url);
          setIsDirty(true);
          messageApi.success('Аватар успешно обновлен');

          refresh();
          onUserUpdate?.();
        } catch (error) {
          console.error('Error updating avatar:', error);
          let errorMessage = 'Не удалось обновить аватар';

          if (error instanceof AxiosError) {
            errorMessage = error.response?.data?.message || error.message;
          } else if (error instanceof Error) {
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
    },
    [messageApi, onUserUpdate, generateS3FileName, user, refresh],
  );

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

  const uploadProps: UploadProps = useMemo(
    () => ({
      name: 'avatar',
      multiple: false,
      showUploadList: false,
      beforeUpload,
      onChange: handleChange,
      accept: 'image/*',
    }),
    [beforeUpload, handleChange],
  );

  const handleCloseAttempt = useCallback(() => {
    if (isDirty) {
      setConfirmVisible(true);
    } else {
      onClose();
    }
  }, [isDirty, onClose]);

  const handleConfirmClose = useCallback(
    (shouldClose: boolean) => {
      setConfirmVisible(false);
      if (shouldClose) onClose();
    },
    [onClose],
  );

  if (isLoading || !user) {
    return null;
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
        forceRender
        styles={{ body: { paddingBottom: 80 } }}
        extra={
          <Space>
            <Button onClick={handleCloseAttempt} type="default">
              Отмена
            </Button>
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
              src={avatarPreviewUrl || undefined}
              icon={<UserOutlined style={{ fontSize: '24px' }} />}
              style={{ backgroundColor: '#1677ff' }}
              onError={() => {
                console.warn('Ошибка загрузки аватара, используем дефолтное изображение.');
                return false;
              }}
            />
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />} loading={avatarUploadLoading} type="default">
                Загрузить новое фото
              </Button>
            </Upload>
          </div>

          <Divider orientation="left">Личная информация</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="name"
                label="Имя"
                rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
              >
                <Input placeholder="Введите имя" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="middleName" label="Отчество">
                <Input placeholder="Введите отчество" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="surname"
                label="Фамилия"
                rules={[{ required: true, message: 'Пожалуйста, введите фамилию' }]}
              >
                <Input placeholder="Введите фамилию" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Пожалуйста, введите email', type: 'email' }]}
              >
                <Input placeholder="Введите email" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="accessLevel" label="Роль в системе">
                <Input placeholder="User" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Телефон"
                rules={[{ required: true, message: 'Пожалуйста, введите телефон' }]}
              >
                <Input placeholder="Введите телефон" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="subdivision" label="Подразделение">
                <Input placeholder="Ваше подразделение" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="rang" label="Должность">
                <Input placeholder="Ваша должность" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="birthDate" label="Дата рождения">
                <DatePicker format={dateFormatList} style={{ width: '100%' }} allowClear />
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
