// 'use client';

// import { Form, Input, Button, notification, Select, Checkbox, CheckboxChangeEvent } from 'antd';
// import type { SizeType } from 'antd/es/config-provider/SizeContext';
// import React, { useState, useEffect } from 'react';
// import { reqOutdata } from '@/app/reqOut';
// import rolesData from '@/app/roles.json';

// interface FormReqOthersProps {
//   onClose: () => void;
// }

// interface RoleItem {
//   description: string;
//   applicationName: string;
// }

// interface RolesData {
//   items: RoleItem[];
// }

// const FormReqOthers: React.FC<FormReqOthersProps> = ({ onClose }) => {
//   const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
//   const [form] = Form.useForm();
//   const [api, contextHolder] = notification.useNotification();
//   const [loading, setLoading] = useState(false);
//   const [systems, setSystems] = useState<string[]>([]);
//   const [roles, setRoles] = useState<RoleItem[]>([]);
//   const [filteredRoles, setFilteredRoles] = useState<RoleItem[]>([]);
//   const [isOtherUser, setIsOtherUser] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     const typedRolesData = rolesData as RolesData;
//     const items = typedRolesData?.items || [];

//     const uniqueSystems = Array.from(
//       new Set(items.map(item => item.applicationName))
//     ).sort((a, b) => a.localeCompare(b));

//     setSystems(uniqueSystems);
//     setRoles(items);
//     setLoading(false);

//     // Устанавливаем значения по умолчанию
//     form.setFieldsValue({
//       lastName: 'Иванов',
//       firstName: 'Иван',
//       middleName: 'Иванович'
//     });
//   }, [form]);

//   const handleSystemChange = (systemName: string) => {
//     const rolesForSystem = roles.filter(
//       role => role.applicationName === systemName
//     );
//     setFilteredRoles(rolesForSystem);
//     form.setFieldsValue({ role: undefined });
//   };

//   const handleCheckboxChange = (e: CheckboxChangeEvent) => {
//     setIsOtherUser(e.target.checked);
//     if (!e.target.checked) {
//       form.setFieldsValue({
//         lastName: 'Иванов',
//         firstName: 'Иван',
//         middleName: 'Иванович'
//       });
//     }
//   };

//   const handleInputClick = () => {
//     if (!isOtherUser) {
//       setIsOtherUser(true);
//     }
//   };

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
//         submissionTime: new Date().toISOString(),
//         email: values.email
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

//   const filterOption = (input: string, option?: { label: string; value: string }) =>
//     (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

//   // Оригинальные стили для инпутов
//   const inputStyles = {
//     transition: 'all 0.3s',
//     ':hover': {
//       borderColor: '#40a9ff',
//     },
//     ':focus': {
//       borderColor: '#40a9ff',
//       boxShadow: '0 0 0 4px rgba(24, 144, 255, 0.2)',
//       outline: 'none',
//     },
//   };

//   return (
//     <div style={{ maxWidth: '100%', margin: '0 50px' }}>
//       {contextHolder}
//       <Form
//         form={form}
//         layout="vertical"
//         initialValues={{ size: componentSize }}
//         onValuesChange={onFormLayoutChange}
//         size={componentSize as SizeType}
//       >
//         <Form.Item
//           label="Фамилия"
//           name="lastName"
//           rules={[{ required: true, message: 'Пожалуйста, введите фамилию' }]}
//         >
//           <Input 
//             style={inputStyles} 
//             disabled={!isOtherUser} 
//             onClick={handleInputClick}
//           />
//         </Form.Item>
//         <Form.Item
//           label="Имя"
//           name="firstName"
//           rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
//         >
//           <Input 
//             style={inputStyles} 
//             disabled={!isOtherUser} 
//             onClick={handleInputClick}
//           />
//         </Form.Item>
//         <Form.Item label="Отчество" name="middleName">
//           <Input 
//             style={inputStyles} 
//             disabled={!isOtherUser} 
//             onClick={handleInputClick}
//           />
//         </Form.Item>

//         <Form.Item>
//           <Checkbox 
//             checked={isOtherUser}
//             onChange={handleCheckboxChange}
//           >
//             Подать заявку за другого пользователя
//           </Checkbox>
//         </Form.Item>

