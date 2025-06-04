'use client';

import { Form, Input, Select, Checkbox, Button, FormInstance } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { useEffect, useState } from 'react';

interface BackendResource {
  id: number;
  name: string;
  description: string;
  link?: string;
  owner: string;
}

interface BackendRole {
  id: number;
  name: string;
  description: string;
  resourceId: number;
  resourceName: string;
}

interface FormValues {
  lastName: string;
  firstName: string;
  middleName: string;
  email: string;
  system: number;
  role: number;
}

interface ChangedValues {
  lastName?: string;
  firstName?: string;
  middleName?: string;
  email?: string;
  system?: number;
  role?: number;
}

interface RequestFormProps {
  initialValues: {
    lastName: string;
    firstName: string;
    middleName: string;
    email: string;
  };
  onFinish: (values: FormValues) => void;
  onFormLayoutChange?: (size: { size: SizeType }) => void;
  onValuesChange?: (changedValues: ChangedValues, allValues?: FormValues) => void;
  componentSize: SizeType;
  availableSystems: BackendResource[];
  filteredRoles: BackendRole[];
  isLoading: boolean;
  isRequestForOtherUser: boolean;
  onCheckboxChange: (checked: boolean) => void;
  onInputClick?: () => void;
  onSystemChange: (systemId: number) => void;
  form?: FormInstance;
}

const inputStyles = {
  transition: 'all 0.3s',
  ':hover': {
    borderColor: '#40a9ff',
  },
  ':focus': {
    borderColor: '#40a9ff',
    boxShadow: '0 0 0 4px rgba(24, 144, 255, 0.2)',
    outline: 'none',
  },
};

export function RequestForm({
  initialValues,
  onFinish,
  onValuesChange = () => {},
  componentSize,
  availableSystems,
  filteredRoles,
  isLoading,
  isRequestForOtherUser,
  onCheckboxChange,
  onInputClick = () => {},
  onSystemChange,
  form: propForm,
}: RequestFormProps) {
  const [internalForm] = Form.useForm();
  const form = propForm || internalForm;

  const [selectedSystem, setSelectedSystem] = useState<number | null>(null);

  useEffect(() => {
    form.setFieldsValue({
      ...initialValues,
      middleName: initialValues.middleName || '',
    });
  }, [form, initialValues]);

  const handleSystemChange = (value: number) => {
    setSelectedSystem(value);
    onSystemChange(value);
    form.setFieldsValue({ role: undefined });
  };

  const handleValuesChange = (changedValues: ChangedValues, allValues: FormValues) => {
    onValuesChange(changedValues, allValues);
  };

  const filterOption = (inputValue: string, option?: { label: string; value: number }) =>
    (option?.label ?? '').toLowerCase().includes(inputValue.toLowerCase());

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        size: componentSize,
        ...initialValues,
        middleName: initialValues.middleName || '',
      }}
      onValuesChange={handleValuesChange}
      onFinish={onFinish}
      size={componentSize as SizeType}
    >
      <Form.Item
        label="Фамилия"
        name="lastName"
        rules={[{ required: true, message: 'Пожалуйста, введите фамилию' }]}
      >
        <Input style={inputStyles} disabled={!isRequestForOtherUser} onClick={onInputClick} />
      </Form.Item>

      <Form.Item
        label="Имя"
        name="firstName"
        rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
      >
        <Input style={inputStyles} disabled={!isRequestForOtherUser} onClick={onInputClick} />
      </Form.Item>

      <Form.Item label="Отчество" name="middleName">
        <Input style={inputStyles} disabled={!isRequestForOtherUser} onClick={onInputClick} />
      </Form.Item>

      <Form.Item>
        <Checkbox
          checked={isRequestForOtherUser}
          onChange={(e) => onCheckboxChange(e.target.checked)}
        >
          Подать заявку за другого пользователя
        </Checkbox>
      </Form.Item>

      <Form.Item
        label="Электронная почта"
        name="email"
        rules={[
          { required: true, message: 'Пожалуйста, введите email' },
          { type: 'email', message: 'Пожалуйста, введите корректный email' },
        ]}
      >
        <Input style={inputStyles} disabled={!isRequestForOtherUser} />
      </Form.Item>

      <Form.Item
        label="Система"
        name="system"
        rules={[{ required: true, message: 'Пожалуйста, выберите систему' }]}
      >
        <Select
          showSearch
          placeholder="Выберите систему"
          loading={isLoading}
          filterOption={filterOption}
          options={availableSystems.map((system) => ({
            value: system.id,
            label: system.name,
          }))}
          onChange={handleSystemChange}
          style={inputStyles}
        />
      </Form.Item>

      <Form.Item
        label="Роль"
        name="role"
        rules={[{ required: true, message: 'Пожалуйста, выберите роль' }]}
      >
        <Select
          showSearch
          placeholder={selectedSystem ? 'Выберите роль' : 'Сначала выберите систему'}
          loading={isLoading}
          filterOption={filterOption}
          options={filteredRoles.map((role) => ({
            value: role.id,
            label: role.name,
          }))}
          disabled={!selectedSystem || filteredRoles.length === 0}
          style={inputStyles}
        />
      </Form.Item>

      <Form.Item style={{ textAlign: 'center', marginTop: '24px' }}>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            padding: '8px 24px',
            height: 'auto',
            fontSize: '16px',
          }}
        >
          Отправить
        </Button>
      </Form.Item>
    </Form>
  );
}
