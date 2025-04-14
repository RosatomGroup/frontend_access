'use client';

import { Layout, Typography, Breadcrumb, theme } from 'antd';
import OutReqTable from '../../tables/OutReqTable';
import AppHeader from '../../../components/AppHeader';
import AppSider from '../../../components/AppSider';
import Link from 'next/link';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function IncomingRequestsPage() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <AppHeader />
      <Layout style={{ minHeight: '100vh' }}>
        <AppSider />
        <Layout>
          <Header style={{ 
            padding: '0 16px',
            background: colorBgContainer,
            height: 100,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Breadcrumb
              style={{ margin: '16px 0' }}
              items={[
                {
                  title: <Link href="/" style={{ color: 'inherit' }}>Заявки</Link>,
                },
                {
                  title: 'Входящие заявки',
                },
              ]}
            />
            <Title level={4} style={{ margin: 0 }}>Входящие заявки</Title>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                marginTop: 16
              }}
            >
              <OutReqTable tableTitle="Входящие заявки" />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}