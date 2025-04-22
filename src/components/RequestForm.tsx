'use client';

import { Form, Input, Select, Checkbox, Button } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { useEffect } from 'react';

interface FormValues {
  lastName: string;
  firstName: string;
  middleName?: string;
  email: string;
  system: string;
  role: string;
}

interface RequestFormProps {
  initialValues: {
    lastName: string;
    firstName: string;
    middleName?: string;
  };
  onFinish: (values: FormValues) => void;
  onFormLayoutChange: (size: { size: SizeType }) => void;
  componentSize: SizeType;
  availableSystems: string[];
  filteredRoles: { description: string; applicationName: string }[];
  isLoading: boolean;
  isRequestForOtherUser: boolean;
  onCheckboxChange: (checked: boolean) => void;
  onInputClick: () => void;
  onSystemChange: (system: string) => void;
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
    onFormLayoutChange,
    componentSize,
    availableSystems,
    filteredRoles,
    isLoading,
    isRequestForOtherUser,
    onCheckboxChange,
    onInputClick,
    onSystemChange,
  }: RequestFormProps) {
    const [form] = Form.useForm<FormValues>();
  
    // Устанавливаем начальные значения
    useEffect(() => {
      form.setFieldsValue({
        lastName: initialValues.lastName,
        firstName: initialValues.firstName,
        middleName: initialValues.middleName
      });
    }, [form, initialValues]);

  const filterOption = (inputValue: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(inputValue.toLowerCase());

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ size: componentSize }}
      onValuesChange={onFormLayoutChange}
      onFinish={onFinish}
      size={componentSize as SizeType}
    >
      <Form.Item
        label="Фамилия"
        name="lastName"
        rules={[{ required: true, message: 'Пожалуйста, введите фамилию' }]}
      >
        <Input 
          style={inputStyles} 
          disabled={!isRequestForOtherUser} 
          onClick={onInputClick}
        />
      </Form.Item>
      <Form.Item
        label="Имя"
        name="firstName"
        rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
      >
        <Input 
          style={inputStyles} 
          disabled={!isRequestForOtherUser} 
          onClick={onInputClick}
        />
      </Form.Item>
      <Form.Item label="Отчество" name="middleName">
        <Input 
          style={inputStyles} 
          disabled={!isRequestForOtherUser} 
          onClick={onInputClick}
        />
      </Form.Item>

      <Form.Item>
        <Checkbox 
          checked={isRequestForOtherUser}
          onChange={e => onCheckboxChange(e.target.checked)}
        >
          Подать заявку за другого пользователя
        </Checkbox>
      </Form.Item>

      <Form.Item
        label="Электронная почта"
        name="email"
        rules={[
          { required: true, message: 'Пожалуйста, введите email' },
          { type: 'email', message: 'Пожалуйста, введите корректный email' }
        ]}
      >
        <Input style={inputStyles} />
      </Form.Item>
      <Form.Item
        label="Система"
        name="system"
        rules={[{ required: true, message: 'Пожалуйста, выберите систему' }]}
      >
        <Select
          showSearch
          placeholder="Выберите систему"
          optionFilterProp="children"
          loading={isLoading}
          filterOption={filterOption}
          options={availableSystems.map(system => ({
            value: system,
            label: system,
          }))}
          onChange={onSystemChange}
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
          placeholder={form.getFieldValue('system') ? "Выберите роль" : "Сначала выберите систему"}
          optionFilterProp="children"
          loading={isLoading}
          filterOption={filterOption}
          options={filteredRoles.map(role => ({
            value: role.description,
            label: role.description,
          }))}
          disabled={!form.getFieldValue('system')}
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