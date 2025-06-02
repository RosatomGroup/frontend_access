'use client';

import type {TableColumnsType} from 'antd';
import {Breadcrumb, Button, Card, Col, Flex, Layout, Modal, Row, Table, theme, Typography} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useState} from 'react';
import {RequestForm} from "@/components/RequestForm";

const {Title} = Typography;

interface RequestData {
    id: number;
    name: string;
    requestSubject: string;
    system: string;
    role: string;
    submissionTime: string;
    email: string;
    status: string;
}

interface CurrentUser {
    surname: string;
    name: string;
    middle_name?: string;
    email: string;
}

interface AppLayoutProps {
    currentUser: CurrentUser;
    lastRequests: RequestData[];
}

export default function AppLayout({currentUser, lastRequests}: AppLayoutProps) {
    const router = useRouter();
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [requestType, setRequestType] = useState<'grant' | 'revoke'>('grant');

    const initialValues = {
        lastName: currentUser.surname,
        firstName: currentUser.name,
        middleName: currentUser.middle_name,
        email: currentUser.email,
    };

    const columns: TableColumnsType<RequestData> = [
        {
            dataIndex: 'id',
            key: 'id',
            width: 83,
            render: (id: number, record: RequestData) => (
                <div style={{display: 'flex', flexDirection: 'column'}}>
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
            {formatSubmissionTime(record.submissionTime)}
          </span>
                </div>
            )
        },
        {
            dataIndex: 'name',
            key: 'name',
            width: 185,
            render: (name: string) => (
                <div style={{padding: '0', margin: '0'}}>{name}</div>
            )
        },
        {
            dataIndex: 'requestSubject',
            key: 'requestSubject',
            width: 135,
            render: (subject: string) => (
                <div style={{padding: '0', margin: '0'}}>{subject}</div>
            )
        },
        {
            dataIndex: 'system',
            key: 'system',
            width: 70,
            render: (system: string) => (
                <div style={{padding: '0', margin: '0'}}>{system}</div>
            )
        },
        {
            dataIndex: 'role',
            key: 'role',
            width: 150,
            render: (role: string) => (
                <div style={{padding: '0', margin: '0'}}>{role}</div>
            )
        }
    ];

    function formatSubmissionTime(dateString: string) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
        }
    }

    const showModal = (type: 'grant' | 'revoke') => {
        setRequestType(type);
        setIsModalVisible(true);
    };

    const closeModal = () => setIsModalVisible(false);

    const onClickMyReq = () => {
        router.replace('/outgoing');
    };

    const modalTitleStyle = {
        textAlign: 'center' as const,
        fontSize: '20px',
        fontWeight: 500,
        marginBottom: '20px'
    };

    return (
        <Layout>
            <Layout.Header style={{paddingLeft: 16, background: colorBgContainer, height: '100px'}}>
                <Breadcrumb
                    style={{margin: '16px 0'}}
                    items={[
                        {title: 'Главная'},
                        {title: 'Заявки'},
                    ]}
                />
                <Title level={4}>Главная</Title>
            </Layout.Header>
            <Layout.Content style={{margin: '0 16px', paddingTop: '16px'}}>
                <div
                    style={{
                        padding: 24,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        marginBottom: 24,
                    }}
                >
                    <Flex gap="small" wrap style={{gap: 24, display: 'flex'}}>
                        <Button type="primary" onClick={() => showModal('grant')}>
                            Запросить доступ
                        </Button>

                        <Button type="primary" onClick={() => showModal('revoke')}>
                            Отозвать доступ
                        </Button>

                        <Button type="primary" onClick={onClickMyReq}>
                            Мои доступы
                        </Button>
                    </Flex>

                    <Modal
                        title={<div style={modalTitleStyle}>
                            {requestType === 'grant' ? 'Форма запроса доступа' : 'Форма отзыва доступа'}
                        </div>}
                        open={isModalVisible}
                        onCancel={closeModal}
                        footer={null}
                        centered
                        width={600}
                    >
                        <RequestForm
                            type={requestType}
                            initialValues={initialValues}
                            onClose={closeModal}
                        />
                    </Modal>
                </div>

                <Row gutter={16}>
                    <Col span={12}>
                        <Card
                            title="Последние отправленные заявки"
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
                                scroll={{x: 600}}
                                showHeader={false}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card
                            title="Последние входящие заявки"
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
                                dataSource={[]}
                                columns={columns}
                                pagination={false}
                                size="small"
                                locale={{emptyText: "Нет входящих заявок"}}
                                scroll={{x: 600}}
                                showHeader={false}
                            />
                        </Card>
                    </Col>
                </Row>
            </Layout.Content>
        </Layout>
    );
}