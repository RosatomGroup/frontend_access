import React from 'react';
import { Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { reqOutdata } from '../reqOut';

interface DataType {
  id: number;
  name: string;
  role: string;
  status: string;
  system: string;
  submissionTime: string;
}

interface OutReqTableProps {
  tableTitle?: string;
  showFilters?: boolean;
}

const OutReqTable: React.FC<OutReqTableProps> = ({ 
  tableTitle = 'Заявки',
  showFilters = true 
}) => {
  const columns: TableColumnsType<DataType> = [
    {
      title: '№',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      width: 80,
    },
    {
      title: 'ФИО',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...(showFilters && {
        filters: [
          { text: 'Иванов', value: 'Иванов' },
          { text: 'Петров', value: 'Петров' },
        ],
        onFilter: (value, record) => record.name.includes(value as string),
      }),
      width: '20%',
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status: string) => (
        <Tag color={
          status === 'в работе' ? 'blue' : 
          status === 'завершено' ? 'green' : 'red'
        }>
          {status}
        </Tag>
      ),
      ...(showFilters && {
        filters: [
          { text: 'В работе', value: 'в работе' },
          { text: 'Завершено', value: 'завершено' },
          { text: 'Отклонено', value: 'отклонено' },
        ],
        onFilter: (value, record) => record.status === value,
      }),
      width: '15%',
    },
    {
      title: 'Система',
      dataIndex: 'system',
      key: 'system',
      sorter: (a, b) => a.system.localeCompare(b.system),
    },
    {
      title: 'Время подачи',
      dataIndex: 'submissionTime',
      key: 'submissionTime',
      sorter: (a, b) => new Date(a.submissionTime).getTime() - new Date(b.submissionTime).getTime(),
      render: (time: string) => new Date(time).toLocaleString(),
      width: '20%',
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>{tableTitle}</h2>
      <Table
        columns={columns}
        dataSource={reqOutdata}
        pagination={{ pageSize: 10 }}
        rowKey="id"
        bordered
      />
    </div>
  );
};

export default OutReqTable;