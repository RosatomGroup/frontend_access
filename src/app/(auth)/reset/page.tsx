'use client'; // Убедитесь, что это клиентский компонент

import { Form, Input, Card, Button, message, Flex, Spin } from 'antd';
import AppTitleAuth from '@/components/AppTitleAuth'; // Предполагаем, что этот компонент существует
import Link from 'next/link';
import '@ant-design/v5-patch-for-react-19'; // Оставлено, если это необходимо для Ant Design v5
import { useSearchParams } from 'next/navigation';
import axios from 'axios'; // Импортируем AxiosError для лучшей обработки ошибок
import { useState, useEffect, Suspense } from 'react'; // Добавлен Suspense
import { useRouter } from 'next/navigation';
import AppLoadingComponent from '@/components/AppLoading';

interface FormValues {
  email: string;
  newPassword: string;
  confirm: string;
  token?: string; // Токен может быть опциональным
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// Переименован компонент ResetPassword в ResetPasswordContent
const ResetPasswordContent: React.FC = () => {
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
    // Если токен есть, и emailFromUrl тоже есть, можно предзаполнить email
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl) {
      form.setFieldsValue({ email: emailFromUrl });
    }
  }, [searchParams, form]); // Добавлена зависимость form

  const onFinish = async (values: FormValues) => {
    const normalizedEmail = values.email?.toLowerCase();
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (token) {
        // Логика сброса пароля с токеном
        const response = await axios.post(
          `${API_BASE_URL}/reset/confirm`, // Использован API_BASE_URL
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
          // Обработка ошибок, если статус не 201
          const errorData = response.data;
          messageApi.error(errorData.error || 'Ошибка при изменении пароля');
        }
      } else {
        // Логика запроса на сброс пароля (отправка письма)
        const response = await axios.post(
          `${API_BASE_URL}/reset/request`, // Использован API_BASE_URL
          { email: normalizedEmail },
          {
            // validateStatus позволяет Axios не выбрасывать ошибку для 404
            validateStatus: (status) => status === 201 || status === 404,
          },
        );

        if (response.status === 201) {
          messageApi.success('Письмо с инструкциями отправлено на ваш email!');
          form.resetFields();
        } else if (response.status === 404) {
          messageApi.error('Пользователь с таким email не зарегистрирован');
        } else {
          // Обработка других неожиданных статусов
          const errorData = response.data;
          messageApi.error(errorData.error || 'Произошла ошибка при отправке запроса');
        }
      }
    } catch (err) {
      console.log(err);
      let errorMessage = 'Произошла ошибка при отправке запроса';
      if (axios.isAxiosError(err)) {
        // Обработка ошибок Axios (например, сетевые ошибки, таймауты)
        errorMessage = err.response?.data?.error || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      messageApi.error(errorMessage);
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
      <AppTitleAuth /> {/* Предполагается, что этот компонент существует */}
      <AppLoadingComponent />
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

// Оборачиваем компонент, использующий useSearchParams, в Suspense
const ResetPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p>Загрузка формы сброса пароля...</p>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPage;

