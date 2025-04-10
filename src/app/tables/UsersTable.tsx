import React from 'react';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { usersdata } from '../users';
import { useState } from 'react';

interface DataType {
  key: React.Key;
  name: string;
  rang: string;
  place: string;
  address: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'ФИО',
    dataIndex: 'name',
    // filters: [
    //   {
    //     text: 'Иванов',
    //     value: 'Иванов',
    //   },
    //   {
    //     text: 'Петров',
    //     value: 'Петров',
    //   },
    // ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.name.includes(value as string),
    width: '30%',
  },
  {
    title: 'Должность',
    dataIndex: 'rang',
  },
  {
    title: 'Подразделение',
    dataIndex: 'place',
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
    onFilter: (value, record) => record.place.startsWith(value as string),
    filterSearch: true,
    width: '30%',
  },

  {
    title: 'Почта',
    dataIndex: 'address',
  },
];

const TableUser: React.FC = () => {
  const [pageSize, setPageSize] = useState<number>(10);

  const handlePageSizeChange = (current: number, size: number) => {
    setPageSize(size);
  };

  return (
    <Table<DataType>
      dataSource={usersdata}
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

export default TableUser;
