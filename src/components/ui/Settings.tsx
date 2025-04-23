import React, { useState } from 'react';
import { Button, Modal, Form, Switch, Divider, message } from 'antd';
import type { SwitchChangeEventHandler } from 'antd/es/switch';

interface SettingsProps {
  open: boolean;
  onClose: () => void;
  currentAvatar?: string;
}

const Settings: React.FC<SettingsProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
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
      .then(() => {
        message.success('Настройки сохранены');
        onClose();
        setLoading(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Настройки"
      open={open}
      onOk={handleSave}
      onCancel={onClose}
      width={500}
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
      >
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