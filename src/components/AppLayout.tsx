// src/components/AppLayout.tsx
'use client';

import { 
  Layout, 
  Typography, 
  Breadcrumb, 
  theme, 
  Card, 
  Col, 
  Row, 
  Button, 
  Flex, 
  Modal, 
  Table 
} from 'antd';
import FormReqOthers from './FormReqOthers';
import FormReqRevoke from './FormReqRevoke';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { reqOutdata } from '@/app/reqOut';

const { Title } = Typography;

export default function AppLayout() {
  const router = useRouter();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentForm, setCurrentForm] = useState<'grant' | 'revoke'>('grant');

  // Получаем последние 5 заявок
  const lastRequests = reqOutdata
    .sort((a, b) => new Date(b.submissionTime).getTime() - new Date(a.submissionTime).getTime())
    .slice(0, 5);

  // // Заглушка для входящих заявок
  // const incomingRequests = [
  //   "Нет входящих заявок"
  // ];

  // Конфигурация колонок для таблицы
  const columns = [
    {
      title: 'Заявка',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center' as const,
      render: (id: number) => <span>Заявка №{id}</span>
    },
    {
      title: 'ФИО',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true
    },
    {
      title: 'Тема запроса',
      dataIndex: 'requestSubject',
      key: 'requestSubject',
      width: 160,
      ellipsis: true
    },
    {
      title: 'Система',
      dataIndex: 'system',
      key: 'system',
      width: 100,
      align: 'center' as const
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
      width: 180,
      ellipsis: true
    }
  ];

  const showForm = (formType: 'grant' | 'revoke') => {
    setCurrentForm(formType);
    setIsFormVisible(true);
  };
  
  const closeForm = () => setIsFormVisible(false);

  function onClickMyReq() {
    router.replace('/outgoing');
  }

  // Стили для заголовков модальных окон
  const modalTitleStyle = {
    textAlign: 'center' as const,
    fontSize: '20px',
    fontWeight: 500,
    marginBottom: '20px'
  };

  return (
    <Layout>
      <Layout.Header style={{ paddingLeft: 16, background: colorBgContainer, height: '100px' }}>
        <Breadcrumb
          style={{ margin: '16px 0' }}
          items={[
            { title: 'Главная' },
            { title: 'Заявки' },
          ]}
        />
        <Title level={4}>Главная</Title>
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
            <Button type="primary" onClick={() => showForm('grant')}>
              Запросить доступ
            </Button>
            
            <Modal 
              title={<div style={modalTitleStyle}>Форма запроса доступа</div>}
              open={isFormVisible && currentForm === 'grant'} 
              onCancel={closeForm} 
              footer={null}
              centered
            >
              <FormReqOthers onClose={closeForm} />
            </Modal>

            <Button type="primary" onClick={() => showForm('revoke')}>
              Отозвать доступ
            </Button>
            
            <Modal 
              title={<div style={modalTitleStyle}>Форма отзыва доступа</div>}
              open={isFormVisible && currentForm === 'revoke'} 
              onCancel={closeForm} 
              footer={null}
              centered
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
            <Card title="Последние отправленные заявки" bordered={false}>
              <Table
                dataSource={lastRequests}
                columns={columns}
                pagination={false}
                size="small"
                rowKey="id"
                scroll={{ x: 600}}
                // bordered
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Последние входящие заявки" bordered={false}>
              <Table
                dataSource={[]}
                columns={columns}
                pagination={false}
                size="small"
                locale={{ emptyText: "Нет входящих заявок" }}
                scroll={{ x: 600}}
                bordered
              />
            </Card>
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
}