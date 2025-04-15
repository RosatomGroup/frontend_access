'use client';

import React from 'react';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';
import { useEffect } from 'react';

const { Option } = Select;

interface ProfileProps {
  open: boolean;
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ open, onClose }) => {

  const [form] = Form.useForm();

  useEffect(() => {
    // данные пользователя
    const userData = {
      name: 'Иван',
      surname: 'Иванов',
      number: '12345678',
      email: 'user@user.ru',
      phone: '2-56-34',
      role: 'user'
      // ... другие поля
    };
    
    form.setFieldsValue(userData);
  }, [form]);


  return (
    <Drawer
      title="Профиль пользователя"
      width={720}
      onClose={onClose}
      open={open}
      maskClosable={false}
      keyboard={false}
      styles={{
        body: {
          paddingBottom: 80,
        },
      }}
      extra={
        <Space>
          <Button onClick={onClose}>Отмена</Button>
          <Button onClick={onClose} type="primary">
            Сохранить
          </Button>
        </Space>
      }
    >
      <Form layout="vertical" hideRequiredMark form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Имя"
              rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
            >
              <Input placeholder="Введите имя" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="surname"
              label="Фамилия"
              rules={[{ required: true, message: 'Пожалуйста, введите фамилию' }]}
            >
              <Input placeholder="Введите фамилию" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Пожалуйста, введите email' }]}
            >
              <Input placeholder="Введите email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Телефон"
              rules={[{ required: true, message: 'Пожалуйста, введите телефон' }]}
            >
              <Input placeholder="Введите телефон" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="number"
              label="Табельный номер"
              rules={[{ required: true, message: 'Пожалуйста, введите табельный номер' }]}
            >
              <Input placeholder="Введите табельный номер" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="role"
              label="Роль в системе"
              // rules={[{ required: true, message: 'Пожалуйста, введите табельный номер' }]}
            >
              <Input placeholder="Введите табельный номер" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default Profile;