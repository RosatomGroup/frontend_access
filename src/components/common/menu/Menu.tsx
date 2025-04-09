"use client";

import React, { useState } from 'react';
import { MailOutlined, SettingOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import './Menu.module.scss';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: '1',
    icon: <MailOutlined />,
    label: 'Заявки',
    children: [
      { key: '11', label: 'Входящие' },
      { key: '12', label: 'Исходящие' },
      { key: '13', label: 'Все заявки' },
    ],
  },
  {
    key: '2',
    icon: <SettingOutlined />,
    label: 'Управление',
    children: [
      { key: '21', label: 'Пользователи' },
      { key: '22', label: 'Роли' },
      { key: '23', label: 'Система' },
    ],
  },
  {
    key: '3',
    icon: <WarningOutlined />,
    label: 'Изменения',
    children: [
      { key: '31', label: 'Логирование' },
      { key: '32', label: 'Отчёты' },
    ],
  },
  {
    key: '4',
    icon: <CheckCircleOutlined />,
    label: 'О системе',
    children: [
      { key: '41', label: 'Документы' },
      { key: '42', label: 'Видео' },
      { key: '43', label: 'Обновления' },
    ],
  },
];

const SideMenu: React.FC = () => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find(key => !openKeys.includes(key));
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  return (
    <Menu
      mode="inline"
      theme="light"
      openKeys={openKeys}
      selectedKeys={selectedKeys}
      onOpenChange={onOpenChange}
      onSelect={({ key }) => setSelectedKeys([key])}
      style={{ width: 200 }}
      items={items}
      className="custom-menu"
    />
  );
};

export default SideMenu;