import React, {useEffect, useState} from 'react';
import {ConfigProvider, Grid, message, Spin, Table, TableColumnsType} from 'antd';
import {fetchUsers, User} from "@/api/users";

const {useBreakpoint} = Grid;

interface DataType extends User {
    key: React.Key;
}

interface TableUserProps {
    refreshTrigger?: number;
}

const TableUser: React.FC<TableUserProps> = ({ refreshTrigger }) => {
    const screens = useBreakpoint();
    const [pageSize, setPageSize] = useState<number>(10);
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [columns, setColumns] = useState<TableColumnsType<DataType>>([]);
    const [messageApi, contextHolder] = message.useMessage();

    const loadData = async () => {
        try {
            setLoading(true);
            const users = await fetchUsers();
            const formattedData = users.map((user, index) => ({
                ...user,
                key: user.id || `user-${index}`,
            }));
            setData(formattedData);
            createDynamicFilters(formattedData);
        } catch (error) {
            messageApi.error('Ошибка загрузки данных пользователей');
            console.error('Ошибка загрузки пользователей:', error);
        } finally {
            setLoading(false);
        }
    };

    const createDynamicFilters = (data: DataType[]) => {
        if (!data || data.length === 0) return;

        const uniqueRangs = [...new Set(data.map(item => item.rang))]
            .filter(Boolean)
            .map(rang => ({
                text: rang as string,
                value: rang as string,
            }));

        const uniqueSubdivisions = [...new Set(data.map(item => item.subdivision))]
            .filter(Boolean)
            .map(subdivision => ({
                text: subdivision as string,
                value: subdivision as string,
            }));

        const baseColumns: TableColumnsType<DataType> = [
            {
                title: 'ФИО',
                dataIndex: 'name',
                key: 'name',
                filterMode: 'tree',
                filterSearch: true,
                onFilter: (value, record) => record.name.includes(value as string),
                sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
                width: screens.xs ? 150 : '30%',
                fixed: screens.xs ? 'left' : false,
                ellipsis: true,
            },
            {
                title: 'Должность',
                dataIndex: 'rang',
                key: 'rang',
                filters: uniqueRangs,
                onFilter: (value, record) => record.rang === value,
                sorter: (a, b) => (a.rang || '').localeCompare(b.rang || ''),
                width: screens.xs ? 120 : undefined,
                ellipsis: true,
            },
            {
                title: 'Подразделение',
                dataIndex: 'subdivision',
                key: 'subdivision',
                filters: uniqueSubdivisions,
                onFilter: (value, record) => record.subdivision === value,
                filterSearch: true,
                sorter: (a, b) => (a.subdivision || '').localeCompare(b.subdivision || ''),
                width: screens.xs ? 120 : '30%',
                ellipsis: true,
            },
            {
                title: 'Почта',
                dataIndex: 'email',
                key: 'email',
                sorter: (a, b) => (a.email || '').localeCompare(b.email || ''),
                width: screens.xs ? 150 : undefined,
                ellipsis: true,
                responsive: ['md'],
            },
        ];

        setColumns(screens.xs ?
            baseColumns.filter(col => !col.responsive || (col.responsive && screens.md)) :
            baseColumns
        );
    };

    useEffect(() => {
        loadData();
    }, [refreshTrigger]);

    useEffect(() => {
        if (data.length > 0) {
            createDynamicFilters(data);
        }
    }, [screens]);

    const handlePageSizeChange = (current: number, size: number) => {
        setPageSize(size);
    };

    return (
        <ConfigProvider
            theme={{
                components: {
                    Table: {
                        cellPaddingBlock: screens.xs ? 8 : 16,
                        cellPaddingInline: screens.xs ? 8 : 16,
                    },
                },
            }}
        >
            {contextHolder}
            <Spin spinning={loading}>
                <Table<DataType>
                    dataSource={data}
                    columns={columns}
                    rowKey={(record) => record.key}
                    scroll={screens.xs ? {x: 800} : undefined}
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
                />
            </Spin>
        </ConfigProvider>
    );
};

export default TableUser;