//         <Form.Item
//           label="Почта"
//           name="email"
//           rules={[
//             { required: true, message: 'Пожалуйста, введите email' },
//             { type: 'email', message: 'Пожалуйста, введите корректный email' }
//           ]}
//         >
//           <Input style={inputStyles} />
//         </Form.Item>
//         <Form.Item
//           label="Система"
//           name="system"
//           rules={[{ required: true, message: 'Пожалуйста, выберите систему' }]}
//         >
//           <Select
//             showSearch
//             placeholder="Выберите систему"
//             optionFilterProp="children"
//             loading={loading}
//             filterOption={filterOption}
//             options={systems.map(system => ({
//               value: system,
//               label: system,
//             }))}
//             onChange={handleSystemChange}
//             style={inputStyles}
//           />
//         </Form.Item>
//         <Form.Item
//           label="Роль"
//           name="role"
//           rules={[{ required: true, message: 'Пожалуйста, выберите роль' }]}
//         >
//           <Select
//             showSearch
//             placeholder={form.getFieldValue('system') ? "Выберите роль" : "Сначала выберите систему"}
//             optionFilterProp="children"
//             loading={loading}
//             filterOption={filterOption}
//             options={filteredRoles.map(role => ({
//               value: role.description,
//               label: role.description,
//             }))}
//             disabled={!form.getFieldValue('system')}
//             style={inputStyles}
//           />
//         </Form.Item>
//         <Form.Item style={{ textAlign: 'center', marginTop: '24px' }}>
//           <Button 
//             type="primary" 
//             onClick={handleSubmit}
//             style={{
//               padding: '8px 24px',
//               height: 'auto',
//               fontSize: '16px',
//             }}
//           >
//             Отправить
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default FormReqOthers;
// src/components/FormReqOthers.tsx
'use client';

import { Form, Input, Button, notification, Select, Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import React, { useState, useEffect } from 'react';
import { reqOutdata } from '@/app/reqOut';
import rolesData from '@/app/roles.json';

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
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [availableSystems, setAvailableSystems] = useState<string[]>([]);
  const [allRoles, setAllRoles] = useState<RoleItem[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<RoleItem[]>([]);
  const [isRequestForOtherUser, setIsRequestForOtherUser] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const typedRolesData = rolesData as RolesData;
    const roleItems = typedRolesData?.items || [];

    const uniqueSystems = Array.from(
      new Set(roleItems.map(item => item.applicationName))
    ).sort((firstSystem, secondSystem) => firstSystem.localeCompare(secondSystem));

    setAvailableSystems(uniqueSystems);
    setAllRoles(roleItems);
    setIsLoading(false);

    form.setFieldsValue({
      lastName: 'Иванов',
      firstName: 'Иван',
      middleName: 'Иванович'
    });
  }, [form]);

  const handleSystemChange = (selectedSystem: string) => {
    const rolesForSelectedSystem = allRoles.filter(
      role => role.applicationName === selectedSystem
    );
    setFilteredRoles(rolesForSelectedSystem);
    form.setFieldsValue({ role: undefined });
  };

  const handleCheckboxChange = (event: CheckboxChangeEvent) => {
    setIsRequestForOtherUser(event.target.checked);
    if (!event.target.checked) {
      form.setFieldsValue({
        lastName: 'Иванов',
        firstName: 'Иван',
        middleName: 'Иванович'
      });
    }
  };

  const handleInputClick = () => {
    if (!isRequestForOtherUser) {
      setIsRequestForOtherUser(true);
    }
  };

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();
      
      const newRequest = {
        id: reqOutdata.length + 1,
        name: `${formValues.lastName} ${formValues.firstName} ${formValues.middleName || ''}`.trim(),
        requestSubject: "Предоставить доступ",
        role: formValues.role,
        status: 'в работе',
        system: formValues.system,
        submissionTime: new Date().toISOString(),
        email: formValues.email
      };

      reqOutdata.unshift(newRequest);

      const response = await fetch('/api/updateReqOut', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqOutdata),
      });

      if (response.ok) {
        notificationApi.success({
          message: 'Заявка успешно создана',
          description: 'Заявка на доступ для других пользователей отправлена',
        });
        onClose();
      } else {
        notificationApi.error({
          message: 'Ошибка',
          description: 'Не удалось сохранить заявку',
        });
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const filterOption = (inputValue: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(inputValue.toLowerCase());

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

  return (
    <div style={{ maxWidth: '100%', margin: '0 50px' }}>
      {notificationContextHolder}
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
          <Input 
            style={inputStyles} 
            disabled={!isRequestForOtherUser} 
            onClick={handleInputClick}
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
            onClick={handleInputClick}
          />
        </Form.Item>
        <Form.Item label="Отчество" name="middleName">
          <Input 
            style={inputStyles} 
            disabled={!isRequestForOtherUser} 
            onClick={handleInputClick}
          />
        </Form.Item>

        <Form.Item>
          <Checkbox 
            checked={isRequestForOtherUser}
            onChange={handleCheckboxChange}
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