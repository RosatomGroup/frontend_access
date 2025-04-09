import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Roboto } from 'next/font/google';
import '../styles/globals.css';
import Header from '@/components/common/header/Header';
import Menu from '@/components/common/menu/Menu';

// Шрифты
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

// Метаданные
export const metadata: Metadata = {
  title: 'RBAC System',
  description: 'Система управления доступом на основе ролей',
};

// Основной Layout компонент
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        {/* Дополнительные теги head при необходимости */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${roboto.className}`}>
        <AntdRegistry>
          {/* Общий контейнер */}
          <div className="app-container" 
            style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              backgroundColor: '#f5f5f5',
          }}>
            {/* Шапка - фиксированная сверху */}
            <header style={{
              // height: '64px',
              // backgroundColor: '#fff',
              // boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              // zIndex: 100,
              // position: 'sticky',
              // top: 0,
            }}>
              <Header />
            </header>

            {/* Основное содержимое с меню и контентом */}
            <div style={{
              display: 'flex',
              flex: 1,
              overflow: 'hidden',
              backgroundColor: '#F0F0F0',
            }}>
              {/* Боковое меню - фиксированная ширина */}
              <aside style={{
                // width: '208px',
                flexShrink: 0,
                backgroundColor: '#fff',
                // borderRight: '1px solid #e8e8e8',
                overflowY: 'auto',
              }}>
                <Menu />
              </aside>

              {/* Основной контент */}
              <main style={{
                flex: 1,
                padding: '24px',
                overflowY: 'auto',
                backgroundColor: 'faliceblueff',
              }}>
                {children}
              </main>
            </div>
          </div>
        </AntdRegistry>
      </body>
    </html>
  );
}