import React, { useState } from 'react';
import { Button, Modal, Form, Input, Switch, Divider, Upload, Avatar, message } from 'antd';
import type { SwitchChangeEventHandler } from 'antd/es/switch';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import type { UploadProps, RcFile } from 'antd/es/upload';

interface SettingsProps {
  open: boolean;
  onClose: () => void;
  currentAvatar?: string;
}

const Settings: React.FC<SettingsProps> = ({ open, onClose, currentAvatar }) => {
  const [form] = Form.useForm();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [avatar, setAvatar] = useState<string | undefined>(currentAvatar);
  const [loading, setLoading] = useState(false);

  const handleNotificationsChange: SwitchChangeEventHandler = (checked) => {
    setNotificationsEnabled(checked);
  };

  const handleDarkModeChange: SwitchChangeEventHandler = (checked) => {
    setDarkModeEnabled(checked);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('Received values of form: ', { ...values, avatar });
        message.success('Настройки сохранены');
        onClose();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Вы можете загрузить только изображения!');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // В реальном приложении здесь должен быть URL от сервера
      const imageUrl = URL.createObjectURL(info.file.originFileObj as Blob);
      setAvatar(imageUrl);
      setLoading(false);
      message.success(`${info.file.name} успешно загружен`);
    }
    if (info.file.status === 'error') {
      setLoading(false);
      message.error(`${info.file.name} не удалось загрузить.`);
    }
  };

  const uploadProps: UploadProps = {
    name: 'avatar',
    multiple: false,
    showUploadList: false,
    beforeUpload,
    onChange: handleChange,
    customRequest: ({ file, onSuccess }) => {
      // Эмуляция загрузки на сервер
      setTimeout(() => {
        onSuccess?.('ok', new XMLHttpRequest());
      }, 1000);
    },
  };

  return (
    <Modal
      title="Настройки"
      open={open}
      onOk={handleSave}
      onCancel={onClose}
      width={600}
      maskClosable={false}
      keyboard={false}
      footer={[
        <Button key="back" onClick={onClose}>
          Отмена
        </Button>,
        <Button key="submit" type="primary" onClick={handleSave} loading={loading}>
          Сохранить
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          username: 'Иванов И.ИBB.',
          email: 'ivanov@example.com',
        }}
      >
        <Divider orientation="left">Аватар</Divider>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <Avatar
            size={64}
            src={avatar}
            icon={<UserOutlined />}
            style={{ backgroundColor: '#1677ff' }}
          />
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />} loading={loading}>
              Загрузить новое фото
            </Button>
          </Upload>
        </div>

        {/* Остальные разделы формы остаются без изменений */}
        <Divider orientation="left">Профиль</Divider>
        <Form.Item
          name="username"
          label="Имя пользователя"
          rules={[{ required: true, message: 'Пожалуйста, введите имя пользователя' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Пожалуйста, введите email' },
            { type: 'email', message: 'Пожалуйста, введите корректный email' },
          ]}
        >
          <Input />
        </Form.Item>

        <Divider orientation="left">Уведомления</Divider>
        <Form.Item label="Уведомления по email">
          <Switch checked={notificationsEnabled} onChange={handleNotificationsChange} />
        </Form.Item>

        <Divider orientation="left">Внешний вид</Divider>
        <Form.Item label="Темная тема">
          <Switch checked={darkModeEnabled} onChange={handleDarkModeChange} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Settings;