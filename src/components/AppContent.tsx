'use client';

import { Breadcrumb, Layout, theme } from 'antd';
import { Typography } from 'antd';

const { Header, Content } = Layout;

export default function AppContent() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header style={{ paddingLeft: 16, background: colorBgContainer, height: '100px' }}>
        <Breadcrumb
          style={{ margin: '16px 0' }}
          items={[
            {
              title: 'Главная',
            },
            {
              title: 'Заявки',
            },
          ]}
        />
        <Typography.Title level={4}>Главная</Typography.Title>
      </Header>
      <Content style={{ margin: '0 16px', paddingTop: '16px' }}>
        <div
          style={{
            padding: 24,
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        ></div>
      </Content>
    </Layout>
  );
}
