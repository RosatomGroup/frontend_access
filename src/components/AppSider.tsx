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

const AppSider = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const items = useMemo(
    () => [
      {
        key: 'request',
        label: 'Заявки',
        icon: <TableOutlined />,
        children: [
          { key: 'incoming', label: 'Входящие' },
          { key: 'outgoing', label: 'Исходящие' },
          { key: 'all', label: 'Все заявки' },
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
    ],
    [],
  );

  useEffect(() => {
    setMounted(true);
    if (!pathname) return;

    const currentKey = pathname.split('/').filter(Boolean)[0];
    if (!currentKey) return;

    // Автоматически открываем родительский раздел при загрузке
    const parentKey = items.find((item) =>
      item.children?.some((child) => child.key === currentKey),
    )?.key;

    setOpenKeys(parentKey ? [parentKey] : []);
  }, [pathname, items]);

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(`/${key}`);
  };

  // Обработчик разворачивания/сворачивания разделов
  const handleOpenChange = (keys: string[]) => {
    // keys содержит все открытые разделы
    // Последний ключ в массиве - это последний открытый раздел
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

    if (latestOpenKey) {
      // Если нажали на новый раздел - открываем только его
      setOpenKeys([latestOpenKey]);
    } else {
      // Если нажали на уже открытый раздел - закрываем его
      setOpenKeys([]);
    }
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
          // paddingTop: '16px',
        }}
      />
    </Layout.Sider>
  );
};

export default AppSider;
