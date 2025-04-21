'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Space, Modal, message } from 'antd';
import dayjs from 'dayjs';

interface ProfileProps {
  open: boolean;
  onClose: () => void;
}

interface UserData {
  name: string;
  surname: string;
  number: string;
  email: string;
  phone: string;
  role: string;
  date?: dayjs.Dayjs;
}

const Profile: React.FC<ProfileProps> = ({ open, onClose }) => {
  const [form] = Form.useForm<UserData>();
  const [initialValues, setInitialValues] = useState<UserData>({} as UserData);
  const [isDirty, setIsDirty] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];
  const [messageApi, contextHolder] = message.useMessage();

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
        date: values.date?.format('YYYY-MM-DD')
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Имя"
                rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
              >
                <Input placeholder="Введите имя" />
              </Form.Item>
            </Col>
            <Col span={12}>
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
                name="phone"
                label="Телефон"
                rules={[{ required: true, message: 'Пожалуйста, введите телефон' }]}
              >
                <Input placeholder="Введите телефон" />
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
                name="role"
                label="Роль в системе"
              >
                <Input placeholder="Введите роль" />
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