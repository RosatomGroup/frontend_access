'use client';

import { Breadcrumb, Layout, theme, Typography } from 'antd';
import AppSider from '../../../../components/AppSider';
import AppHeader from '../../../../components/AppHeader';
import ComingSoonPage from '@/components/AppComingSoon';

const { Header, Content } = Layout;

const data = [
  {
    version: '3.1.5',
    description:
      "Внесены изменения в приложение в части разделов 'Администрирование' и 'Управление'. Исправлены ошибки, добавлены новые функции",
    date: '2025-04-08',
  },
  {
    version: '2.1.1',
    description: 'Внесены изменения. Исправлены ошибки, добавлены новые функции',
    date: '2025-03-20',
  },
  {
    version: '1.1.0',
    description: 'Стартовая версия приложения',
    date: '2025-03-15',
  },
];

export default function AppUpdatesPage() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const nameOfPage = 'О приложении';

  return (
    <Layout>
      <AppHeader />
      <Layout style={{ minHeight: '100vh' }}>
        <AppSider />
        <Layout>
          <Header style={{ paddingLeft: 16, background: colorBgContainer, height: '100px' }}>
            <Breadcrumb
              style={{ margin: '16px 0' }}
              items={[
                {
                  title: 'Изменения',
                  title: 'Изменения',
                },
                {
                  title: 'Логирование',
                  title: 'Логирование',
                },
              ]}
            />
            <Typography.Title level={4}>Логирование</Typography.Title>
            <Typography.Title level={4}>Логирование</Typography.Title>
          </Header>
          <Content style={{ margin: '0 16px', paddingTop: '16px' }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <ComingSoonPage />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

