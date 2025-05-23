'use client';

import { Typography } from 'antd';
import { Breadcrumb, Layout, theme } from 'antd';
import AppSider from '../../../components/AppSider';
import AppHeader from '../../../components/AppHeader';
import React from 'react';
import ComingSoonPage from '@/components/AppComingSoon';
import AuthGuard from '@/components/AuthGuard';

const { Header, Content } = Layout;

export default function IncomingRequest() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <AuthGuard>
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
                    title: 'О системе',
                  },
                  {
                    title: 'Видео',
                  },
                ]}
              />
              <Typography.Title level={4}>Видео</Typography.Title>
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
    </AuthGuard>
  );
}

