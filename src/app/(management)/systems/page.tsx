'use client';

import { Breadcrumb, Button, ConfigProvider, Layout, theme, Typography, Modal, Form, Input } from 'antd';
import AppSider from '../../../components/AppSider';
import AppHeader from '../../../components/AppHeader';
import { PlusOutlined } from "@ant-design/icons";
import ruRU from "antd/locale/ru_RU";
import TableSystem from "@/app/tables/SystemsTable";
import { useState } from 'react';

const { Header, Content } = Layout;

export default function IncomingRequest() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                console.log('Данные системы:', values);

                setIsModalOpen(false);
                form.resetFields();
            })
            .catch(info => {
                console.log('Ошибка валидации:', info);
            });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

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
                                    title: 'Управление',
                                },
                                {
                                    title: 'Системы',
                                },
                            ]}
                        />
                        <Typography.Title level={4}>Системы</Typography.Title>
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                <Typography.Title level={4} style={{ margin: 0 }}>Системы</Typography.Title>
                                <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                                    Добавить систему
                                </Button>
                            </div>
                            <ConfigProvider locale={ruRU}>
                                <TableSystem />
                            </ConfigProvider>
                        </div>
                    </Content>
                </Layout>
            </Layout>

            <Modal
                title="Добавить новую систему"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Сохранить"
                cancelText="Отмена"
            >
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item
                        name="name"
                        label="Название системы"
                        rules={[{ required: true, message: 'Пожалуйста, введите название системы' }]}
                    >
                        <Input placeholder="Введите название системы" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Описание"
                        rules={[{ required: true, message: 'Пожалуйста, введите описание системы' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Введите описание системы" />
                    </Form.Item>
                    <Form.Item
                        name="owner"
                        label="Владелец"
                        rules={[{ required: true, message: 'Пожалуйста, укажите владельца системы' }]}
                    >
                        <Input placeholder="Введите владельца системы" />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
}