import { Typography } from 'antd';
import { theme } from 'antd';
import React from 'react';
import { Flex } from 'antd';
import { Input, Space } from 'antd';
import type { GetProps } from 'antd';

interface AppSearchProps {
  pageName: string;
}
type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;
const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

export default function AppSearch({ pageName }: AppSearchProps) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <div
      style={{
        padding: 24,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        marginBottom: 24,
      }}
    >
      <Flex gap="middle" style={{ display: 'flex', alignItems: 'center' }}>
        <Typography.Text style={{ whiteSpace: 'nowrap' }}>{pageName}:</Typography.Text>
        <Space.Compact style={{ width: '100%' }}>
          <Search placeholder="Наименование" onSearch={onSearch} enterButton />
        </Space.Compact>
      </Flex>
    </div>
  );
}
