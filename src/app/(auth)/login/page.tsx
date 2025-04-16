'use client';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Card, message } from 'antd';
import { useRouter } from 'next/navigation';
import { Checkbox, Flex, Image, Typography } from 'antd';
import React from 'react';
import Link from 'next/link';
import '@ant-design/v5-patch-for-react-19';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.username,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        messageApi.success('Авторизация успешна!');
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', values.username);
        router.push('/');
      } else {
        messageApi.error(data.error || 'Неверные учетные данные!');
      }
    } catch (error) {
      messageApi.error('Ошибка при авторизации');
      console.log(error);
    }
  };

  return (
    <Flex vertical justify="center" align="center" style={{ height: '100vh' }} gap="middle">
      {contextHolder}
      <Flex align="center" justify="center" style={{ marginBottom: '2rem' }}>
        <Image width={50} preview={false} src="/favicon.ico" alt="RBAC" />
        <Typography.Title
          level={2}
          style={{
            paddingLeft: '0.5rem',
            margin: 0,
            color: 'black',
          }}
        >
          Система автоматизации доступа к корпоративным ресурсам
        </Typography.Title>
      </Flex>

      <Card title="Авторизация">
        <Form
          name="normal_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          style={{ maxWidth: 360 }}
        >
          <Form.Item
            name="username"
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
            <Button type="primary" htmlType="submit" block style={{ marginBottom: '1rem' }}>
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

