import React, {useEffect, useState} from 'react';
import {ConfigProvider, Table, TableColumnsType} from 'antd';
import {rolesData} from "@/app/tables/roles";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";

interface DataType {
    key: React.Key;
    name: string;
    description: string;
    system: string;
    owner: string;
}

const TableRole: React.FC = () => {
    const screens = useBreakpoint();
    const [pageSize, setPageSize] = useState<number>(10);
    const [columns, setColumns] = useState<TableColumnsType<DataType>>([]);

    const createDynamicFilters = (data: DataType[]) => {
        const uniqueName = [...new Set(data.map(item => item.name))].map(rang => ({
            text: rang,
            value: rang,
        }));

        const uniqueSystems = [...new Set(data.map(item => item.system))].map(place => ({
            text: place,
            value: place,
        }));

        const uniqueOwners = [...new Set(data.map(item => item.owner))].map(place => ({
            text: place,
            value: place,
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
                width: screens.xs ? 180 : screens.md ? '25%' : '20%',
                fixed: screens.xs ? 'left' : false,
                ellipsis: true,
            },
            {
                title: 'Описание',
                dataIndex: 'description',
                width: screens.xs ? 150 : screens.md ? '30%' : '25%',
            },
            {
                title: 'Система',
                dataIndex: 'system',
                filters: uniqueSystems,
                onFilter: (value, record) => record.system === value,
                filterSearch: true,
                sorter: (a, b) => a.system.localeCompare(b.system),
                width: screens.xs ? 120 : screens.md ? '25%' : '20%',
                ellipsis: true,
            },
            {
                title: 'Владелец',
                dataIndex: 'owner',
                filters: uniqueOwners,
                onFilter: (value, record) => record.owner === value,
                sorter: (a, b) => a.owner.localeCompare(b.owner),
                width: screens.xs ? 120 : '15%',
                ellipsis: true,
                responsive: ['md'],
            },
        ];

        setColumns(newColumns);
    };

    useEffect(() => {
        createDynamicFilters(rolesData);
    }, [screens, createDynamicFilters]);

    const handlePageSizeChange = (current: number, size: number) => {
        setPageSize(size);
    };

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
            <Table<DataType>
                dataSource={rolesData}
                columns={columns}
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
        </ConfigProvider>
    );
};

export default TableRole;