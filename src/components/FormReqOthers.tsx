// 'use client';

// import { Form, Input, Button, notification } from 'antd';
// import type { SizeType } from 'antd/es/config-provider/SizeContext';
// import React, { useState } from 'react';
// import { reqOutdata } from '@/app/reqOut';

// interface FormReqOthersProps {
//   onClose: () => void;
// }

// const FormReqOthers: React.FC<FormReqOthersProps> = ({ onClose }) => {
//   const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
//   const [form] = Form.useForm();
//   const [api, contextHolder] = notification.useNotification();

//   const onFormLayoutChange = ({ size }: { size: SizeType }) => {
//     setComponentSize(size);
//   };

//   const handleSubmit = async () => {
//     try {
//       const values = await form.validateFields();
      
//       const newEntry = {
//         id: reqOutdata.length + 1,
//         name: `${values.lastName} ${values.firstName} ${values.middleName || ''}`.trim(),
//         role: values.role,
//         status: 'в работе',
//         system: values.system,
//         submissionTime: new Date().toISOString() // Добавляем текущее время
//       };

//       reqOutdata.unshift(newEntry);

//       const response = await fetch('/api/updateReqOut', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(reqOutdata),
//       });

//       if (response.ok) {
//         api.success({
//           message: 'Заявка успешно создана',
//           description: 'Заявка на доступ для других пользователей отправлена',
//         });
//         onClose();
//       } else {
//         api.error({
//           message: 'Ошибка',
//           description: 'Не удалось сохранить заявку',
//         });
//       }
//     } catch (error) {
//       console.error('Validation failed:', error);
//     }
//   };

//   return (
//     <Form
//       form={form}
//       labelCol={{ span: 8 }}
//       wrapperCol={{ span: 16 }}
//       layout="horizontal"
//       initialValues={{ size: componentSize }}
//       onValuesChange={onFormLayoutChange}
//       size={componentSize as SizeType}
//       style={{ maxWidth: 600 }}
//     >
//       {contextHolder}
//       <Form.Item
//         label="Фамилия"
//         name="lastName"
//         rules={[{ required: true, message: 'Пожалуйста, введите фамилию' }]}
//       >
//         <Input />
//       </Form.Item>
//       <Form.Item
//         label="Имя"
//         name="firstName"
//         rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
//       >
//         <Input />
//       </Form.Item>
//       <Form.Item label="Отчество" name="middleName">
//         <Input />
//       </Form.Item>
//       <Form.Item
//         label="Роль"
//         name="role"
//         rules={[{ required: true, message: 'Пожалуйста, введите роль' }]}
//       >
//         <Input />
//       </Form.Item>
//       <Form.Item
//         label="Почта"
//         name="email"
//         rules={[{ type: 'email', message: 'Пожалуйста, введите корректный email' }]}
//       >
//         <Input />
//       </Form.Item>
//       <Form.Item
//         label="Система"
//         name="system"
//         rules={[{ required: true, message: 'Пожалуйста, введите систему' }]}
//       >
//         <Input />
//       </Form.Item>
//       <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
//         <Button type="primary" onClick={handleSubmit}>
//           Отправить
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// };

// export default FormReqOthers;
// FormReqOthers.tsx
'use client';

import { Form, Input, Button, notification, Select } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import React, { useState, useEffect } from 'react';
import { reqOutdata } from '@/app/reqOut';
import rolesData from '@/app/roles.json';

// const { Title } = Typography;

interface FormReqOthersProps {
  onClose: () => void;
}

interface RoleItem {
  description: string;
  applicationName: string;
}

interface RolesData {
  items: RoleItem[];
}

const FormReqOthers: React.FC<FormReqOthersProps> = ({ onClose }) => {
  const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [systems, setSystems] = useState<string[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<RoleItem[]>([]);

  useEffect(() => {
    setLoading(true);
    const typedRolesData = rolesData as RolesData;
    const items = typedRolesData?.items || [];

    const uniqueSystems = Array.from(
      new Set(items.map(item => item.applicationName))
    ).sort((a, b) => a.localeCompare(b));

    setSystems(uniqueSystems);
    setRoles(items);
    setLoading(false);
  }, []);

  const handleSystemChange = (systemName: string) => {
    const rolesForSystem = roles.filter(
      role => role.applicationName === systemName
    );
    setFilteredRoles(rolesForSystem);
    form.setFieldsValue({ role: undefined });
  };

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const newEntry = {
        id: reqOutdata.length + 1,
        name: `${values.lastName} ${values.firstName} ${values.middleName || ''}`.trim(),
        role: values.role,
        status: 'в работе',
        system: values.system,
        submissionTime: new Date().toISOString(),
        email: values.email
      };

      reqOutdata.unshift(newEntry);

      const response = await fetch('/api/updateReqOut', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqOutdata),
      });

      if (response.ok) {
        api.success({
          message: 'Заявка успешно создана',
          description: 'Заявка на доступ для других пользователей отправлена',
        });
        onClose();
      } else {
        api.error({
          message: 'Ошибка',
          description: 'Не удалось сохранить заявку',
        });
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  // Стили для инпутов
  const inputStyles = {
    // borderRadius: '4px',
    // border: '1px solid #d9d9d9',
    // padding: '8px 11px',
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

  return (
    <div style={{ maxWidth: '100%', margin: '0 50px' }}>
      {contextHolder}
      {/* <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>
        Форма запроса для других
      </Title> */}
      <Form
        form={form}
        layout="vertical"
        initialValues={{ size: componentSize }}
        onValuesChange={onFormLayoutChange}
        size={componentSize as SizeType}
      >
        <Form.Item
          label="Фамилия"
          name="lastName"
          rules={[{ required: true, message: 'Пожалуйста, введите фамилию' }]}
        >
          <Input style={inputStyles} />
        </Form.Item>
        <Form.Item
          label="Имя"
          name="firstName"
          rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
        >
          <Input style={inputStyles} />
        </Form.Item>
        <Form.Item label="Отчество" name="middleName">
          <Input style={inputStyles} />
        </Form.Item>
        <Form.Item
          label="Почта"
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
            loading={loading}
            filterOption={filterOption}
            options={systems.map(system => ({
              value: system,
              label: system,
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
            placeholder={form.getFieldValue('system') ? "Выберите роль" : "Сначала выберите систему"}
            optionFilterProp="children"
            loading={loading}
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
            onClick={handleSubmit}
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
    </div>
  );
};

export default FormReqOthers;