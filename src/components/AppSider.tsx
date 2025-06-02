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
        {key: 'my-requests', label: 'Мои заявки', icon: <ProfileOutlined/>},
        {key: 'systems', label: 'Системы', icon: <TableOutlined/>},
        {key: 'roles', label: 'Роли', icon: <UserOutlined/>},
    ];

    const generateAdminItems = (): MenuItem[] => [
        {
            key: 'requests',
            label: 'Заявки',
            icon: <ProfileOutlined/>,
            children: [
                {key: 'incoming', label: 'Входящие заявки', icon: <WarningOutlined/>},
                {key: 'my-requests', label: 'Мои заявки', icon: <ProfileOutlined/>},
            ],
        },
        {
            key: 'management',
            label: 'Управление',
            icon: <UserOutlined/>,
            children: [
                {key: 'users', label: 'Пользователи', icon: <UserOutlined/>},
                {key: 'roles', label: 'Роли', icon: <UserOutlined/>},
                {key: 'systems', label: 'Системы', icon: <TableOutlined/>},
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
        const parentItem = items.find(
            (item: any) =>
                item &&
                'children' in item &&
                item.children?.some((child: any) => 'key' in child && child.key === currentKey)
        );
        if (parentItem?.key && !openKeys.includes(parentItem.key.toString())) {
            setOpenKeys([parentItem.key.toString()]);
        }
    }, [pathname, items, mounted, openKeys, isLoading]);

    const handleMenuClick: MenuProps['onClick'] = ({key}) => {
        router.push(`/${key}`);
    };

    const handleOpenChange: MenuProps['onOpenChange'] = (keys) => {
        const latestOpenKey = keys.find((key) => !openKeys.includes(key));
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    };

    if (!mounted || isLoading) {
        return (
            <Layout.Sider className={styles.sider}>
                <div className={styles.spinner}><Spin/></div>
            </Layout.Sider>
        );
    }

    if (!userRole) {
        return (
            <Layout.Sider className={styles.sider}>
                <div className={styles.denied}>Доступ запрещен</div>
            </Layout.Sider>
        );
    }

    const selectedKeys = [pathname?.split('/').filter(Boolean)[0] || ''];

    return (
        <Layout.Sider className={styles.sider} width={240}>
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
