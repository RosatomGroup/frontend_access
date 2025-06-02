'use client';

import { Form, Input, Card, Button, message, Flex } from 'antd';
import AppTitleAuth from '@/components/AppTitleAuth';
import Link from 'next/link';
import '@ant-design/v5-patch-for-react-19';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLoadingComponent from '@/components/AppLoading';

interface FormValues {
  email: string;
  newPassword: string;
  confirm: string;
  token?: string;
}

const ResetPassword: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const [messageApi, contextHolder] = message.useMessage();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const t = searchParams.get('token');
    console.log('Токен из URL:', t);
    setToken(t);
  }, [searchParams]);

  const onFinish = async (values: FormValues) => {
    const normalizedEmail = values.email?.toLowerCase();
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (token) {
        const response = await axios.post(
          'http://localhost:3001/reset/confirm',
          {
            token,
            newPassword: values.newPassword,
          },
          { headers: { 'Content-Type': 'application/json' } },
        );

        if (response.status === 201) {
          messageApi.success('Пароль успешно изменён!');
          router.push('/login');
          form.resetFields();
          setToken(null);
        } else {
          messageApi.error(response.data.error || 'Ошибка при изменении пароля');
        }
      } else {
        const response = await axios.post(
          'http://localhost:3001/reset/request',
          { email: normalizedEmail },
          {
            validateStatus: (status) => status === 201 || status === 404,
          },
        );

        if (response.status === 201) {
          messageApi.success('Письмо с инструкциями отправлено на ваш email!');
          form.resetFields();
        } else if (response.status === 404) {
          messageApi.error('Пользователь с таким email не зарегистрирован');
        }
      }
    } catch (err) {
      messageApi.error('Произошла ошибка при отправке запроса');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      vertical
      justify="center"
      align="center"
      style={{ minHeight: '100vh', padding: '1rem' }}
      gap="middle"
    >
      {contextHolder}
      <AppLoadingComponent />

      <AppTitleAuth />

      <Card
        title={token ? 'Введите новый пароль' : 'Забыли пароль?'}
        style={{ width: '100%', maxWidth: 500, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
      >
        <Form form={form} name="reset" onFinish={onFinish} layout="vertical" scrollToFirstError>
          {!token && (
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
          )}
          {token && (
            <>
              <Form.Item
                name="newPassword"
                label="Новый пароль"
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
                dependencies={['newPassword']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Пожалуйста, подтвердите пароль!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Пароли не совпадают!'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} block>
              {token ? 'Сохранить пароль' : 'Отправить инструкции'}
            </Button>
          </Form.Item>
          <Form.Item>
            <Link href="/login">Войти в аккаунт</Link>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export default ResetPassword;

