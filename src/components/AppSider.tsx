'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Layout, Menu, Spin } from 'antd';
import type { MenuProps } from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  ProfileOutlined,
  SyncOutlined,
  TableOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { useUser } from '@/components/UserContext';

type MenuItem = Required<MenuProps>['items'][number];

const getMenuItemsByRole = (role: string | undefined): MenuItem[] => {
  const common: MenuItem[] = [
    {
      key: 'edit',
      label: 'Изменения',
      icon: <SyncOutlined />,
      children: [
        { key: 'logs', label: 'Логирование', icon: <FileTextOutlined /> },
        { key: 'reports', label: 'Отчеты', icon: <ProfileOutlined /> },
      ],
    },
    {
      key: 'about',
      label: 'О системе',
      icon: <InfoCircleOutlined />,
      children: [
        { key: 'docs', label: 'Документы', icon: <FileTextOutlined /> },
        { key: 'video', label: 'Видео', icon: <VideoCameraOutlined /> },
        { key: 'updates', label: 'Объявления', icon: <ExclamationCircleOutlined /> },
      ],
    },
  ];

  const userItems: MenuItem[] = [
    { key: 'accesses', label: 'Мои доступы', icon: <CheckCircleOutlined /> },
    { key: 'outgoing', label: 'Мои заявки', icon: <ProfileOutlined /> },
    { key: 'resources', label: 'Системы', icon: <TableOutlined /> },
    { key: 'roles', label: 'Роли', icon: <UserOutlined /> },
  ];

  const adminItems: MenuItem[] = [
    {
      key: 'incoming',
      label: 'Входящие заявки',
      icon: <ProfileOutlined />,
    },
    {
      key: 'management',
      label: 'Управление',
      icon: <UserOutlined />,
      children: [
        { key: 'users', label: 'Пользователи', icon: <UserOutlined /> },
        { key: 'roles', label: 'Роли', icon: <UserOutlined /> },
        { key: 'resources', label: 'Системы', icon: <TableOutlined /> },
      ],
    },
  ];

  if (role === 'ADMIN') return [...adminItems, ...common];
  if (role === 'USER') return [...userItems, ...common];
  return [];
};

const findSelectedKey = (items: MenuItem[], pathname: string): string | null => {
  const lastSegment = pathname?.split('/').filter(Boolean).pop() || '';
  for (const item of items) {
    if (!item) continue;
    if (item.key === lastSegment) return item.key as string;
    if ('children' in item && item.children) {
      const found = findSelectedKey(item.children as MenuItem[], pathname);
      if (found) return found;
    }
  }
  return null;
};

const findOpenKey = (items: MenuItem[], selectedKey: string | null): string | null => {
  if (!selectedKey) return null;
  for (const item of items) {
    if (!item) continue; // защита от null
    if ('children' in item && item.children?.some((child) => child && child.key === selectedKey)) {
      return item.key as string;
    }
  }
  return null;
};

const AppSider: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useUser();

  const menuItems = useMemo(() => getMenuItemsByRole(user?.accessLevel), [user?.accessLevel]);
  const selectedKey = useMemo(() => findSelectedKey(menuItems, pathname), [menuItems, pathname]);
  const openKey = useMemo(() => findOpenKey(menuItems, selectedKey), [menuItems, selectedKey]);

  const handleClick: MenuProps['onClick'] = ({ key }) => {
    router.push(`/${key}`);
  };

  useEffect(() => {
    const active = document.activeElement as HTMLElement;
    if (active?.classList?.contains('ant-menu-item')) {
      active.blur();
    }
  }, []);

  if (isLoading) {
    return (
      <Layout.Sider width={240}>
        <div className="flex items-center justify-center h-full">
          <Spin />
        </div>
      </Layout.Sider>
    );
  }

  if (!user?.accessLevel) {
    return (
      <Layout.Sider width={240}>
        <div className="p-4">Доступ запрещен</div>
      </Layout.Sider>
    );
  }

  return (
    <Layout.Sider width={240}>
      <Menu
        mode="inline"
        selectedKeys={selectedKey ? [selectedKey] : []}
        defaultOpenKeys={openKey ? [openKey] : []}
        onClick={handleClick}
        style={{ height: '100%', borderRight: 0 }}
        items={menuItems}
      />
    </Layout.Sider>
  );
};

export default AppSider;

