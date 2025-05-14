'use client';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Card, message, Checkbox, Flex } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import '@ant-design/v5-patch-for-react-19';
import AppTitleAuth from '../../../components/AppTitleAuth';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);

      const response = await axios.post(
        'http://localhost:3001/auth/login',
        {
          email: values.email,
          password: values.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.data.access_token) {
        throw new Error('Нет токена в ответе');
      }

      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('userEmail', values.email);

      messageApi.success('Авторизация успешна!');

      router.push('/');
    } catch (error) {
      console.error('Ошибка авторизации:', error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Неверные учетные данные';
        messageApi.error(errorMessage);
      } else {
        messageApi.error('Ошибка при авторизации' + String(error));
      }
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values: { email: string; password: string }) => {
    handleSubmit(values);
  };

  return (
    <Flex vertical justify="center" align="center" style={{ height: '100vh' }} gap="middle">
      {contextHolder}
      <AppTitleAuth />

      <Card title="Авторизация" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <Form
          form={form}
          name="normal_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          style={{ maxWidth: 360 }}
        >
          <Form.Item
            name="email"
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
            <Input
              prefix={<UserOutlined className="site-form-item-icon" style={{ color: '#0958d9' }} />}
              placeholder="Почта"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" style={{ color: '#0958d9' }} />}
              type="password"
              placeholder="Пароль"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ marginBottom: '1rem' }}
              loading={loading}
              disabled={loading}
            >
              Войти
            </Button>
            или <Link href="/signup">Зарегистрироваться сейчас</Link>
          </Form.Item>

          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Запомнить меня</Checkbox>
              </Form.Item>
              <Link href="/reset">Изменить пароль</Link>
            </Flex>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export default LoginPage;

