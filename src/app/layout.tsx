import { AntdRegistry } from '@ant-design/nextjs-registry';

import type { Metadata } from 'next';
import { Geist, Geist_Mono, Roboto } from 'next/font/google';
import '../styles/globals.css';
// import Link from 'next/link';
import Header from '@/components/common/header/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const roboto = Roboto({
  weight: ['400', '700'],
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
      <AntdRegistry>
        <body className={`${geistSans.variable} ${geistMono.variable} ${roboto.className}`}>
          <div className="page__wrapper">
            <Header />
            <main>{children}</main>
            {/* <Footer /> */}
          </div>
        </body>
      </AntdRegistry>
    </html>
  );
}
