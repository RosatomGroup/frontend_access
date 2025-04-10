'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Layout, Menu } from 'antd';
import {
  TableOutlined,
  ProfileOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useState, useEffect, useMemo, useCallback } from 'react';

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
    []
  );

  useEffect(() => {
    setMounted(true);
    const currentKey = pathname.split('/')[1];
    if (!currentKey) return;

    const parentKey = items.find((item) =>
      item.children?.some((child) => child.key === currentKey)
    )?.key;

    setOpenKeys(() => (parentKey ? [parentKey as string] : []));
  }, [pathname, items]);

  const handleMenuClick = useCallback(
    ({ key }: { key: string }) => {
      router.push(`/${key}`);
    },
    [router]
  );

  const handleOpenChange = useCallback((keys: string[]) => {
    const lastOpenKey = keys[keys.length - 1];
    setOpenKeys(lastOpenKey ? [lastOpenKey] : []);
  }, []);

  if (!mounted) {
    return <Layout.Sider width={250} theme="light" style={{ visibility: 'hidden' }} />;
  }

  return (
    <Layout.Sider
      width={250}
      collapsible
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
        selectedKeys={[pathname.split('/')[1] || '']}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        items={items}
        onClick={handleMenuClick}
        style={{ height: '100%', borderRight: 0 }}
        motion={{
          motionName: 'ant-slide-up',
          motionAppear: false,
          motionEnter: true,
          motionLeave: true,
          motionDeadline: 0,
          leavedClassName: 'ant-menu-submenu-hidden',
        }}
      />
    </Layout.Sider>
  );
};

export default AppSider;

// const items: MenuItem[] = useMemo(
//   () => [
//     {
//       key: 'request',
//       label: 'Заявки',
//       icon: <TableOutlined />,
//       children: [
//         { key: 'incoming', label: 'Входящие' },
//         { key: 'outgoing', label: 'Исходящие' },
//         { key: 'all', label: 'Все заявки' },
//       ],
//     },
//     {
//       key: 'management',
//       label: 'Управление',
//       icon: <ProfileOutlined />,
//       children: [
//         { key: 'users', label: 'Пользователи' },
//         { key: 'roles', label: 'Роли' },
//         { key: 'systems', label: 'Системы' },
//       ],
//     },
//     {
//       key: 'edit',
//       label: 'Изменения',
//       icon: <WarningOutlined />,
//       children: [
//         { key: 'logs', label: 'Логирование' },
//         { key: 'reports', label: 'Отчеты' },
//       ],
//     },
//     {
//       key: 'about',
//       label: 'О системе',
//       icon: <CheckCircleOutlined />,
//       children: [
//         { key: 'docs', label: 'Документы' },
//         { key: 'video', label: 'Видео' },
//         { key: 'updates', label: 'Обновления' },
//       ],
//     },
//   ],
//   []
// );

// const items: MenuItem[] = [
//   {
//     key: 'request',
//     label: 'Заявки',
//     icon: <TableOutlined />,
//     children: [
//       { key: 'incoming', label: 'Входящие' },
//       { key: 'outgoing', label: 'Исходящие' },
//       { key: 'all', label: 'Все заявки' },
//     ],
//   },
//   {
//     key: 'management',
//     label: 'Управление',
//     icon: <ProfileOutlined />,
//     children: [
//       { key: 'users', label: 'Пользователи' },
//       { key: 'roles', label: 'Роли' },
//       { key: 'systems', label: 'Системы' },
//     ],
//   },
//   {
//     key: 'edit',
//     label: 'Изменения',
//     icon: <WarningOutlined />,
//     children: [
//       { key: 'logs', label: 'Логирование' },
//       { key: 'reports', label: 'Отчеты' },
//     ],
//   },
//   {
//     key: 'about',
//     label: 'О системе',
//     icon: <CheckCircleOutlined />,
//     children: [
//       { key: 'docs', label: 'Документы' },
//       { key: 'video', label: 'Видео' },
//       { key: 'updates', label: 'Обновления' },
//     ],
//   },
// ];

// const App: React.FC = () => {
//   const router = useRouter();
//   // const pathname = usePathname();
//   // const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
//   // const [openKeys, setOpenKeys] = useState<string[]>([]);

//   // useEffect(() => {
//   //   const pathParts = pathname.split('/').filter(Boolean);
//   //   if (pathParts.length > 0) {
//   //     const key = pathParts[0];
//   //     setSelectedKeys([key]);

//   //     if (pathParts.length > 1) {
//   //       setOpenKeys([key]);
//   //     }
//   //   }
//   // }, [pathname]);

//   const onClick: MenuProps['onClick'] = (e) => {
//     // setSelectedKeys([e.key]);
//     router.replace(`/${e.key}`);
//   };
//   // const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
//   //   setOpenKeys(keys);
//   // };

//   return (
//     <Layout.Sider
//       width={250}
//       collapsible
//       theme='light'
//       style={{
//         overflow: 'auto',
//         height: '100vh',
//         position: 'sticky',
//         left: 0,
//         top: 0,
//       }}
//     >
//       <Menu
//         onClick={onClick}
//         style={{ width: 256 }}
//         defaultOpenKeys={['request']}
//         // selectedKeys={selectedKeys}
//         // onOpenChange={onOpenChange}
//         // openKeys={openKeys}
//         mode="inline"
//         items={items}
//       />
//     </Layout.Sider>
//   );
// };

// export default App;
