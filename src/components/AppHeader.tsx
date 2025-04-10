'use client';

import { Typography, Image, Space, Badge } from 'antd';
import { useRouter } from 'next/navigation';
import { Layout, theme, Dropdown } from 'antd';
import Link from 'next/link';
import { UserOutlined, BellOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import React from 'react';
import type { MenuProps } from 'antd';

const { Header } = Layout;

const { Text } = Typography;

export default function AppHeader() {
  const router = useRouter();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  const onClick = () => {
    router.replace('/all');
  };

  const itemsNotif: MenuProps['items'] = [
    {
      key: '1',
      label: <a onClick={onClick}>Заявка №532 отправлена на согласование владельцу ИРС</a>,
    },
    {
      key: '2',
      label: <a onClick={onClick}>Заявка №531 отклонена</a>,
    },
    {
      key: '3',
      label: <a onClick={onClick}>Заявка №530 пришла на согласование</a>,
    },
  ];

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'Мой аккаунт',
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: 'Профиль',
      icon: <UserOutlined />,
    },

    {
      key: '3',
      label: 'Настройки',
      icon: <SettingOutlined />,
    },
    {
      key: '4',
      label: <a onClick={handleLogout}>Выйти</a>,
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 28,
        }}
      >
        <Link href={'/'} style={{ display: 'flex' }}>
          <Image width={35} preview={false} src="/./favicon.ico" alt="RBAC" />
          <Typography.Title
            level={3}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 0 0 1rem',
              margin: 0,
              color: colorBgContainer,
            }}
          >
            RBAC
          </Typography.Title>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <Dropdown menu={{ items: itemsNotif }}>
            <Badge count={itemsNotif.length}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <BellOutlined style={{ color: colorBgContainer, fontSize: 24 }} />
                </Space>
              </a>
            </Badge>
          </Dropdown>

          <Dropdown menu={{ items }}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <Avatar
                  style={{ backgroundColor: '#1677ff' }}
                  shape="circle"
                  icon={<UserOutlined />}
                />
                <Text style={{ color: colorBgContainer }}>Иванов И.И.</Text>
              </Space>
            </a>
          </Dropdown>
        </div>
      </Header>
    </Layout>
  );
}
