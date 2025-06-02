import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import './globals.css';
import 'antd/dist/reset.css';

export const metadata: Metadata = {
  title: 'ИС ВЕКТОР',
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
          {children}
        </AntdRegistry>
      </body>
    </html>
  );
}
