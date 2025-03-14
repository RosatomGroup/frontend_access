import { AntdRegistry } from '@ant-design/nextjs-registry';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../styles/globals.css';
import Link from 'next/link';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'RBAC System',
  description:
    'Система автоматизации доступа к корпоративным ресурсам: Управление правами доступа по запросу. Управление паролями в информационных системах. Централизованная отчетность по правам доступа пользователей, аудит прав доступа.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Link href="/" style={{ width: '120px', height: '40px', border: 'red 2px solid' }}>
          На главную страницу!
        </Link>
        <div className="wrapper">
          <AntdRegistry>{children}</AntdRegistry>
        </div>
      </body>
    </html>
  );
}
