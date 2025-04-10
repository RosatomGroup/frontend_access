import type { Metadata } from 'next';
import './globals.css';
import 'antd/dist/reset.css';

export const metadata: Metadata = {
  title: 'RBAC',
  description: 'Система автоматизации доступа к корпоративным ресурсам',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
