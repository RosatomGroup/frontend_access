import React, {useEffect, useState} from 'react';
import {ConfigProvider, Table, TableColumnsType} from 'antd';
import {systemsData} from "@/app/tables/systems";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";

interface DataType {
    key: React.Key;
    name: string;
    description: string;
    owner: string;
}

const TableSystem: React.FC = () => {
    const screens = useBreakpoint();
    const [pageSize, setPageSize] = useState<number>(10);
    // const [data, setData] = useState<DataType[]>([]);
    const [columns, setColumns] = useState<TableColumnsType<DataType>>([]);


    // useEffect(() => {
    //     const loadData = async () => {
    //         const users = await fetchSystems();
    //         setData(users);
    //         createDynamicFilters(users);
    //     };
    //
    //     loadData();
    // }, []);

    const createDynamicFilters = (data: DataType[]) => {
        const uniqueName = [...new Set(data.map(item => item.name))].map(rang => ({
            text: rang,
            value: rang,
        }));

        const uniqueOwners = [...new Set(data.map(item => item.owner))].map(place => ({
            text: place,
            value: place,
        }));

        const newColumns: TableColumnsType<DataType> = [
            {
                title: '№',
                dataIndex: 'key',
                filterSearch: true,
                width: '5%',
            },
            {
                title: 'Наименование',
                dataIndex: 'name',
                filterMode: 'tree',
                filterSearch: true,
                filters: uniqueName,
                onFilter: (value, record) => record.name.includes(value as string),
                sorter: (a, b) => a.name.localeCompare(b.name),
                width: '20%',
            },
            {
                title: 'Описание',
                dataIndex: 'description',
            },

            {
                title: 'Владелец',
                dataIndex: 'owner',
                filters: uniqueOwners,
                onFilter: (value, record) => record.owner === value,
                sorter: (a, b) => a.owner.localeCompare(b.owner),
                width: '30%',
            },
        ];

        setColumns(newColumns);
    };

    useEffect(() => {
        createDynamicFilters(systemsData);
    }, []);

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
            <Table<DataType>
                dataSource={systemsData}
                columns={columns}
                scroll={screens.xs ? {x: 600} : undefined}
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
        </ConfigProvider>
    );
};

export default TableSystem;