import React from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

export interface BackendRequestDataType {
  id: number;
  name: string;
  surname: string;
  middleName: string;
  email: string;
  requestType: 'GRANT_ACCESS' | 'REVOKE_ACCESS';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createDate: string;
  completeDate?: string;
  resourceId: number;
  roleId: number;
  resourceName: string;
  roleName: string;
  resourceLink?: string;
  userId?: number;
}

interface OutReqTableProps {
  dataSource: BackendRequestDataType[];
  loading: boolean;
}

const OutReqTable: React.FC<OutReqTableProps> = ({ dataSource, loading }) => {
  const renderFullName = (text: any, record: BackendRequestDataType) => (
      <div>
        <div>{record.surname}</div>
        <div>{record.name} {record.middleName || ''}</div>
      </div>
  );

  const getSurname = (record: BackendRequestDataType) => record.surname;

  const surnameFilters = Array.from(
      new Set(dataSource.map(item => getSurname(item)))
  ).map(surname => ({
    text: surname,
    value: surname,
  }));

  const columns: ColumnsType<BackendRequestDataType> = [
    {
      title: '№',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      width: '5%',
    },
    {
      title: 'ФИО',
      key: 'fullName',
      render: renderFullName,
      sorter: (a, b) => `${a.surname} ${a.name}`.localeCompare(`${b.surname} ${b.name}`),
      filters: surnameFilters,
      onFilter: (value, record) => getSurname(record) === value,
      filterSearch: true,
      width: '15%',
    },
    {
      title: 'Тип запроса',
      dataIndex: 'requestType',
      key: 'requestType',
      width: '10%',
      render: (type: BackendRequestDataType['requestType']) =>
          type === 'GRANT_ACCESS' ? 'Предоставить доступ' : 'Отозвать доступ',
      filters: [
        { text: 'Предоставить доступ', value: 'GRANT_ACCESS' },
        { text: 'Отозвать доступ', value: 'REVOKE_ACCESS' },
      ],
      onFilter: (value, record) => record.requestType === value,
    },
    {
      title: 'Система',
      dataIndex: 'resourceName',
      key: 'resourceName',
      width: '10%',
      sorter: (a, b) => a.resourceName.localeCompare(b.resourceName),
    },
    {
      title: 'Роль',
      dataIndex: 'roleName',
      key: 'roleName',
      width: '15%',
      sorter: (a, b) => a.roleName.localeCompare(b.roleName),
    },
    {
      title: 'Почта',
      dataIndex: 'email',
      key: 'email',
      width: '10%',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status: BackendRequestDataType['status']) => {
        let color = 'default';
        let text = status;
        if (status === 'PENDING') { color = 'blue'; text = 'В работе'; }
        else if (status === 'APPROVED') { color = 'green'; text = 'Завершено'; }
        else if (status === 'REJECTED') { color = 'red'; text = 'Отклонено'; }
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'В работе', value: 'PENDING' },
        { text: 'Завершено', value: 'APPROVED' },
        { text: 'Отклонено', value: 'REJECTED' },
      ],
      onFilter: (value, record) => record.status === value,
      width: '10%',
    },
    {
      title: 'Дата создания',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: (a, b) => new Date(a.createDate).getTime() - new Date(b.createDate).getTime(),
      render: (time: string) => new Date(time).toLocaleString(),
      width: '15%',
    },
  ];

  return (
      <Table
          scroll={{ x: 800 }}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={{ pageSize: 10 }}
          rowKey="id"
      />
  );
};

export default OutReqTable;