'use client';

import {usePathname, useRouter} from 'next/navigation';
import {useEffect, useMemo, useState} from 'react';
import type {MenuProps} from 'antd';
import {Layout, Menu, Spin} from 'antd';
import {
    CheckCircleOutlined,
    FileTextOutlined,
    ProfileOutlined,
    SyncOutlined,
    TableOutlined,
    UserOutlined,
    VideoCameraOutlined,
    WarningOutlined
} from '@ant-design/icons';

type MenuItem = Required<MenuProps>['items'][number];

interface AppSiderProps {
    userRole?: 'ADMIN' | 'USER' | null;
    isLoading?: boolean;
}

const AppSider: React.FC<AppSiderProps> = ({userRole, isLoading = false}) => {
    const router = useRouter();
    const pathname = usePathname();
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const generateCommonItems = (): MenuItem[] => [
        {
            key: 'edit',
            label: 'Изменения',
            icon: <WarningOutlined/>,
            children: [
                {key: 'logs', label: 'Логирование', icon: <FileTextOutlined/>},
                {key: 'reports', label: 'Отчеты', icon: <FileTextOutlined/>},
            ],
        },
        {
            key: 'about',
            label: 'О системе',
            icon: <CheckCircleOutlined/>,
            children: [
                {key: 'docs', label: 'Документы', icon: <FileTextOutlined/>},
                {key: 'video', label: 'Видео', icon: <VideoCameraOutlined/>},
                {key: 'updates', label: 'Обновления', icon: <SyncOutlined/>},
            ],
        }
    ];

    const generateUserItems = (): MenuItem[] => [
        {
            key: 'my-accesses',
            label: 'Мои доступы',
            icon: <ProfileOutlined/>,
        },
        {
            key: 'my-requests',
            label: 'Мои заявки',
            icon: <TableOutlined/>,
        },
        {
            key: 'systems',
            label: 'Системы',
            icon: <CheckCircleOutlined/>,
        },
        {
            key: 'roles',
            label: 'Роли',
            icon: <WarningOutlined/>,
        },
    ];

    const generateAdminItems = (): MenuItem[] => [
        {
            key: 'requests',
            label: 'Заявки',
            icon: <TableOutlined/>,
            children: [
                {key: 'incoming', label: 'Входящие заявки', icon: <ProfileOutlined/>},
                {key: 'my-requests', label: 'Мои заявки', icon: <TableOutlined/>},
            ],
        },
        {
            key: 'management',
            label: 'Управление',
            icon: <ProfileOutlined/>,
            children: [
                {key: 'users', label: 'Пользователи', icon: <UserOutlined/>},
                {key: 'roles', label: 'Роли', icon: <WarningOutlined/>},
                {key: 'systems', label: 'Системы', icon: <CheckCircleOutlined/>},
            ],
        },
    ];

    const items = useMemo(() => {
        if (!userRole) return [];

        const commonItems = generateCommonItems();

        switch (userRole) {
            case 'USER':
                return [...generateUserItems(), ...commonItems];
            case 'ADMIN':
                return [...generateAdminItems(), ...commonItems];
            default:
                return [];
        }
    }, [userRole]);

    useEffect(() => {
        if (!mounted || !pathname || isLoading) return;

        const currentKey = pathname.split('/').filter(Boolean)[0];
        if (!currentKey) return;

        const parentItem = items.find(item =>
            item && 'children' in item &&
            item.children?.some(child => 'key' in child && child.key === currentKey)
        );

        if (parentItem?.key && !openKeys.includes(parentItem.key.toString())) {
            setOpenKeys([parentItem.key.toString()]);
        }
    }, [pathname, items, mounted, openKeys, isLoading]);

    const handleMenuClick: MenuProps['onClick'] = ({key}) => {
        router.push(`/${key}`);
    };

    const handleOpenChange: MenuProps['onOpenChange'] = (keys) => {
        const latestOpenKey = keys.find(key => !openKeys.includes(key));
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    };

    if (!mounted || isLoading) {
        return (
            <Layout.Sider width={250} theme="light">
                <div style={{display: 'flex', justifyContent: 'center', padding: '24px'}}>
                    <Spin size="large"/>
                </div>
            </Layout.Sider>
        );
    }

    if (!userRole) {
        return (
            <Layout.Sider width={250} theme="light">
                <div style={{padding: '16px', textAlign: 'center'}}>
                    Доступ запрещен
                </div>
            </Layout.Sider>
        );
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