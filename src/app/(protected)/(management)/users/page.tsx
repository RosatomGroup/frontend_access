'use client';

import {Breadcrumb, ConfigProvider, Layout, theme, Typography,} from 'antd';
import TableUser from '../../../tables/UsersTable';
import AppSider from '../../../../components/AppSider';
import AppHeader from '../../../../components/AppHeader';
import ruRU from 'antd/locale/ru_RU';

const {Header, Content} = Layout;

export default function IncomingRequest() {
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    return (
        <Layout>
            <AppHeader/>
            <Layout style={{minHeight: '100vh'}}>
                <AppSider/>
                <Layout>
                    <Header style={{paddingLeft: 16, background: colorBgContainer, height: '100px'}}>
                        <Breadcrumb
                            style={{margin: '16px 0'}}
                            items={[
                                {
                                    title: 'Управление',
                                },
                                {
                                    title: 'Пользователи',
                                },
                            ]}
                        />
                        <Typography.Title level={4}>Пользователи</Typography.Title>
                    </Header>
                    <Content style={{margin: '0 16px', paddingTop: '16px'}}>
                        <div
                            style={{
                                padding: 24,
                                minHeight: 360,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
                                <Typography.Title level={4} style={{margin: 0}}>
                                    Пользователи
                                </Typography.Title>
                            </div>
                            <ConfigProvider locale={ruRU}>
                                <TableUser/>
                            </ConfigProvider>
                        </div>
                    </Content>
                </Layout>
            </Layout>

        </Layout>
    );
}
