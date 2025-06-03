'use client';

import {usePathname, useRouter} from 'next/navigation';
import {useEffect, useMemo, useState} from 'react';
import type {MenuProps} from 'antd';
import {Layout, Menu, Spin} from 'antd';
import {
    CheckCircleOutlined,
    FileTextOutlined,
    InfoCircleOutlined,
    ProfileOutlined,
    SyncOutlined,
    TableOutlined,
    UserOutlined,
    VideoCameraOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import {useUser} from "@/components/UserContext";

type MenuItem = Required<MenuProps>['items'][number];

<<<<<<< HEAD
const AppSider: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);
    const {user, isLoading} = useUser();
=======
  const items = useMemo(
    () => [
      {
        key: 'request',
        label: 'Заявки',
        icon: <TableOutlined />,
        children: [
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
          { key: 'resources', label: 'Системы' },
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
>>>>>>> feature/requestwithback

    useEffect(() => {
        setMounted(true);
    }, []);

    const generateCommonItems = (): MenuItem[] => [
        {
            key: 'edit',
            label: 'Изменения',
            icon: <SyncOutlined/>,
            children: [
                {key: 'logs', label: 'Логирование', icon: <FileTextOutlined/>},
                {key: 'reports', label: 'Отчеты', icon: <ProfileOutlined/>},
            ],
        },
        {
            key: 'about',
            label: 'О системе',
            icon: <InfoCircleOutlined/>,
            children: [
                {key: 'docs', label: 'Документы', icon: <FileTextOutlined/>},
                {key: 'video', label: 'Видео', icon: <VideoCameraOutlined/>},
                {key: 'updates', label: 'Обновления', icon: <SyncOutlined/>},
            ],
        },
    ];

    const generateUserItems = (): MenuItem[] => [
        {key: 'my-accesses', label: 'Мои доступы', icon: <CheckCircleOutlined/>},
        {key: 'outgoing', label: 'Мои заявки', icon: <ProfileOutlined/>},
        {key: 'resources', label: 'Системы', icon: <TableOutlined/>},
        {key: 'roles', label: 'Роли', icon: <UserOutlined/>},
    ];

    const generateAdminItems = (): MenuItem[] => [
        {
            key: 'requests',
            label: 'Заявки',
            icon: <ProfileOutlined/>,
            children: [
                {key: 'incoming', label: 'Входящие заявки', icon: <WarningOutlined/>},
                {key: 'outgoing', label: 'Мои заявки', icon: <ProfileOutlined/>},
            ],
        },
        {
            key: 'management',
            label: 'Управление',
            icon: <UserOutlined/>,
            children: [
                {key: 'users', label: 'Пользователи', icon: <UserOutlined/>},
                {key: 'roles', label: 'Роли', icon: <UserOutlined/>},
                {key: 'resources', label: 'Системы', icon: <TableOutlined/>},
            ],
        },
    ];

    const items = useMemo(() => {
        if (!user?.accessLevel) return [];
        const commonItems = generateCommonItems();
        switch (user.accessLevel) {
            case 'USER':
                return [...generateUserItems(), ...commonItems];
            case 'ADMIN':
                return [...generateAdminItems(), ...commonItems];
            default:
                return [];
        }
    }, [user]);

    function findParentKey(items: MenuItem[], key: string): string | undefined {
        for (const item of items) {
            if (item && 'children' in item && item.children) {
                if (item.children.some(child => child && 'key' in child && child.key === key)) {
                    return item.key as string;
                }
                // Рекурсивный поиск для вложенных меню
                for (const child of item.children) {
                    if (child && 'children' in child && child.children) {
                        const found = findParentKey([child as MenuItem], key);
                        if (found) return found;
                    }
                }
            }
        }
        return undefined;
    }

    useEffect(() => {
        if (!mounted || !pathname || isLoading) return;
        const segments = pathname.split('/').filter(Boolean);
        const currentKey = segments[segments.length - 1]; // последний сегмент
        const parentKey = findParentKey(items, currentKey);
        if (parentKey && !openKeys.includes(parentKey)) {
            setOpenKeys([parentKey]);
        }
    }, [pathname, items, mounted, isLoading]);

    const handleMenuClick: MenuProps['onClick'] = ({key}) => {
        router.push(`/${key}`);
    };

    const handleOpenChange: MenuProps['onOpenChange'] = (keys) => {
        setOpenKeys(keys as string[]);
    };

    if (!mounted || isLoading) {
        return (
            <Layout.Sider>
                <div><Spin/></div>
            </Layout.Sider>
        );
    }

    if (!user?.accessLevel) {
        return (
            <Layout.Sider>
                <div>Доступ запрещен</div>
            </Layout.Sider>
        );
    }

    // Выделяем текущий пункт меню (последний сегмент)
    const segments = pathname?.split('/').filter(Boolean);
    const selectedKeys = [segments[segments.length - 1] || ''];

    return (
        <Layout.Sider width={240}>
            <Menu
                mode="inline"
                selectedKeys={selectedKeys}
                openKeys={openKeys}
                onOpenChange={handleOpenChange}
                onClick={handleMenuClick}
                style={{height: '100%', borderRight: 0}}
                items={items}
            />
        </Layout.Sider>
    );
};

export default AppSider;
