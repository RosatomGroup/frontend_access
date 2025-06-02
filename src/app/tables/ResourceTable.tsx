import React, {useEffect, useState} from 'react';
import {ConfigProvider, Table, TableColumnsType, Spin, message} from 'antd';
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import {fetchResources, Resource} from "@/api/resource";

interface DataType extends Resource {
    key: React.Key;
}

interface TableResourceProps {
    refreshTrigger?: number;
}

const TableResource: React.FC<TableResourceProps> = ({ refreshTrigger }) => {
    const screens = useBreakpoint();
    const [pageSize, setPageSize] = useState<number>(10);
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [columns, setColumns] = useState<TableColumnsType<DataType>>([]);

    const loadData = async () => {
        try {
            setLoading(true);
            const resources = await fetchResources();
            const formattedData = resources.map((resource) => ({
                ...resource,
                key: resource.id,
            }));
            setData(formattedData);
            createDynamicFilters(formattedData);
        } catch (error) {
            message.error('Ошибка загрузки данных');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const createDynamicFilters = (data: DataType[]) => {
        const uniqueName = [...new Set(data.map(item => item.name))].map(name => ({
            text: name,
            value: name,
        }));

        const uniqueOwners = [...new Set(data.map(item => item.owner))].map(owner => ({
            text: owner,
            value: owner,
        }));

        const newColumns: TableColumnsType<DataType> = [
            {
                title: 'Наименование',
                dataIndex: 'name',
                filterMode: 'tree',
                filterSearch: true,
                filters: uniqueName,
                onFilter: (value, record) => record.name.includes(value as string),
                sorter: (a, b) => a.name.localeCompare(b.name),
                width: screens.xs ? '30%' : '25%',
            },
            {
                title: 'Описание',
                dataIndex: 'description',
                width: screens.xs ? '40%' : '35%',
            },
            {
                title: 'Ссылка',
                dataIndex: 'link',
                render: (text) => (
                    <a href={text} target="_blank" rel="noopener noreferrer">
                        {text}
                    </a>
                ),
                width: '20%',
            },
            {
                title: 'Владелец',
                dataIndex: 'owner',
                filters: uniqueOwners,
                onFilter: (value, record) => record.owner === value,
                sorter: (a, b) => a.owner.localeCompare(b.owner),
                width: screens.xs ? '30%' : '20%',
            },
        ];

        setColumns(newColumns);
    };

    useEffect(() => {
        loadData();
    }, [refreshTrigger]);

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
            <Spin spinning={loading}>
                <Table<DataType>
                    dataSource={data}
                    columns={columns}
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

export default TableResource;