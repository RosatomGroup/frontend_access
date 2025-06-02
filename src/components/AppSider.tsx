'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { Layout, Menu } from 'antd';
import {
  TableOutlined,
  ProfileOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const AppSider = ({ userRole = 'user' }) => { // userRole передается извне
  const router = useRouter();
  const pathname = usePathname();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const items = useMemo(() => {
    if (userRole === 'user') {
      return [
        {
          key: 'my-accesses',
          label: 'Мои доступы',
          icon: <ProfileOutlined />,
        },
        {
          key: 'my-requests',
          label: 'Мои заявки',
          icon: <TableOutlined />,
        },
        {
          key: 'systems',
          label: 'Системы',
          icon: <CheckCircleOutlined />,
        },
        {
          key: 'roles',
          label: 'Роли',
          icon: <WarningOutlined />,
        },
        {
          key: 'edit',
          label: 'Изменения',
          icon: <WarningOutlined />,
          children: [
            { key: 'logs', label: 'Логирование' },
            { key: 'reports', label: 'Отчеты' },
          ],
        },

        {
          key: 'about',
          label: 'О системе',
          icon: <CheckCircleOutlined />,
          children: [
            { key: 'docs', label: 'Документы' },
            { key: 'video', label: 'Видео' },
            { key: 'updates', label: 'Обновления' },
          ],
        },
      ];
    } else if (userRole === 'admin') {
      return [
        {
          key: 'requests',
          label: 'Заявки',
          icon: <TableOutlined />,
          children: [
            { key: 'incoming', label: 'Входящие заявки' },
            { key: 'my-requests', label: 'Мои заявки' },
          ],
        },
        {
          key: 'management',
          label: 'Управление',
          icon: <ProfileOutlined />,
          children: [
            { key: 'users', label: 'Пользователи' },
            { key: 'roles', label: 'Роли' },
            { key: 'systems', label: 'Системы' },
          ],
        },
        {
          key: 'edit',
          label: 'Изменения',
          icon: <WarningOutlined />,
          children: [
            { key: 'logs', label: 'Логирование' },
            { key: 'reports', label: 'Отчеты' },
          ],
        },

        {
          key: 'about',
          label: 'О системе',
          icon: <CheckCircleOutlined />,
          children: [
            { key: 'docs', label: 'Документы' },
            { key: 'video', label: 'Видео' },
            { key: 'updates', label: 'Обновления' },
          ],
        },
      ];
    }
    return [];
  }, [userRole]);

  useEffect(() => {
    setMounted(true);
    if (!pathname) return;

    const currentKey = pathname.split('/').filter(Boolean)[0];
    if (!currentKey) return;

    const parentKey = items.find((item) =>
        item.children?.some((child) => child.key === currentKey),
    )?.key;

    setOpenKeys(parentKey ? [parentKey] : []);
  }, [pathname, items]);

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(`/${key}`);
  };

  const handleOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  if (!mounted) {
    return <Layout.Sider width={250} theme="light" style={{ visibility: 'hidden' }} />;
  }

  const selectedKeys = [pathname?.split('/').filter(Boolean)[0] || ''];

  return (
      <Layout.Sider
          width={250}
          theme="light"
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'sticky',
            left: 0,
            top: 0,
          }}
      >
        <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
            items={items}
            onClick={handleMenuClick}
            style={{
              height: '100%',
              borderRight: 0,
            }}
        />
      </Layout.Sider>
  );
};

export default AppSider;
