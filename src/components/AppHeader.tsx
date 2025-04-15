'use client';

import { Typography, Image, Space, Badge } from 'antd';
import { useRouter } from 'next/navigation';
import { Layout, theme, Dropdown, Modal } from 'antd';
import Link from 'next/link';
import { UserOutlined, BellOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { useState } from 'react';
import type { MenuProps } from 'antd';
import Profile from '@/components/ui/Profile';
import Settings from '@/components/ui/Settings';

const { Header } = Layout;
const { Text } = Typography;

export default function AppHeader() {
  const router = useRouter();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = () => {
    setLogoutModalOpen(false);
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  const onClick = () => {
    router.replace('/all');
  };

  const showProfile = () => {
    setProfileOpen(true);
  };

  const closeProfile = () => {
    setProfileOpen(false);
  };


  const showSettings = () => {
    setSettingsOpen(true);
  };

  const closeSettings = () => {
    setSettingsOpen(false);
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
      label: <a onClick={showProfile}>Профиль</a>,
      icon: <UserOutlined />,
    },
    {
      key: '3',
      label: <a onClick={showSettings}>Настройки</a>,
      icon: <SettingOutlined />,
    },
    {
      key: '4',
      label: <a onClick={() => setLogoutModalOpen(true)}>Выйти</a>,
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 25 }}>
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

      <Modal
        title="Подтверждение выхода"
        centered
        open={logoutModalOpen}
        onOk={handleLogout}
        onCancel={() => setLogoutModalOpen(false)}
        okText="Да"
        cancelText="Нет"
      >
        <p>Вы точно хотите выйти?</p>
      </Modal>

      <Profile open={profileOpen} onClose={closeProfile} />
      <Settings open={settingsOpen} onClose={closeSettings}/>
    </>
  );
}