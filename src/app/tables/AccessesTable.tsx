import React, { useEffect, useState, useCallback } from 'react';
import { ConfigProvider, message, Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { fetchAccesses } from '@/api/requests';
import { useUser } from '@/components/UserContext';

interface DataType {
  key: React.Key;
  index?: number;
  system: string;
  role: string;
  submissionTime: string;
  createDate: string;
}

const AccessTable: React.FC = () => {
  const screens = useBreakpoint();
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const userContextValue = useUser();

  const columns: ColumnsType<DataType> = [
    {
      title: '№',
      dataIndex: 'index',
      key: 'index',
      width: '5%',
      render: (_, __: DataType, rowIndex: number) => (currentPage - 1) * pageSize + rowIndex + 1,
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
      title: 'Время подачи',
      dataIndex: 'submissionTime',
      key: 'submissionTime',
      sorter: (a, b) => new Date(a.submissionTime).getTime() - new Date(b.submissionTime).getTime(),
      render: (time: string) => new Date(time).toLocaleString(),
      width: '15%',
      defaultSortOrder: 'descend',
      sortDirections: ['descend', 'ascend'],
    },
  ];

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const userId = userContextValue.user?.id;
      if (!userId) {
        message.warning('User information not available');
        setData([]);
        return;
      }
      const accesses = await fetchAccesses(userId);
      const safeAccesses = accesses || [];
      const sorted = safeAccesses.sort(
        (a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime(),
      );
      const formattedData = sorted.map((access) => ({
        key: access.id,
        role: access.roleName,
        system: access.resourceName,
        submissionTime: access.createDate,
        createDate: access.createDate,
      }));
      setData(formattedData);
    } catch (error) {
      message.error('Ошибка загрузки данных');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [userContextValue.user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePageSizeChange = (current: number, size: number) => {
    setPageSize(size);
    setCurrentPage(current);
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
      <Spin spinning={loading}>
        <Table
          dataSource={data}
          columns={columns}
          loading={loading}
          scroll={screens.xs ? { x: 800 } : undefined}
          pagination={{
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            onShowSizeChange: handlePageSizeChange,
            onChange: (page) => setCurrentPage(page),
            showTotal: (total, range) => `Показано ${range[0]}-${range[1]} из ${total} записей`,
            locale: { items_per_page: `/ стр` },
            size: screens.xs ? 'small' : 'default',
          }}
          size={screens.xs ? 'small' : 'middle'}
          bordered={!screens.xs}
        />
      </Spin>
    </ConfigProvider>
  );
};

export default AccessTable;

