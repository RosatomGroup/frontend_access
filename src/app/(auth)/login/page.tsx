'use client';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Flex, Form, Input, message } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import '@ant-design/v5-patch-for-react-19';
import AppTitleAuth from '../../../components/AppTitleAuth';
import axios from 'axios';
import { useUser } from '@/components/UserContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState(false);
  const [form] = Form.useForm();
  const { refresh } = useUser();

  const handleSubmit = async (values: { email: string; password: string; remember: boolean }) => {
    try {
      setLoading(true);
      const normalizedEmail = values.email.toLowerCase().trim();
      await axios.post(
        `${API_BASE_URL}/auth/login`,
        {
          email: normalizedEmail,
          password: values.password,
          rememberMe: values.remember,
        },
        { withCredentials: true },
      );
      await refresh(); // обновляем пользователя в контексте
      messageApi.success('Вы вошли в систему!');
      router.push('/');
    } catch (error) {
      console.log('Ошибка авторизации:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          messageApi.error('Пользователь не найден или неверный пароль');
        } else if (error.response?.status === 400) {
          messageApi.error('Пароль должен быть не менее 8 символов');
        } else if (error.response?.status === 403) {
          messageApi.error('Доступ запрещен');
        } else {
          messageApi.error(error.response?.data?.message || 'Произошла ошибка авторизации');
        }
      } else {
        messageApi.error('Ошибка авторизации');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Flex
        justify="center"
        align="center"
        style={{ minHeight: '100vh', flexDirection: 'column' }}
        gap="middle"
      >
        <AppTitleAuth />
        <Card
          title="Авторизация"
          style={{ width: '100%', maxWidth: 360, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
        >
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item name="email" rules={[{ required: true, message: 'Введите email' }]}>
              <Input prefix={<UserOutlined style={{ color: '#0958d9' }} />} placeholder="Почта" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Введите пароль' }]}>
              <Input.Password
                prefix={<LockOutlined style={{ color: '#0958d9' }} />}
                placeholder="Пароль"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{ marginBottom: '1rem' }}
              >
                Войти
              </Button>
              или <Link href="/signup">Зарегистрироваться сейчас</Link>
            </Form.Item>

            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Запомнить меня</Checkbox>
              </Form.Item>
              <Link href="/reset">Изменить пароль</Link>
            </Flex>
          </Form>
        </Card>
      </Flex>
    </>
  );
};

export default LoginPage;

