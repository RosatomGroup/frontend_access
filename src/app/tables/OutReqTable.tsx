import React, { useEffect, useState } from 'react';
import { Button, message, Popconfirm, Spin, Table, Tag } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  BackendRequestDataType,
  fetchRequests,
  updateRequestStatus,
  UpdateRequestStatusDto,
} from '@/api/requests';

interface DataType extends BackendRequestDataType {
  key: number;
}

const OutReqTable: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<DataType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [actionLoading, setActionLoading] = useState<{ [key: number]: boolean }>({});

  const handleStatusChange = async (id: number, status: UpdateRequestStatusDto['status']) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const dto: UpdateRequestStatusDto = { status };
      await updateRequestStatus(id, dto);
      setData((prevData) =>
        prevData.map((item) => (item.id === id ? { ...item, status: dto.status } : item)),
      );
      message.success(status === 'APPROVED' ? 'Заявка принята' : 'Заявка отклонена');
    } catch (error) {
      message.error('Ошибка обновления статуса');
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const requests = await fetchRequests();
        const formattedData = requests.map((request) => ({
          ...request,
          key: request.id,
        }));
        setData(formattedData);
      } catch (error) {
        message.error('Ошибка загрузки данных');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Для фильтрации по фамилии
  const surnameFilters = Array.from(new Set(data.map((item) => item.surname))).map((surname) => ({
    text: surname,
    value: surname,
  }));

  const columns: ColumnsType<DataType> = [
    {
      title: '№',
      key: 'index',
      width: '5%',
      render: (_, __: DataType, idx: number) => (currentPage - 1) * pageSize + idx + 1,
    },
    {
      title: 'ФИО',
      key: 'fullName',
      width: '15%',
      render: (_, record: DataType) => (
        <div>
          <div>{record.surname}</div>
          <div>
            {record.name} {record.middleName || ''}
          </div>
        </div>
      ),
      sorter: (a, b) => `${a.surname} ${a.name}`.localeCompare(`${b.surname} ${b.name}`),
      filters: surnameFilters,
      onFilter: (value, record) => record.surname === value,
      filterSearch: true,
    },
    {
      title: 'Тип запроса',
      dataIndex: 'requestType',
      key: 'requestType',
      width: '10%',
      render: (type: DataType['requestType']) =>
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
      width: '10%',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status: DataType['status']) => {
        let color = 'default';
        let text: string;
        if (status === 'PENDING') {
          color = 'blue';
          text = 'В работе';
        } else if (status === 'APPROVED') {
          color = 'green';
          text = 'Завершено';
        } else if (status === 'REJECTED') {
          color = 'red';
          text = 'Отклонено';
        } else {
          text = status;
        }
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'В работе', value: 'PENDING' },
        { text: 'Завершено', value: 'APPROVED' },
        { text: 'Отклонено', value: 'REJECTED' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Дата создания',
      dataIndex: 'createDate',
      key: 'createDate',
      width: '15%',
      sorter: (a, b) => new Date(a.createDate).getTime() - new Date(b.createDate).getTime(),
      render: (time: string) =>
        new Date(time).toLocaleString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      defaultSortOrder: 'descend',
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Действия',
      key: 'actions',
      width: '15%',
      render: (_, record: DataType) =>
        record.status === 'PENDING' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <Popconfirm
              title="Принять заявку?"
              onConfirm={() => handleStatusChange(record.id, 'APPROVED')}
            >
              <Button type="primary" loading={!!actionLoading[record.id]} size="small">
                Принять
              </Button>
            </Popconfirm>
            <Popconfirm
              title="Отклонить заявку?"
              onConfirm={() => handleStatusChange(record.id, 'REJECTED')}
            >
              <Button danger loading={!!actionLoading[record.id]} size="small">
                Отклонить
              </Button>
            </Popconfirm>
          </div>
        ),
    },
  ];

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setCurrentPage(pagination.current || 1);
    setPageSize(pagination.pageSize || 10);
  };

  return (
    <Spin spinning={loading}>
      <Table
        scroll={{ x: 800 }}
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize,
          current: currentPage,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) => `Показано ${range[0]}-${range[1]} из ${total} записей`,
        }}
        rowKey="id"
        onChange={handleTableChange}
      />
    </Spin>
  );
};

export default OutReqTable;
