'use client';

import { Typography } from 'antd';
import { Breadcrumb, Layout, theme } from 'antd';
import OutReqTable from '../../tables/OutReqTable';
import AppHeader from '@/components/AppHeader';
import AppSider from '@/components/AppSider';
import Link from 'next/link';

const { Header, Content } = Layout;

const OutGoingRequest: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { Title } = Typography;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Layout>
        <AppSider />
        <Layout>
          <Header style={{ paddingLeft: 16, background: colorBgContainer, height: '100px' }}>
            <Breadcrumb
              style={{ margin: '16px 0' }}
              items={[
                {
                  title: <Link href="/">Заявки</Link>,
                },
                {
                  title: 'Исходящие',
                },
              ]}
            />
            <Title level={4}>Исходящие заявки</Title>
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
              <OutReqTable />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default OutGoingRequest;
