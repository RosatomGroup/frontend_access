'use client';

import AuthGuard from '@/components/AuthGuard';
import OutReqTable from '../../tables/OutReqTable';
import BaseLayout from '@/components/BaseLayout';

export default function AllRequests() {
  return (
    <AuthGuard>
      <BaseLayout
        title="Все заявки"
        breadcrumbs={[{ title: 'Заявки', href: '/' }, { title: 'Все заявки' }]}
      >
        <OutReqTable />
      </BaseLayout>
    </AuthGuard>
  );
}
