'use client';

import { Typography } from 'antd';
import { Breadcrumb, Layout, theme } from 'antd';
import AppSider from '../../../components/AppSider';
import AppHeader from '../../../components/AppHeader';
import { List } from 'antd';

const { Header, Content } = Layout;

const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

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
                  title: 'О системе',
                },
                {
                  title: 'Обновления',
                },
              ]}
            />
            <Typography.Title level={4}>Обновления</Typography.Title>
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
              <Typography.Title level={5}>О приложении</Typography.Title>
              <List
                size="large"
                dataSource={data}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
