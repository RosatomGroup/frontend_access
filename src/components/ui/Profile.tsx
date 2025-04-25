'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Divider, Avatar, Upload, Col, DatePicker, Drawer, Form, Input, Row, Space, Modal, message } from 'antd';
import dayjs from 'dayjs';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps, RcFile, UploadChangeParam } from 'antd/es/upload';

interface UserData {
  email: string;
  name: string;
  surname: string;
  middle_name?: string;
  phone?: string;
  number?: string;
  role?: string;
  date?: dayjs.Dayjs;
  avatar?: string;
  job?: string;
  otdel?: string;
}

interface ProfileProps {
  open: boolean;
  onClose: () => void;
  onUserUpdate?: (user: UserData) => void;
}

const Profile: React.FC<ProfileProps> = ({ open, onClose, onUserUpdate }) => {
  const [form] = Form.useForm<UserData>();
  const [initialValues, setInitialValues] = useState<UserData>({} as UserData);
  const [isDirty, setIsDirty] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<string>('');
  const [messageApi, contextHolder] = message.useMessage();

  const dateFormatList = useMemo(() => ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'], []);

  // Генерация уникального имени файла для S3
  const generateS3FileName = useCallback((file: RcFile) => {
    const userEmail = localStorage.getItem('userEmail') || 'unknown';
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    return `avatars/${userEmail.split('@')[0]}-${timestamp}.${extension}`;
  }, []);



  const fetchCurrentUser = useCallback(async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return;

      const response = await fetch(`/api/profile?email=${encodeURIComponent(userEmail)}`);
      if (!response.ok) return;

      const user = await response.json();
      const formattedUser = {
        ...user,
        date: user.date ? dayjs(user.date) : undefined
      };

      form.setFieldsValue(formattedUser);
      setInitialValues(formattedUser);
      setAvatar(user.avatar || '');
      setIsDirty(false);
    } catch (error) {
      console.error('Ошибка при загрузке данных пользователя:', error);
      messageApi.error('Не удалось загрузить данные профиля');
    }
  }, [form, messageApi]);

  const resetForm = useCallback(() => {
    setIsDirty(false);
    setInitialValues({} as UserData);
    setAvatar('');
  }, [form]);

  useEffect(() => {
    if (!open) {
      // resetForm();
      return;
    }
    fetchCurrentUser();
  }, [open, resetForm, fetchCurrentUser]);

  const handleValuesChange = useCallback(() => {
    const currentValues = form.getFieldsValue();
    const hasChanges = Object.keys(currentValues).some(
      key => JSON.stringify(currentValues[key as keyof UserData]) !==
        JSON.stringify(initialValues[key as keyof UserData])
    );
    setIsDirty(hasChanges);
  }, [initialValues, form]);

  const onEditProfile = useCallback(async (values: UserData) => {
    try {
      const formattedValues = {
        ...values,
        date: values.date?.format('YYYY-MM-DD'),
        avatar
      };

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedValues),
      });

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      messageApi.success('Данные успешно сохранены!');
      onUserUpdate?.(data.user);
      setIsDirty(false);
      onClose();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      messageApi.error(error instanceof Error ? error.message : 'Неизвестная ошибка при сохранении данных');
    }
  }, [avatar, messageApi, onClose, onUserUpdate]);

  const handleSave = useCallback(async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await onEditProfile(values);
    } catch (error) {
      console.error("Ошибка валидации:", error);
      messageApi.error('Пожалуйста, заполните все обязательные поля');
    } finally {
      setLoading(false);
    }
  }, [form, messageApi, onEditProfile]);

  const handleChange: UploadProps['onChange'] = useCallback(async (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }

    if (info.file.status === 'done') {
      try {
        // Подготовка данных для загрузки
        const formData = new FormData();
        formData.append('file', info.file.originFileObj as Blob);
        formData.append('fileName', generateS3FileName(info.file.originFileObj as RcFile));
        formData.append('contentType', (info.file.originFileObj as RcFile).type);

        // Загрузка в S3 через API route
        const uploadResponse = await fetch('/api/upload-to-s3', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) throw new Error('S3 upload failed');

        const { url } = await uploadResponse.json();

        // Обновление user.json
        const updateResponse = await fetch('/api/update-user-avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: localStorage.getItem('userEmail'),
            avatar: url
          }),
        });

        if (!updateResponse.ok) throw new Error('User update failed');

        // Обновление состояния
        const updatedUser = await updateResponse.json();
        setAvatar(url);
        setIsDirty(true);
        messageApi.success('Аватар успешно обновлен');

        if (onUserUpdate) {
          onUserUpdate(updatedUser);
        }
      } catch (error) {
        console.error('Error updating avatar:', error);
        messageApi.error('Не удалось обновить аватар');
      } finally {
        setLoading(false);
      }
    }
  }, [messageApi, onUserUpdate, generateS3FileName]);

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
              loading={loading}
              disabled={!isDirty}
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
              src={avatar || null}
              icon={<UserOutlined style={{ fontSize: '24px' }} />}
              style={{ backgroundColor: '#1677ff' }}
              onError={() => false}
            />
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />} loading={loading}>
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
              <Form.Item name="middle_name" label="Отчество">
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
              <Form.Item name="role" label="Роль в системе">
                <Input placeholder="User" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="number" label="Табельный номер" rules={[{ required: true, message: 'Пожалуйста, введите табельный номер' }]}>
                <Input placeholder="Введите табельный номер" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Телефон" rules={[{ required: true, message: 'Пожалуйста, введите телефон' }]}>
                <Input placeholder="Введите телефон" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="otdel"
                label="Подразделение"
              // rules={[{ required: true, message: 'Пожалуйста, введите ваше подразделение' }]}
              >
                <Input placeholder="Ваше подразделение" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="job"
                label="Должность"
              // rules={[{ required: true, message: 'Пожалуйста, введите вашу должность' }]}
              >
                <Input placeholder="Ваша должность" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="date" label="Дата рождения">
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