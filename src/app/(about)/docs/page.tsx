'use client';

import { Typography, Breadcrumb, Layout, theme } from 'antd';
import AppSider from '../../../components/AppSider';
import AppHeader from '../../../components/AppHeader';
import ComingSoonPage from '../../../components/AppComingSoon';
import AuthGuard from '@/components/AuthGuard';
import AppLoadingComponent from '@/components/AppLoading';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function DocsPage() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const nameOfPage = 'Документы';

  return (
    <AuthGuard>
      <AppLoadingComponent />
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
                    title: 'Документы',
                  },
                ]}
              />
              <Title level={4}>{nameOfPage}</Title>
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

