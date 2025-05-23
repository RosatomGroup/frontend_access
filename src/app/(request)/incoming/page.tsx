'use client';

import { Typography } from 'antd';
import BaseLayout from '@/components/BaseLayout';
import AuthGuard from '@/components/AuthGuard';

const { Text } = Typography;

export default function IncomingRequest() {
  return (
    <AuthGuard>
      <BaseLayout
        title="Входящие заявки"
        breadcrumbs={[{ title: 'Заявки', href: '/' }, { title: 'Входящие' }]}
      >
        <Text
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '18px',
            padding: 24,
            minHeight: 360,
            background: 'colorBgContainer',
            borderRadius: 'borderRadiusLG',
          }}
        >
          Нет входящих заявок
        </Text>
      </BaseLayout>
    </AuthGuard>
  );
}

