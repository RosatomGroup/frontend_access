'use client';

import { Form, Input, Button, notification } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import React, { useState } from 'react';
import { reqOutdata } from '@/app/reqOut';

interface FormReqOthersProps {
  onClose: () => void;
}

const FormReqOthers: React.FC<FormReqOthersProps> = ({ onClose }) => {
  const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  const openNotificationWithIcon = (type: 'success' | 'error') => {
    api[type]({
      message: 'Заявка успешно создана',
      description: 'Заявка на доступ для других пользователей отправлена',
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Формируем новую запись
      const newEntry = {
        id: reqOutdata.length + 1,
        name: `${values.lastName} ${values.firstName} ${values.middleName || ''}`.trim(),
        role: values.role,
        status: 'в работе',
        system: values.system,
      };

      // Добавляем в начало массива
      reqOutdata.unshift(newEntry);

      // Отправляем на сервер для сохранения
      const response = await fetch('/api/updateReqOut', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqOutdata),
      });

      if (response.ok) {
        openNotificationWithIcon('success');
        onClose();
      } else {
        openNotificationWithIcon('error');
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      layout="horizontal"
      initialValues={{ size: componentSize }}
      onValuesChange={onFormLayoutChange}
      size={componentSize as SizeType}
      style={{ maxWidth: 600 }}
    >
      {contextHolder}
      <Form.Item
        label="Фамилия"
        name="lastName"
        rules={[{ required: true, message: 'Пожалуйста, введите фамилию' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Имя"
        name="firstName"
        rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Отчество" name="middleName">
        <Input />
      </Form.Item>
      <Form.Item
        label="Роль"
        name="role"
        rules={[{ required: true, message: 'Пожалуйста, введите роль' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Почта"
        name="email"
        rules={[{ type: 'email', message: 'Пожалуйста, введите корректный email' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Система"
        name="system"
        rules={[{ required: true, message: 'Пожалуйста, введите систему' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" onClick={handleSubmit}>
          Отправить
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormReqOthers;