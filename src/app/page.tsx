import { Layout } from 'antd';
import AppSider from '../components/AppSider';
import AppHeader from '../components/AppHeader';
import AppLayout from '@/components/AppLayout';
import AuthGuard from '../components/AuthGuard';

import React from 'react';

export default function Home() {
  return (
    <AuthGuard>
      <Layout>
        <AppHeader />
        <Layout style={{ minHeight: '100vh' }}>
          <AppSider />
          <AppLayout />
        </Layout>
      </Layout>
    </AuthGuard>
  );
}
