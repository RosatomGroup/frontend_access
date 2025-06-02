'use client';

import { Typography } from 'antd';
import { Breadcrumb, Layout, theme } from 'antd';
import AppSider from '../../../components/AppSider';
import AppHeader from '../../../components/AppHeader';
import React, { useState, useEffect } from 'react';
import { List } from 'antd';

const { Header, Content } = Layout;

 const data = [
  { 
    "version": "3.1.5",
    "description": "Внесены изменения в приложение в части разделов 'Администрирование' и 'Управление'. Исправлены ошибки, добавлены новые функции",
    "date": "2025-04-08",
  },
  { 
    "version": "2.1.1",
    "description": "Внесены изменения. Исправлены ошибки, добавлены новые функции",
    "date": "2025-03-20",
  },
  { 
    "version": "1.1.0",
    "description": "Стартовая версия приложения",
    "date": "2025-03-15",
  }
]

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
                  title: 'О системе',
                },
                {
                  title: 'Обновления',
                },
              ]}
            />
            <Typography.Title level={4}>{nameOfPage}</Typography.Title>
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
            <Typography.Title level={5}>{nameOfPage}</Typography.Title> 
              {
               <List
                size="large"
                dataSource={data}
                renderItem={(item) => <List.Item>
                  <ul>
                    <li><h2>{item.version}</h2> </li>
                    <li> {item.description} </li>
                  </ul> 
                    <time> {item.date} </time>                                      
 
                       </List.Item>}
              /> 
              }
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}