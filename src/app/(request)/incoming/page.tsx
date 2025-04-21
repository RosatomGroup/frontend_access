'use client';

import { Typography } from 'antd';
import { Breadcrumb, Layout, theme } from 'antd';
import AppHeader from '../../../components/AppHeader';
import AppSider from '../../../components/AppSider';
import Link from 'next/link';

const { Header, Content } = Layout;
const { Text } = Typography;

export default function IncomingRequest() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
                  title: <Link href="/">Заявки</Link>,
                },
                {
                  title: 'Входящие',
                },
              ]}
            />
            <Typography.Title level={4}>Входящие заявки</Typography.Title>
          </Header>
          <Content style={{ margin: '0 16px', paddingTop: '16px' }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={{ fontSize: '18px' }}>Нет входящих заявок</Text>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}