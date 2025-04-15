// import React from 'react';
// import { Table, Tag } from 'antd';
// import type { TableColumnsType } from 'antd';
// import { reqOutdata } from '../reqOut';

// interface DataType {
//   id: number;
//   name: string;
//   role: string;
//   status: string;
//   system: string;
//   submissionTime: string;
// }

// const columns: TableColumnsType<DataType> = [
//   {
//     title: '№',
//     dataIndex: 'id',
//     sorter: (a, b) => a.id - b.id,
//     width: '5%',
//   },
//   {
//     title: 'ФИО',
//     dataIndex: 'name',
//     sorter: (a, b) => a.name.localeCompare(b.name),
//     filters: [
//       { text: 'Иванов', value: 'Иванов' },
//       { text: 'Петров', value: 'Петров' },
//     ],
//     onFilter: (value, record) => record.name.includes(value as string),
//     width: '20%',
//   },
//   {
//     title: 'Роль',
//     dataIndex: 'role',
//     width: '20%',
//     sorter: (a, b) => a.role.localeCompare(b.role),
//   },
//   {
//     title: 'Статус',
//     dataIndex: 'status',
//     sorter: (a, b) => a.status.localeCompare(b.status),
//     render: (status) => (
//       <Tag color={
//         status === 'в работе' ? 'blue' :
//         status === 'завершено' ? 'green' : 'red'
//       }>
//         {status}
//       </Tag>
//     ),
//     filters: [
//       { text: 'В работе', value: 'в работе' },
//       { text: 'Завершено', value: 'завершено' },
//       { text: 'Отклонено', value: 'отклонено' },
//     ],
//     onFilter: (value, record) => record.status === value,
//     width: '10%',
//   },
//   {
//     title: 'Система',
//     dataIndex: 'system',
//     width: '10%',
//     sorter: (a, b) => a.system.localeCompare(b.system),
//   },
//   {
//     title: 'Время подачи',
//     dataIndex: 'submissionTime',
//     sorter: (a, b) => new Date(a.submissionTime).getTime() - new Date(b.submissionTime).getTime(),
//     render: (time) => new Date(time).toLocaleString(),
//     width: '15%',
//   },
// ];

// const OutReqTable: React.FC = () => {
//   return (
//     <Table
//       columns={columns}
//       dataSource={reqOutdata}
//       pagination={{ pageSize: 10 }}
//       rowKey="id"
//     />
//   );
// };

// export default OutReqTable;
// OutReqTable.tsx
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
  email: string;
}

const OutReqTable: React.FC = () => {
  // Функция для извлечения фамилии из полного имени
  const getLastName = (fullName: string) => {
    return fullName.split(' ')[0]; // Берем первое слово (фамилию)
  };

  // Получаем уникальные фамилии для фильтра
  const lastNames = Array.from(
    new Set(reqOutdata.map(item => getLastName(item.name)))
  ).map(lastName => ({
    text: lastName,
    value: lastName,
  }));

  const columns: TableColumnsType<DataType> = [
    {
      title: '№',
      dataIndex: 'id',
      sorter: (a, b) => a.id - b.id,
      width: '5%',
    },
    {
      title: 'ФИО',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      filters: lastNames, // Используем подготовленный список фамилий
      onFilter: (value, record) => getLastName(record.name) === value,
      filterSearch: true, // Добавляем поиск в фильтрах
      width: '20%',
      render: (name) => {
        const [lastName, firstName, middleName] = name.split(' ');
        return (
          <div>
            <div style={{ fontWeight: 'bold' }}>{lastName}</div>
            <div>{firstName} {middleName}</div>
          </div>
        );
      }
    },
    // ... остальные колонки остаются без изменений
    {
      title: 'Роль',
      dataIndex: 'role',
      width: '15%',
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: 'Почта',
      dataIndex: 'email',
      width: '15%',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => (
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
      title: 'Система',
      dataIndex: 'system',
      width: '10%',
      sorter: (a, b) => a.system.localeCompare(b.system),
    },
    {
      title: 'Время подачи',
      dataIndex: 'submissionTime',
      sorter: (a, b) => new Date(a.submissionTime).getTime() - new Date(b.submissionTime).getTime(),
      render: (time) => new Date(time).toLocaleString(),
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