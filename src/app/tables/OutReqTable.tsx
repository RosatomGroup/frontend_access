import React from 'react';
import { Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { reqOutdata } from '../reqOut';
import { useState } from 'react';

interface DataType {
  name: string;
  role: string;
  id: number;
  status: string;
  system: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: '№',
    dataIndex: 'id',
  },
  {
    title: 'ФИО',
    dataIndex: 'name',
    filters: [
      { text: 'Иванов', value: 'Иванов' },
      { text: 'Петров', value: 'Петров' },
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.name.includes(value as string),
    width: '30%',
  },
  {
    title: 'Описание роли',
    dataIndex: 'role',
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    render: (status) => {
      if (status === 'в работе') {
        return <Tag color="processing">{status}</Tag>;
      }
      // Добавьте другие условия для статусов по необходимости
      return <Tag color="default">{status}</Tag>;
    },
    filters: [
      { text: 'в работе', value: 'в работе' },
      // Другие возможные статусы
    ],
    onFilter: (value, record) => record.status === value,
    filterSearch: true,
    width: '10%',
  },
  {
    title: 'Система',
    dataIndex: 'system',
  },
];

const OutReqTable: React.FC = () => {
  const [pageSize, setPageSize] = useState<number>(10);

  const handlePageSizeChange = (current: number, size: number) => {
    setPageSize(size);
  };

  return (
    <Table<DataType>
      dataSource={reqOutdata}
      columns={columns}
      pagination={{
        pageSize: pageSize,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        onShowSizeChange: handlePageSizeChange,
        showTotal: (total, range) => `Показано ${range[0]}-${range[1]} из ${total} записей`,
        locale: { items_per_page: '/ стр' },
      }}
      rowKey="id"
    />
  );
};

export default OutReqTable;