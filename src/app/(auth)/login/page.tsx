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
          'http://localhost:3001/auth/login',
          {
            email: normalizedEmail,
            password: values.password,
            rememberMe: values.remember,
          },
          { withCredentials: true }
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
        <Flex justify="center" align="center" style={{ minHeight: '100vh' }}>
          <Card>
            <AppTitleAuth />
            <Form form={form} onFinish={handleSubmit} layout="vertical">
              <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Введите почту' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Почта" />
              </Form.Item>
              <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Введите пароль' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
              </Form.Item>
              <Form.Item name="remember" valuePropName="checked" initialValue={true}>
                <Checkbox>Запомнить меня</Checkbox>
              </Form.Item>
              <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                >
                  Войти
                </Button>
              </Form.Item>
              <Form.Item>
                <Link href="/register">или Зарегистрироваться сейчас</Link>
                <br />
                <Link href="/reset-password">Изменить пароль</Link>
              </Form.Item>
            </Form>
          </Card>
        </Flex>
      </>
  );
};

export default LoginPage;
