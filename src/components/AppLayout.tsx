'use client';

import { Layout, Typography, Breadcrumb, theme, Card, Col, Row } from 'antd';
import { Button, Flex } from 'antd';
import { List } from 'antd';
import { Modal } from 'antd';
import React, { useState } from 'react';
import FormReqOthers from './FormReqOthers';
import FormReqRevoke from './FormReqRevoke';
import { useRouter } from 'next/navigation';

const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

export default function AppLayout() {
  const router = useRouter();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentForm, setCurrentForm] = useState<'self' | 'others' | 'revoke'>('self');

  const showForm = (formType: 'self' | 'others' | 'revoke') => {
    setCurrentForm(formType);
    setIsFormVisible(true);
  };
  
  const closeForm = () => setIsFormVisible(false);

  function onClickMyReq() {
    router.replace('/outgoing');
  }

  return (
    <Layout>
      <Layout.Header style={{ paddingLeft: 16, background: colorBgContainer, height: '100px' }}>
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
      </Layout.Header>
      <Layout.Content style={{ margin: '0 16px', paddingTop: '16px' }}>
        <div
          style={{
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            marginBottom: 24,
          }}
        >
          <Flex gap="small" wrap style={{ gap: 24, display: 'flex' }}>
            
            <Button type="primary" onClick={() => showForm('others')}>
              Запросить доступ
            </Button>
            
            <Modal 
              title="Форма запроса доступа" 
              style={{ 
                textAlign: 'center', marginBottom: '2px' }}
              open={isFormVisible && currentForm === 'others'} 
              onCancel={closeForm} 
              footer={null}
            >
              <FormReqOthers onClose={closeForm} />
            </Modal>

            <Button type="primary" onClick={() => showForm('revoke')}>
              Отозвать доступ
            </Button>
            
            <Modal 
              title="Форма отзыва доступа" 
              style={{ 
                textAlign: 'center', marginBottom: '2px' }}
              open={isFormVisible && currentForm === 'revoke'} 
              onCancel={closeForm} 
              footer={null}
            >
              <FormReqRevoke onClose={closeForm} />
            
            </Modal>

            <Button type="primary" onClick={onClickMyReq}>
              Мои доступы
            </Button>
          </Flex>
        </div>
        <Row gutter={16}>
          <Col span={12}>
            <Card title="Отправленные заявки" variant="borderless">
              <List
                size="large"
                dataSource={data}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Входящие заявки" variant="borderless">
              <List
                size="large"
                dataSource={data}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </Card>
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
}