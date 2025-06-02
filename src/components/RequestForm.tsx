'use client';

import { Form, Input, Select, Checkbox, Button, notification } from 'antd';
import { useRouter } from 'next/navigation';
import {useEffect, useState} from 'react';
import {useRequestForm} from "@/hooks/useRequestForm";
import {api} from "@/api/axios.config";

interface RequestFormProps {
    type: 'grant' | 'revoke';
    initialValues: {
        lastName: string;
        firstName: string;
        middleName?: string;
        email: string;
    };
    onClose: () => void;
}

export const RequestForm = ({ type, initialValues, onClose }: RequestFormProps) => {
    const [form] = Form.useForm();
    const [apiNotification, contextHolder] = notification.useNotification();
    const router = useRouter();
    const [isRequestForOtherUser, setIsRequestForOtherUser] = useState(false);

    const { isLoading, resources, filteredRoles, handleResourceChange } =
        useRequestForm(initialValues);

    useEffect(() => {
        form.setFieldsValue(initialValues);
    }, [form, initialValues]);

    const handleSubmit = async (values: any) => {
        try {
            const payload = {
                ...values,
                type,
                isForOtherUser: isRequestForOtherUser,
                resourceId: values.resource,
                roleId: values.role,
            };

            const response = await api.post('/requests', payload);

            if (response.status === 201) {
                apiNotification.success({
                    message: 'Успех',
                    description: `Заявка на ${type === 'grant' ? 'предоставление' : 'отзыв'} доступа успешно создана`,
                });
                onClose();
                router.refresh();
            }
        } catch (error) {
            apiNotification.error({
                message: 'Ошибка',
                description: 'Не удалось отправить заявку',
            });
        }
    };

    return (
        <>
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={initialValues}
            >
                <Form.Item
                    label="Фамилия"
                    name="lastName"
                    rules={[{ required: true, message: 'Введите фамилию' }]}
                >
                    <Input disabled={!isRequestForOtherUser} />
                </Form.Item>

                <Form.Item
                    label="Имя"
                    name="firstName"
                    rules={[{ required: true, message: 'Введите имя' }]}
                >
                    <Input disabled={!isRequestForOtherUser} />
                </Form.Item>

                <Form.Item label="Отчество" name="middleName">
                    <Input disabled={!isRequestForOtherUser} />
                </Form.Item>

                <Form.Item>
                    <Checkbox
                        checked={isRequestForOtherUser}
                        onChange={e => setIsRequestForOtherUser(e.target.checked)}
                    >
                        Подать заявку за другого пользователя
                    </Checkbox>
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Введите email' },
                        { type: 'email', message: 'Некорректный email' }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Система"
                    name="resource"
                    rules={[{ required: true, message: 'Выберите систему' }]}
                >
                    <Select
                        loading={isLoading}
                        options={resources.map(resource => ({
                            value: resource.id,
                            label: resource.name,
                        }))}
                        onChange={handleResourceChange}
                        placeholder="Выберите систему"
                    />
                </Form.Item>

                <Form.Item
                    label="Роль"
                    name="role"
                    rules={[{ required: true, message: 'Выберите роль' }]}
                >
                    <Select
                        loading={isLoading}
                        disabled={!form.getFieldValue('resource')}
                        options={filteredRoles.map(role => ({
                            value: role.id,
                            label: role.name,
                        }))}
                        placeholder={form.getFieldValue('resource') ? "Выберите роль" : "Сначала выберите систему"}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Отправить
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};