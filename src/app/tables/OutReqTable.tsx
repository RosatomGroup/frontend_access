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
      {
        text: 'Иванов',
        value: 'Иванов',
      },
      {
        text: 'Петров',
        value: 'Петров',
      },
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
      if (status.length === 28) {
        return <Tag color="success">{status}</Tag>;
      } else if (status.length < 20 && status.length > 15) {
        return <Tag color="processing">{status}</Tag>;
      } else if (status == 'cglasby8@gov.uk') {
        return <Tag color="error">{status}</Tag>;
      } else return <Tag color="warning">{status}</Tag>;
    },

    filters: [
      {
        text: 'Группа обеспечения испытаний',
        value: 'Группа',
      },
      {
        text: 'ОСП',
        value: 'ОСП',
      },
    ],
    onFilter: (value, record) => record.status.startsWith(value as string),
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
        locale: {
          items_per_page: `/ стр`,
        },
      }}
    />
  );
};

export default OutReqTable;
