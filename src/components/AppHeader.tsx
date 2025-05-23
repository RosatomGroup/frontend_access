'use client';
import { Typography, Image, Space, Badge } from 'antd';
import { useRouter } from 'next/navigation';
import { Layout, theme, Dropdown, Modal } from 'antd';
import Link from 'next/link';
import { UserOutlined, BellOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import type { MenuProps } from 'antd';
import Profile from '@/components/ui/Profile';
import Settings from '@/components/ui/Settings';
import dayjs from 'dayjs';
import '@ant-design/v5-patch-for-react-19';
import axios from 'axios';

const { Header } = Layout;
const { Text } = Typography;

interface User {
  email: string;
  name: string;
  surname: string;
  middle_name?: string;
  phone?: string;
  number?: string;
  role?: string;
  date?: dayjs.Dayjs;
  avatar?: string;
}

export default function AppHeader() {
  const router = useRouter();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const formatUserName = useCallback((user: User | null) => {
    if (!user) return 'Гость';
    return user.surname && user.name && user.middle_name
      ? `${user.surname} ${user.name[0]}.${user.middle_name[0]}.`
      : user.surname && user.name
        ? `${user.surname} ${user.name[0]}.`
        : user.name || (user.email ? user.email.split('@')[0] : 'Гость');
  }, []);

  const fetchUserData = useCallback(async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        const response = await fetch(`/api/profile?email=${encodeURIComponent(userEmail)}`);
        if (response.ok) {
          const user = await response.json();
          setCurrentUser(user);
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных пользователя:', error);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchUserData();
    }
  }, [fetchUserData]);

  const updateUserData = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const handleLogout = async () => {
    setLogoutModalOpen(false);
    try {
      await axios.post('http://localhost:3001/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('userEmail');
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    }
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
                    src={currentUser?.avatar}
                    // src={currentUser?.avatar || '/images/defaults.webp'}
                    icon={<UserOutlined style={{ fontSize: '20px' }} />}
                    style={{ backgroundColor: '#1677ff' }}
                    shape="circle"
                    onError={() => false}
                  />
                  <Text style={{ color: colorBgContainer }}>{formatUserName(currentUser)}</Text>
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

      <Profile open={profileOpen} onClose={closeProfile} onUserUpdate={updateUserData} />
      <Settings open={settingsOpen} onClose={closeSettings} />
    </>
  );
}

