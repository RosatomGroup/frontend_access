'use client';

import {
  Breadcrumb,
  Button,
  ConfigProvider,
  Form,
  Input,
  Layout,
  Modal,
  Select,
  theme,
  Typography,
} from 'antd';
import AppSider from '../../../components/AppSider';
import AppHeader from '../../../components/AppHeader';
import { PlusOutlined } from '@ant-design/icons';
import TableRole from '@/app/tables/RolesTable';
import ruRU from 'antd/locale/ru_RU';
import { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';

const { Header, Content } = Layout;
const { Option } = Select;

export default function IncomingRequest() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const systems = [
    { value: 'system1', label: 'Система 1' },
    { value: 'system2', label: 'Система 2' },
    { value: 'system3', label: 'Система 3' },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('Данные роли:', values);
        setIsModalOpen(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Ошибка валидации:', info);
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
                    title: 'Роли',
                  },
                ]}
              />
              <Typography.Title level={4}>Роли</Typography.Title>
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
                    Роли
                  </Typography.Title>
                  <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                    Добавить роль
                  </Button>
                </div>
                <ConfigProvider locale={ruRU}>
                  <TableRole />
                </ConfigProvider>
              </div>
            </Content>
          </Layout>
        </Layout>

        <Modal
          title="Добавить новую роль"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Сохранить"
          cancelText="Отмена"
          width={600}
        >
          <Form form={form} layout="vertical" autoComplete="off">
            <Form.Item
              name="name"
              label="Название роли"
              rules={[{ required: true, message: 'Пожалуйста, введите название роли' }]}
            >
              <Input placeholder="Введите название роли" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Описание роли"
              rules={[{ required: true, message: 'Пожалуйста, введите описание роли' }]}
            >
              <Input.TextArea rows={4} placeholder="Введите описание роли" />
            </Form.Item>
            <Form.Item
              name="system"
              label="Система"
              rules={[{ required: true, message: 'Пожалуйста, выберите систему' }]}
            >
              <Select placeholder="Выберите систему">
                {systems.map((system) => (
                  <Option key={system.value} value={system.value}>
                    {system.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="owner"
              label="Владелец роли"
              rules={[{ required: true, message: 'Пожалуйста, укажите владельца роли' }]}
            >
              <Input placeholder="Введите владельца роли" />
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </AuthGuard>
  );
}

