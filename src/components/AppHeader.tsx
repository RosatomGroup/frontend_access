'use client';
import type {MenuProps} from 'antd';
import {Avatar, Badge, Dropdown, Image, Layout, message, Modal, Space, theme, Typography} from 'antd';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {BellOutlined, LogoutOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import {useCallback, useEffect, useState} from 'react';
import Profile from '@/components/ui/Profile';
import Settings from '@/components/ui/Settings';
import dayjs from 'dayjs';
import '@ant-design/v5-patch-for-react-19';
import axios from 'axios';
import {api} from "@/api/axios.config";
import { User } from '../types/user'

const {Header} = Layout;
const {Text} = Typography;

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
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const formatUserName = useCallback((user: User | null) => {
        if (!user) return 'Гость';
        return user.surname && user.name && user.middleName
            ? `${user.surname} ${user.name[0]}.${user.middleName[0]}.`
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
            await axios.post('http://localhost:3001/auth/logout', {}, {withCredentials: true});
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

    const loadNotifications = useCallback(async () => {
        try {
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail) {
                const response = await api.get('/notifications', {
                    //TODO
                    params: {email: userEmail}
                });
                const data = response.data;
                setNotifications(data);
                setUnreadCount(data.filter((n: Notification) => !n.read).length);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.message);
                if (error.response && error.response.status === 401) {
                    window.location.href = '/login';
                }
            } else {
                console.error('Unexpected error:', error);
            }
            setNotifications([]);
            setUnreadCount(0);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            loadNotifications();
        }, 30000);
        return () => clearInterval(interval);
    }, [loadNotifications]);


    const handleNotifDropdownOpen = async (open: boolean) => {
        if (open) {
            const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
            if (unreadIds.length > 0) {
                try {
                    await api.post('/notifications/read-bulk', {ids: unreadIds});
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
        label: (
            <a style={notif.read ? {} : {fontWeight: 'bold'}}>
                {notif.message}
            </a>
        ),
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
            icon: <UserOutlined/>,
        },
        {
            key: '3',
            label: <a onClick={showSettings}>Настройки</a>,
            icon: <SettingOutlined/>,
        },
        {
            key: '4',
            label: <a onClick={() => setLogoutModalOpen(true)}>Выйти</a>,
            icon: <LogoutOutlined/>,
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
                    <Link href={'/'} style={{display: 'flex'}}>
                        <Image width={35} preview={false} src="/./favicon.ico" alt="Логотип ИС ВЕКТОР"/>
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
                    <div style={{display: 'flex', alignItems: 'center', gap: 25}}>
                        <Dropdown
                            menu={{items: itemsNotif}}
                            onOpenChange={handleNotifDropdownOpen}
                        >
                            <Badge count={unreadCount}>
                                <a onClick={e => e.preventDefault()}>
                                    <Space>
                                        <BellOutlined style={{color: colorBgContainer, fontSize: 24}}/>
                                    </Space>
                                </a>
                            </Badge>
                        </Dropdown>

                        <Dropdown menu={{items}}>
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    <Avatar
                                        src={currentUser?.avatarUrl}
                                        // src={currentUser?.avatar || '/images/defaults.webp'}
                                        icon={<UserOutlined style={{fontSize: '20px'}}/>}
                                        style={{backgroundColor: '#1677ff'}}
                                        shape="circle"
                                        onError={() => false}
                                    />
                                    <Text style={{color: colorBgContainer}}>{formatUserName(currentUser)}</Text>
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

            <Profile open={profileOpen} onClose={closeProfile} onUserUpdate={updateUserData}/>
            <Settings open={settingsOpen} onClose={closeSettings}/>
        </>
    );
}

