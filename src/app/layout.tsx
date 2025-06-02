import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import './globals.css';
import 'antd/dist/reset.css';
import {AuthProvider} from '../context/AuthContext';

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
        <AuthProvider >
          <AntdRegistry>
            {children}
          </AntdRegistry>
          </AuthProvider>
      </body>
    </html>
  );
}
