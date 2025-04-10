'use client';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Card, message } from 'antd';
import { useRouter } from 'next/navigation';
import { Checkbox, Flex, Image, Typography } from 'antd';
import React from 'react';
import Link from 'next/link';

const LoginPage: React.FC = () => {
  const router = useRouter();

  const onFinish = (values: { username: string; password: string }) => {
    if (values.username === 'admin' && values.password === 'admin') {
      // message.success('Авторизация успешна!');
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/');
    } else {
      message.error('Неверные учетные данные!');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Image width={35} preview={false} src="/./favicon.ico" alt="RBAC" />
        <Typography.Title
          level={1}
          style={{
            padding: '0 0 0 0.5rem',
            margin: 0,
            color: 'black',
          }}
        >
          RBAC
        </Typography.Title>
      </div>
      <Typography.Text
        type="secondary"
        style={{
          padding: '0 0 0 0.5rem',
          margin: '0 0 5rem 0',
          fontSize: '18px',
        }}
      >
        Система автоматизации доступа к корпоративным ресурсам
      </Typography.Text>

      <Card title="Авторизация">
        <Form
          name="normal_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          style={{ maxWidth: 360 }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Пожалуйста, введите логин!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Логин" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Пароль"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Войти
            </Button>
            или <Link href="/registration">Зарегистрироваться сейчас</Link>
          </Form.Item>

          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Запомнить меня</Checkbox>
              </Form.Item>
              <Link href="">Забыли пароль</Link>
            </Flex>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
