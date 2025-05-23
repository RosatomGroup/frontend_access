'use client';

import {
  Breadcrumb,
  Button,
  ConfigProvider,
  Form,
  Input,
  Layout,
  Modal,
  theme,
  Typography,
} from 'antd';
import TableUser from '../../tables/UsersTable';
import AppSider from '../../../components/AppSider';
import AppHeader from '../../../components/AppHeader';
import { PlusOutlined } from '@ant-design/icons';
import ruRU from 'antd/locale/ru_RU';
import { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';

const { Header, Content } = Layout;

export default function IncomingRequest() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('Form values:', values);
        setIsModalOpen(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <AuthGuard>
      <Layout>
        <AppHeader />
        <Layout style={{ minHeight: '100vh' }}>
          <AppSider />
          <Layout>
            <Header style={{ paddingLeft: 16, background: colorBgContainer, height: '100px' }}>
              <Breadcrumb
                style={{ margin: '16px 0' }}
                items={[
                  {
                    title: 'Управление',
                  },
                  {
                    title: 'Пользователи',
                  },
                ]}
              />
              <Typography.Title level={4}>Пользователи</Typography.Title>
            </Header>
            <Content style={{ margin: '0 16px', paddingTop: '16px' }}>
              <div
                style={{
                  padding: 24,
                  minHeight: 360,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    Пользователи
                  </Typography.Title>
                  <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                    Добавить пользователя
                  </Button>
                </div>
                <ConfigProvider locale={ruRU}>
                  <TableUser />
                </ConfigProvider>
              </div>
            </Content>
          </Layout>
        </Layout>

        <Modal
          title="Добавить нового пользователя"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Сохранить"
          cancelText="Отмена"
        >
          <Form form={form} layout="vertical" autoComplete="off">
            <Form.Item
              name="username"
              label="Имя пользователя"
              rules={[{ required: true, message: 'Пожалуйста, введите имя пользователя' }]}
            >
              <Input placeholder="Введите имя пользователя" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Пожалуйста, введите email' },
                { type: 'email', message: 'Пожалуйста, введите корректный email' },
              ]}
            >
              <Input placeholder="Введите email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Пароль"
              rules={[{ required: true, message: 'Пожалуйста, введите пароль' }]}
            >
              <Input.Password placeholder="Введите пароль" />
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </AuthGuard>
  );
}
