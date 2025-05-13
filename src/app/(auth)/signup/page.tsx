'use client';

import { Form, Input, Card, Button, message, Flex } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import AppTitleAuth from '@/components/AppTitleAuth';
import Link from 'next/link';
import '@ant-design/v5-patch-for-react-19';

interface FormValues {
  surname: string;
  name: string;
  middle_name: string;
  email: string;
  password: string;
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
      const response = await axios.post('http://localhost:3001/auth/register', {
        surname: values.surname,
        name: values.name,
        middle_name: values.middle_name,
        email: values.email,
        password: values.password,
      });

      console.log('Успешная регистрация:', response.data);
      messageApi.success('Регистрация прошла успешно!');
      setTimeout(() => router.push('/login'), 1500);
      form.resetFields();
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      if (axios.isAxiosError(error)) {
        messageApi.error(error.response?.data?.message || 'Ошибка при регистрации');
      } else {
        messageApi.error('Неизвестная ошибка');
      }
    }
  };

  return (
    <Flex vertical justify="center" align="center" style={{ height: '100vh' }} gap="middle">
      {contextHolder}
      <AppTitleAuth />
      <Card
        title="Регистрация"
        style={{ margin: '0 0 2rem 0', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
      >
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          style={{ minWidth: 500 }}
          scrollToFirstError
        >
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
    </Flex>
  );
};

export default Registration;

