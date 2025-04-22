'use client';

import { Form, Input, Card } from 'antd';
import AppTitleAuth from '../../../components/AppTitleAuth';
import { Button, message, Flex } from 'antd';
import Link from 'next/link';
import '@ant-design/v5-patch-for-react-19';

interface FormValues {
  email: string;
  oldPassword: string;
  newPassword: string;
  confirm: string;
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

const ResetPassword: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: FormValues) => {
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        messageApi.success('Пароль успешно изменен!');
        form.resetFields();
      } else {
        messageApi.error(data.error || 'Ошибка при изменении пароля');
      }
    } catch (error) {
      messageApi.error('Ошибка при отправке данных');
      console.error(error);
    }
  };

  return (
    <Flex vertical justify="center" align="center" style={{ height: '100vh' }} gap="middle">
      {contextHolder}
      <AppTitleAuth />

      <Card
        title="Сброс пароля"
        style={{ margin: '0 0 2rem 0', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
      >
        <Form
          {...formItemLayout}
          form={form}
          name="reset"
          onFinish={onFinish}
          style={{ minWidth: 500 }}
          scrollToFirstError
        >
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
            name="oldPassword"
            label="Старый пароль"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите пароль!',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

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

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Сбросить пароль
            </Button>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Link href="/login">Войти в аккаунт</Link>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export default ResetPassword;

