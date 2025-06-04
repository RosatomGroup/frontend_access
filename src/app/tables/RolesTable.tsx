import React, { useEffect, useState, useCallback } from 'react'; // Добавлен useMemo
import { ConfigProvider, message, Spin, Table, TableColumnsType } from 'antd';
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import { fetchRoles, Role } from '@/api/roles';

interface DataType extends Role {
    key: React.Key;
}

interface TableRoleProps {
    loading?: boolean;
    refreshTrigger?: number;
}

const TableRole: React.FC<TableRoleProps> = ({ loading: externalLoading, refreshTrigger }) => {
    const screens = useBreakpoint();
    const [pageSize, setPageSize] = useState<number>(10);
    const [columns, setColumns] = useState<TableColumnsType<DataType>>([]);
    const [data, setData] = useState<DataType[]>([]);
    const [internalLoading, setInternalLoading] = useState<boolean>(true);
    const [messageApi, contextHolder] = message.useMessage();

    // Оборачиваем createDynamicFilters в useCallback
    const createDynamicFilters = useCallback((data: DataType[]) => {
        const uniqueName = [...new Set(data.map(item => item.name))].map(name => ({
            text: name,
            value: name,
        }));

        const uniqueResources = [...new Set(data.map(item => item.resourceName))].map(resource => ({
            text: resource,
            value: resource,
        }));

        const newColumns: TableColumnsType<DataType> = [
            {
                title: 'Наименование',
                dataIndex: 'name',
                key: 'name',
                filterMode: 'tree',
                filterSearch: true,
                filters: uniqueName,
                onFilter: (value, record) => record.name.includes(value as string),
                sorter: (a, b) => a.name.localeCompare(b.name),
                width: screens.xs ? 180 : screens.md ? '25%' : '20%',
                fixed: screens.xs ? 'left' : false,
                ellipsis: true,
            },
            {
                title: 'Описание',
                dataIndex: 'description',
                key: 'description',
                width: screens.xs ? 150 : screens.md ? '30%' : '25%',
            },
            {
                title: 'Система',
                dataIndex: 'resourceName',
                key: 'resourceName',
                filters: uniqueResources,
                onFilter: (value, record) => record.resourceName === value,
                filterSearch: true,
                sorter: (a, b) => a.resourceName?.localeCompare(b.resourceName || '') || 0,
                width: screens.xs ? 120 : screens.md ? '25%' : '20%',
                ellipsis: true,
            }
        ];

        setColumns(newColumns);
    }, [screens]); // Зависимости для createDynamicFilters: screens и setColumns (setColumns стабилен)

    // Оборачиваем loadData в useCallback
    const loadData = useCallback(async () => {
        try {
            setInternalLoading(true);
            const roles = await fetchRoles();
            const formattedData = roles.map((role, index) => ({
                ...role,
                key: role.id || `role-${index}`,
            }));
            setData(formattedData);
            createDynamicFilters(formattedData); // Используем стабильную версию createDynamicFilters
        } catch (error) {
            messageApi.error('Ошибка загрузки данных');
            console.error(error);
        } finally {
            setInternalLoading(false);
        }
    }, [messageApi, createDynamicFilters]); // Зависимости для loadData: messageApi и createDynamicFilters

    useEffect(() => {
        loadData(); // Теперь loadData является стабильной функцией
    }, [refreshTrigger, loadData]); // Добавлена loadData в массив зависимостей

    const handlePageSizeChange = (current: number, size: number) => {
        setPageSize(size);
    };

    const isLoading = externalLoading || internalLoading;

    return (
        <ConfigProvider
            theme={{
                components: {
                    Table: {
                        cellPaddingBlock: screens.xs ? 8 : 12,
                        cellPaddingInline: screens.xs ? 8 : 16,
                    },
                },
            }}
        >
            {contextHolder}
            <Spin spinning={isLoading}>
                <Table<DataType>
                    dataSource={data}
                    columns={columns}
                    rowKey={(record) => record.key}
                    scroll={{
                        x: screens.xs ? 800 : undefined,
                        y: screens.xs ? 'calc(100vh - 200px)' : undefined
                    }}
                    pagination={{
                        pageSize: pageSize,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        onShowSizeChange: handlePageSizeChange,
                        showTotal: (total, range) => `Показано ${range[0]}-${range[1]} из ${total} записей`,
                        locale: {
                            items_per_page: `/ стр`,
                        },
                        size: screens.xs ? 'small' : 'default',
                    }}
                    size={screens.xs ? 'small' : 'middle'}
                    bordered={!screens.xs}
                    sticky={screens.xs}
                />
            </Spin>
        </ConfigProvider>
    );
};

export default TableRole;