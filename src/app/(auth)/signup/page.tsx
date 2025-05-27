'use client';

import { Form, Input, Card, Button, message, Flex } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import AppTitleAuth from '@/components/AppTitleAuth';
import Link from 'next/link';
import '@ant-design/v5-patch-for-react-19';
import React from 'react';

interface FormValues {
  surname: string;
  name: string;
  middleName: string;
  email: string;
  password: string;
}

const Registration: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: FormValues) => {
    try {
      setLoading(true);
      const normalizedEmail = values.email.toLowerCase().trim();

      const response = await axios.post(
        'http://localhost:3001/auth/register',
        {
          surname: values.surname,
          name: values.name,
          middleName: values.middleName,
          email: normalizedEmail,
          password: values.password,
        },
        { withCredentials: true },
      );

      messageApi.success(
        'Регистрация прошла успешно! Вы будете перенравлены на страницу авторизации',
      );
      setTimeout(() => router.push('/login'), 2500);
      form.resetFields();
    } catch (error) {
      console.log('Ошибка регистрации:', error);
      if (axios.isAxiosError(error)) {
        messageApi.error(error.response?.data?.message || 'Ошибка при регистрации');
      } else {
        messageApi.error('Неизвестная ошибка');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      vertical
      justify="center"
      align="center"
      style={{
        minHeight: '100vh',
        padding: '1rem',
      }}
      gap="middle"
    >
      {contextHolder}
      <AppTitleAuth />
      <Card
        title="Регистрация"
        style={{
          width: '100%',
          maxWidth: '500px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Form form={form} name="register" onFinish={onFinish} layout="vertical" scrollToFirstError>
          <Form.Item
            label="Фамилия"
            name="surname"
            rules={[{ required: true, message: 'Пожалуйста, введите фамилию' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Имя"
            name="name"
            rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Отчество"
            name="middle_name"
            rules={[{ required: false, message: 'Пожалуйста, введите отчество' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: 'Недействительный E-mail!',
              },
              {
                required: true,
                message: 'Пожалуйста, введите Ваш E-mail!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Пароль"
            rules={[
              { required: true, message: 'Пожалуйста, введите пароль!' },
              { min: 8, message: 'Пароль должен быть не менее 8 символов!' },
              {
                pattern: /[A-Z]/,
                message: 'Пароль должен содержать хотя бы одну заглавную букву!',
              },
              { pattern: /[0-9]/, message: 'Пароль должен содержать хотя бы одну цифру!' },
              {
                pattern: /[!@#$%^&*]/,
                message: 'Пароль должен содержать хотя бы один спецсимвол!',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Подтвердите пароль"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Пожалуйста, подтвердите пароль!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароли не совпадают!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              disabled={loading}
            >
              Зарегистрироваться
            </Button>
          </Form.Item>
          <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
            <Link href="/login">Уже есть аккаунт?</Link>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export default Registration;

