import React from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { reqOutdata } from '../reqOut';

interface DataType {
  id: number;
  name: string;
  requestSubject: string;
  role: string;
  status: string;
  system: string;
  submissionTime: string;
  email: string;
}

const OutReqTable: React.FC = () => {
  const getLastName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  const lastNames = Array.from(
    new Set(reqOutdata.map(item => getLastName(item.name)))
  ).map(lastName => ({
    text: lastName,
    value: lastName,
  }));

  const columns: ColumnsType<DataType> = [
    {
      title: '№',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      width: '5%',
    },
    {
      title: 'ФИО',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      filters: lastNames,
      onFilter: (value, record) => getLastName(record.name) === value,
      filterSearch: true,
      width: '10%',
      render: (name: string) => {
        const [lastName, firstName, middleName] = name.split(' ');
        return (
          <div>
            <div>{lastName}</div>
            <div>{firstName} {middleName}</div>
          </div>
        );
      }
    },
    {
      title: 'Тема запроса',
      dataIndex: 'requestSubject',
      key: 'requestSubject',
      width: '10%',
      filters: [
        { text: 'Предоставить доступ', value: 'Предоставить доступ' },
        { text: 'Отозвать доступ', value: 'Отозвать доступ' },
      ],
      onFilter: (value, record) => record.requestSubject === value,
    },
    {
      title: 'Система',
      dataIndex: 'system',
      key: 'system',
      width: '10%',
      sorter: (a, b) => a.system.localeCompare(b.system),
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
      width: '15%',
      sorter: (a, b) => a.role.localeCompare(b.role),
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
      render: (status: string) => (
        <Tag color={
          status === 'в работе' ? 'blue' :
          status === 'завершено' ? 'green' : 'red'
        }>
          {status}
        </Tag>
      ),
      filters: [
        { text: 'В работе', value: 'в работе' },
        { text: 'Завершено', value: 'завершено' },
        { text: 'Отклонено', value: 'отклонено' },
      ],
      onFilter: (value, record) => record.status === value,
      width: '10%',
    },
    {
      title: 'Время подачи',
      dataIndex: 'submissionTime',
      key: 'submissionTime',
      sorter: (a, b) => new Date(a.submissionTime).getTime() - new Date(b.submissionTime).getTime(),
      render: (time: string) => new Date(time).toLocaleString(),
      width: '15%',
    },
  ];

  return (
        <Table
          columns={columns}
          dataSource={reqOutdata}
          pagination={{ pageSize: 10 }}
          rowKey="id"
        />
      );
    };

export default OutReqTable;