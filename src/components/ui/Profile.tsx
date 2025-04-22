'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Button, Divider, Avatar, Upload, Col, DatePicker, Drawer, Form, Input, Row, Space, Modal, message } from 'antd';
import dayjs from 'dayjs';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps, RcFile } from 'antd/es/upload';

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
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [messageApi, contextHolder] = message.useMessage();
  const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];

  const resetForm = useCallback(() => {
    form.resetFields();
    setIsDirty(false);
    setInitialValues({} as UserData);
  }, [form]);

  useEffect(() => {
    if (!open) {
      resetForm();
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          const response = await fetch(`/api/profile?email=${encodeURIComponent(userEmail)}`);
          if (response.ok) {
            const user = await response.json();
            const formattedUser = {
              ...user,
              date: user.date ? dayjs(user.date) : undefined
            };
            form.setFieldsValue(formattedUser);
            setInitialValues(formattedUser);
            setAvatar(user.avatar || '');
            setIsDirty(false);
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
        messageApi.error('Не удалось загрузить данные профиля');
      }
    };

    fetchCurrentUser();
  }, [open, form, resetForm, messageApi]);

  const handleValuesChange = useCallback(() => {
    const currentValues = form.getFieldsValue();
    const hasChanges = Object.keys(currentValues).some(
      key => JSON.stringify(currentValues[key as keyof UserData]) !==
        JSON.stringify(initialValues[key as keyof UserData])
    );
    setIsDirty(hasChanges);
  }, [initialValues, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await onEditProfile(values);
    } catch (error) {
      messageApi.error('Пожалуйста, заполните все обязательные поля');
    } finally {
      setLoading(false);
    }
  };

  const onEditProfile = async (values: UserData) => {
    try {
      const formattedValues = {
        ...values,
        date: values.date?.format('YYYY-MM-DD'),
        avatar: avatar // Добавляем текущий аватар
      };

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedValues),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      messageApi.success('Данные успешно сохранены!');

      // Обновляем данные в родительском компоненте
      if (onUserUpdate) {
        onUserUpdate(data.user);
      }

      setIsDirty(false);
      onClose();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      if (error instanceof Error) {
        messageApi.error(error.message);
      } else {
        messageApi.error('Неизвестная ошибка при сохранении данных');
      }
    }
  };

  const handleChange: UploadProps['onChange'] = async (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }

    if (info.file.status === 'done') {
      try {
        const formData = new FormData();
        formData.append('avatar', info.file.originFileObj as Blob);
        formData.append('email', localStorage.getItem('userEmail') || '');

        const response = await fetch('/api/upload-avatar', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setAvatar(data.avatarUrl);
          setIsDirty(true);
          message.success('Аватар успешно обновлен');

          // Обновляем данные в родительском компоненте
          if (onUserUpdate) {
            onUserUpdate(data.user);
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки аватара:', error);
        message.error('Не удалось загрузить аватар');
      } finally {
        setLoading(false);
      }
    }
  };

  const beforeUpload = (file: RcFile) => {
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
  };

  const uploadProps: UploadProps = {
    name: 'avatar',
    multiple: false,
    showUploadList: false,
    beforeUpload,
    onChange: handleChange,
    accept: 'image/*',
  };

  const handleCloseAttempt = () => {
    if (isDirty) {
      setConfirmVisible(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = (shouldClose: boolean) => {
    setConfirmVisible(false);
    if (shouldClose) {
      onClose();
    }
  };

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
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
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
        <Form
          layout="vertical"
          form={form}
          onValuesChange={handleValuesChange}
        >
          <Divider orientation="left">Аватар</Divider>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <Avatar
              size={72}
              src={avatar}
              // src={avatar || '/images/orig.webp'}
              icon={<UserOutlined style={{ fontSize: '24px' }}/>}
              style={{ 
                backgroundColor: '#1677ff',
              }}
              onError={() => false}
              // onError={() => {
              //   setAvatar('/images/orig.webp');
              //   return false;
              // }}
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
              <Form.Item
                name="name"
                label="Имя"
                rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
              >
                <Input placeholder="Введите имя" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="middle_name"
                label="Отчество"
              >
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
                rules={[{
                  required: true,
                  message: 'Пожалуйста, введите email',
                  type: 'email'
                }]}
              >
                <Input placeholder="Введите email" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Роль в системе"
              >
                <Input placeholder="User" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="number"
                label="Табельный номер"
                rules={[{ required: true, message: 'Пожалуйста, введите табельный номер' }]}
              >
                <Input placeholder="Введите табельный номер" />
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
              <Form.Item
                name="date"
                label="Дата рождения"
              >
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