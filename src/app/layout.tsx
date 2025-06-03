import type {Metadata} from 'next';
import {AntdRegistry} from '@ant-design/nextjs-registry';
import './globals.css';
import 'antd/dist/reset.css';
import {UserProvider} from "@/components/UserContext";
import {ConfigProvider} from 'antd';
import ruRU from 'antd/locale/ru_RU';

export const metadata: Metadata = {
    title: 'ВЕКТОР',
    description: 'Система верификации и единого контроля токенов, операций и ролей',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
        <body>
        <AntdRegistry>
            <ConfigProvider
                locale={ruRU}
                theme={{
                    token: {
                        colorPrimary: '#1677ff',
                    },
                }}
            >
                <UserProvider>
                    {children}
                </UserProvider>
            </ConfigProvider>
        </AntdRegistry>
        </body>
        </html>
    );
}
