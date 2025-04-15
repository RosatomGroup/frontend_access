'use client';

import { Form, Input, Card } from 'antd';
import { Image, Typography } from 'antd';
import { Button, message } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@ant-design/v5-patch-for-react-19';

interface FormValues {
  username: string;
  email: string;
  password: string;
  confirm: string;
}

interface ApiResponse {
  error?: string;
  [key: string]: unknown;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const Registration: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: FormValues) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data: ApiResponse = await response.json();

      if (response.ok) {
        messageApi.success(
          `Регистрация прошла успешно!\nВы будете перенаправлены на страницу авторизации`,
        );
        setTimeout(() => {
          router.push('/login');
        }, 1500);
        form.resetFields();
      } else {
        messageApi.error(data.error || 'Ошибка при регистрации');
      }
    } catch (error) {
      messageApi.error('Ошибка при отправке данных');
      console.log(error);
    }
  };

  return (
    <>
      {contextHolder}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 0 2rem 0',
          }}
        >
          <Image width={50} preview={false} src="/./favicon.ico" alt="RBAC" />
          <Typography.Title
            level={2}
            style={{
              padding: '0 0 0 0.5rem',
              margin: 0,
              color: 'black',
            }}
          >
            Система автоматизации доступа к корпоративным ресурсам
          </Typography.Title>
        </div>

        <Card title="Регистрация" style={{ margin: '0 0 2rem 0' }}>
          <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            style={{ minWidth: 500 }}
            scrollToFirstError
          >
            <Form.Item
              label="Полное имя"
              name="username"
              rules={[{ required: true, message: 'Пожалуйста, введите ФИО' }]}
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

            {/* <Form.Item label="Captcha" extra="We must make sure that your are a human.">
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  name="captcha"
                  noStyle
                  rules={[{ required: true, message: 'Please input the captcha you got!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Button>Get captcha</Button>
              </Col>
            </Row>
          </Form.Item> */}

            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Зарегистрироваться
              </Button>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Link href="/login">Уже есть аккаунт?</Link>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default Registration;

