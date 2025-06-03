'use client';

import type { MenuProps } from 'antd';
import {
  Avatar,
  Badge,
  Dropdown,
  Image,
  Layout,
  message,
  Modal,
  Space,
  theme,
  Typography,
} from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BellOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import Profile from '@/components/ui/Profile';
import Settings from '@/components/ui/Settings';
import '@ant-design/v5-patch-for-react-19';
import axios from 'axios';
import api from '@/api/axios.config';
import { User } from '../types/user';
import { useUser } from './UserContext';

const { Header } = Layout;
const { Text } = Typography;

interface Notification {
  id: number;
  requestId: number;
  message: string;
  status: string;
  read?: boolean;
}

export default function AppHeader() {
  const router = useRouter();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Используем контекст пользователя
  const { user, isLoading, refresh } = useUser(); // <-- Изменено: user, isLoading и refresh из контекста
  // const [currentUser, setCurrentUser] = useState<User | null>(null); // <-- УДАЛЕНО
  console.log(user);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const formatUserName = useCallback(
    (user: User | null) => {
      if (!user) return 'Гость';
      return user.surname && user.name && user.middleName
        ? `${user.surname} ${user.name[0]}.${user.middleName[0]}.`
        : user.surname && user.name
          ? `${user.surname} ${user.name[0]}.`
          : user.name || (user.email ? user.email.split('@')[0] : 'Гость');
    },
    [user],
  );

  const updateUserData = useCallback(() => {
    refresh();
  }, [refresh]);

  const handleLogout = async () => {
    setLogoutModalOpen(false);
    try {
      await api.post('/auth/logout'); // Используем api из axios.config
      // После успешного выхода, очищаем данные пользователя в контексте
      // UserContext не имеет setUser напрямую, но refresh() после logout
      // должен привести к получению null пользователя при следующем запросе /auth/me
      refresh(); // Принудительно обновляем данные пользователя в контексте (получим null)
      router.push('/login');
      // router.refresh(); // Может быть не нужен, если Next.js Router справляется с редиректом
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
      message.error('Ошибка при выходе из системы.');
    }
  };

  // const onClick = () => {
  //     router.replace('/all');
  // };

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

  const loadNotifications = useCallback(async () => {
    // Загружаем уведомления только если user доступен и не в состоянии загрузки
    if (!user || isLoading) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      const response = await api.get('/notifications', {
        params: { email: user.email }, // Используем email из user-объекта контекста
      });
      const data = response.data;
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.read).length);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message);
        if (error.response && error.response.status === 401) {
          // Если 401, это означает, что токен устарел или недействителен.
          // Обновляем данные пользователя в контексте, что должно привести к null
          refresh();
          router.push('/login'); // Перенаправляем на страницу логина
        }
      } else {
        console.error('Unexpected error:', error);
      }
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, isLoading, refresh, router]); // Зависимости от user, isLoading и refresh

  useEffect(() => {
    // Запускаем загрузку уведомлений только если user загружен и доступен
    if (user && !isLoading) {
      loadNotifications();
      const interval = setInterval(() => {
        loadNotifications();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user, isLoading, loadNotifications]);

  const handleNotifDropdownOpen = async (open: boolean) => {
    if (open && user) {
      // Проверяем, что пользователь авторизован
      const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
      if (unreadIds.length > 0) {
        try {
          await api.post('/notifications/read-bulk', { ids: unreadIds });
          await loadNotifications();
        } catch (error) {
          message.error('Не удалось отметить уведомления как прочитанные');
          console.error(error);
        }
      }
    }
  };

  const itemsNotif: MenuProps['items'] = notifications.map((notif) => ({
    key: notif.id,
    label: <a style={notif.read ? {} : { fontWeight: 'bold' }}>{notif.message}</a>,
  }));

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

  // Отображаем лоадер или упрощенный заголовок, пока данные пользователя загружаются
  if (isLoading) {
    return (
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 28,
          backgroundColor: colorBgContainer,
        }}
      >
        <Typography.Title level={3} style={{ margin: 0, color: 'white' }}>
          Загрузка...
        </Typography.Title>
      </Header>
    );
  }

  // Если пользователь не аутентифицирован (user === null), показываем только ссылку для входа
  if (!user) {
    return (
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 28,
          backgroundColor: colorBgContainer,
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
        <Link href="/login">
          <Text style={{ color: colorBgContainer }}>Войти</Text>
        </Link>
      </Header>
    );
  }

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
            <Image width={35} preview={false} src="/./favicon.ico" alt="Логотип ИС ВЕКТОР" />
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
              ВЕКТОР
            </Typography.Title>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 25 }}>
            <Dropdown
              menu={{ items: itemsNotif }}
              onOpenChange={handleNotifDropdownOpen}
              trigger={['click']}
            >
              <Badge count={unreadCount}>
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
                    // Используем user из контекста
                    src={user?.avatarUrl} // <-- Использовать avatarUrl из UserData
                    icon={<UserOutlined style={{ fontSize: '20px' }} />}
                    style={{ backgroundColor: '#1677ff' }}
                    shape="circle"
                    onError={() => false}
                  />
                  <Text style={{ color: colorBgContainer }}>{formatUserName()}</Text>
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

      {/* Profile теперь должен принимать user из контекста, если ему нужны данные */}
      {/* И вызывать refresh из useUser() после обновления данных */}
      <Profile open={profileOpen} onClose={closeProfile} onUserUpdate={updateUserData} />
      <Settings open={settingsOpen} onClose={closeSettings} />
    </>
  );
}

