'use client';

import {Breadcrumb, Button, ConfigProvider, Form, Input, Layout, message, Modal, theme, Typography,} from 'antd';
import AppSider from '../../../../components/AppSider';
import AppHeader from '../../../../components/AppHeader';
import {PlusOutlined} from '@ant-design/icons';
import ruRU from 'antd/locale/ru_RU';
import TableResource from '@/app/tables/ResourceTable';
import {useState} from 'react';
import {createResource} from '@/api/resource';

const {Header, Content} = Layout;

export default function ResourcePage() {
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            await createResource({
                name: values.name,
                description: values.description,
                link: values.link,
                owner: values.owner
            });

            message.success('Ресурс успешно создан');
            setIsModalOpen(false);
            form.resetFields();
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            message.error('Ошибка при создании ресурса');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

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
                                    title: 'Ресурсы',
                                },
                            ]}
                        />
                        <Typography.Title level={4}>Ресурсы</Typography.Title>
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
                                    Ресурсы
                                </Typography.Title>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined/>}
                                    onClick={showModal}
                                >
                                    Добавить ресурс
                                </Button>
                            </div>
                            <ConfigProvider locale={ruRU}>
                                <TableResource refreshTrigger={refreshTrigger}/>
                            </ConfigProvider>
                        </div>
                    </Content>
                </Layout>
            </Layout>

            <Modal
                title="Добавить новый ресурс"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Сохранить"
                cancelText="Отмена"
                confirmLoading={loading}
                width={700}
            >
                <Form form={form} layout="vertical" autoComplete="off">
                    <Form.Item
                        name="name"
                        label="Название ресурса"
                        rules={[
                            {required: true, message: 'Пожалуйста, введите название ресурса'},
                            {max: 100, message: 'Максимальная длина 100 символов'}
                        ]}
                    >
                        <Input placeholder="Введите название ресурса"/>
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Описание"
                        rules={[
                            {required: true, message: 'Пожалуйста, введите описание'},
                            {max: 255, message: 'Максимальная длина 255 символов'}
                        ]}
                    >
                        <Input.TextArea rows={4} placeholder="Введите описание ресурса"/>
                    </Form.Item>
                    <Form.Item
                        name="link"
                        label="Ссылка"
                        rules={[
                            {required: true, message: 'Пожалуйста, введите ссылку'},
                            {type: 'url', message: 'Введите корректный URL'},
                            {max: 255, message: 'Максимальная длина 255 символов'}
                        ]}
                    >
                        <Input placeholder="https://example.com"/>
                    </Form.Item>
                    <Form.Item
                        name="owner"
                        label="Владелец"
                        rules={[
                            {required: true, message: 'Пожалуйста, укажите владельца'},
                            {max: 255, message: 'Максимальная длина 255 символов'}
                        ]}
                    >
                        <Input placeholder="Введите владельца ресурса"/>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
}