'use client';

import {
    Breadcrumb,
    Button,
    ConfigProvider,
    Form,
    Input,
    Layout,
    message,
    Modal,
    Select,
    theme,
    Typography,
} from 'antd';
import AppSider from '../../../../components/AppSider';
import AppHeader from '../../../../components/AppHeader';
import {PlusOutlined} from '@ant-design/icons';
import TableRole from '@/app/tables/RolesTable';
import ruRU from 'antd/locale/ru_RU';
import {useEffect, useState} from 'react';
import {createRole, fetchResources, Resource} from '@/api/roles';

const {Header, Content} = Layout;
const {Option} = Select;

export default function RoleManagement() {
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        loadResources();
    }, []);

    const loadResources = async () => {
        try {
            setLoading(true);
            const data = await fetchResources();
            setResources(data);
        } catch (error) {
            message.error('Ошибка загрузки списка систем');
        } finally {
            setLoading(false);
        }
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            setTableLoading(true);
            const values = await form.validateFields();

            await createRole({
                name: values.name,
                description: values.description,
                resourceId: values.resourceId,
            });

            message.success('Роль успешно создана');
            setIsModalOpen(false);
            form.resetFields();
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            if (error instanceof Error) {
                message.error(error.message);
            }
        } finally {
            setTableLoading(false);
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
                                    title: 'Роли',
                                },
                            ]}
                        />
                        <Typography.Title level={4}>Роли</Typography.Title>
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
                                    Роли
                                </Typography.Title>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined/>}
                                    onClick={showModal}
                                    loading={loading}
                                >
                                    Добавить роль
                                </Button>
                            </div>
                            <ConfigProvider locale={ruRU}>
                                <TableRole loading={tableLoading} refreshTrigger={refreshTrigger}/>
                            </ConfigProvider>
                        </div>
                    </Content>
                </Layout>
            </Layout>

            <Modal
                title="Добавить новую роль"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Сохранить"
                cancelText="Отмена"
                width={600}
                confirmLoading={tableLoading}
            >
                <Form form={form} layout="vertical" autoComplete="off">
                    <Form.Item
                        name="name"
                        label="Название роли"
                        rules={[
                            {required: true, message: 'Пожалуйста, введите название роли'},
                            {max: 100, message: 'Максимальная длина 100 символов'}
                        ]}
                    >
                        <Input placeholder="Введите название роли"/>
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Описание роли"
                        rules={[
                            {required: true, message: 'Пожалуйста, введите описание роли'},
                            {max: 255, message: 'Максимальная длина 255 символов'}
                        ]}
                    >
                        <Input.TextArea rows={4} placeholder="Введите описание роли"/>
                    </Form.Item>
                    <Form.Item
                        name="resourceId"
                        label="Система"
                        rules={[{required: true, message: 'Пожалуйста, выберите систему'}]}
                    >
                        <Select
                            placeholder="Выберите систему"
                            loading={loading}
                        >
                            {resources.map((resource) => (
                                <Option key={resource.id} value={resource.id}>
                                    {resource.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
}