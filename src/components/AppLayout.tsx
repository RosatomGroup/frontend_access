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
  Table,
  notification
} from 'antd';
import type { TableColumnsType } from 'antd';
import FormReqOthers from './FormReqOthers';
import FormReqRevoke from './FormReqRevoke';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { BackendRequestDataType } from '@/app/tables/OutReqTable';
import { useAuthFetch } from '@/hooks/useAuthFetch';

const { Title } = Typography;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

interface LastRequestData extends BackendRequestDataType {}

export default function AppLayout() {
  const router = useRouter();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentForm, setCurrentForm] = useState<'grant' | 'revoke'>('grant');
  const [lastRequests, setLastRequests] = useState<LastRequestData[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [api, contextHolder] = notification.useNotification();
  const { fetchWithAuth } = useAuthFetch();

  useEffect(() => {
    const fetchLastRequests = async () => {
      setLoadingRequests(true);
      try {
        const data = await fetchWithAuth(
          `${API_BASE_URL}/requests?_sort=createDate&_order=desc&_limit=5`
        );
        setLastRequests(data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching last requests:', error);
        api.error({
          message: 'Ошибка загрузки',
          description: error instanceof Error ? error.message : 'Не удалось загрузить последние заявки',
        });
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchLastRequests();
  }, [api, fetchWithAuth]);

  const formatSubmissionTimeForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
      if (diffInMinutes < 1) {
        return 'Только что';
      }
      return `${diffInMinutes} мин. назад`;
    }

    if (diffInHours < 24) {
      return `${diffInHours} ч. назад`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} дн. назад`;
    }
  };

  const columns: TableColumnsType<LastRequestData> = [
    {
      dataIndex: 'id',
      key: 'id',
      width: 83,
      render: (id: number, record: LastRequestData) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            paddingTop: '22px',
            margin: '0',
            color: '#1890ff',
            fontWeight: '500',
            fontSize: '13px',
          }}>
            Заявка №{id}
          </span>
          <span style={{
            margin: '0',
            color: '#8c8c8c',
            fontSize: '12px',
            marginTop: '4px'
          }}>
            {formatSubmissionTimeForDisplay(record.createDate)}
          </span>
        </div>
      )
    },
    {
      dataIndex: 'fullName',
      key: 'name',
      width: 185,
      render: (text: any, record: LastRequestData) => (
        <div style={{ padding: '0', margin: '0' }}>{record.surname} {record.name} {record.middleName || ''}</div>
      )
    },
    {
      dataIndex: 'requestType',
      key: 'requestSubject',
      width: 135,
      render: (type: LastRequestData['requestType']) => (
        <div style={{ padding: '0', margin: '0' }}>
          {type === 'GRANT_ACCESS' ? 'Предоставить доступ' : 'Отозвать доступ'}
        </div>
      )
    },
    {
      dataIndex: 'resourceName',
      key: 'system',
      width: 100,
      render: (system: string) => (
        <div style={{ padding: '0', margin: '0' }}>{system}</div>
      )
    },
    {
      dataIndex: 'roleName',
      key: 'role',
      width: 150,
      render: (role: string) => (
        <div style={{ padding: '0', margin: '0' }}>{role}</div>
      )
    }
  ];

  const showForm = (formType: 'grant' | 'revoke') => {
    setCurrentForm(formType);
    setIsFormVisible(true);
  };

  const closeForm = () => setIsFormVisible(false);

  function onClickViewRequests() {
    router.replace('/all');
  }

  const modalTitleStyle = {
    textAlign: 'center' as const,
    fontSize: '20px',
    fontWeight: 500,
    marginBottom: '20px'
  };

  return (
    <Layout>
      {contextHolder}
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
            <Button type="primary" onClick={onClickViewRequests}>
              Просмотреть все заявки
            </Button>
          </Flex>
        </div>
        <Row>
          <Col span={24}>
            <Card
              title="Последние заявки"
              variant="borderless"
              styles={{
                header: {
                  textAlign: 'center',
                  fontSize: '16px',
                  fontWeight: 500
                }
              }}
            >
              <Table
                dataSource={lastRequests}
                columns={columns}
                pagination={false}
                size="small"
                rowKey="id"
                scroll={{ x: 600 }}
                showHeader={false}
                loading={loadingRequests}
              />
            </Card>
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
}