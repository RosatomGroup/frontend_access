'use client';

import AuthGuard from '@/components/AuthGuard';
import OutReqTable from '../../tables/OutReqTable';
import BaseLayout from '@/components/BaseLayout';

export default function OutgoingRequest() {
  return (
    <AuthGuard>
      <BaseLayout
        title="Исходящие заявки"
        breadcrumbs={[{ title: 'Заявки', href: '/' }, { title: 'Исходящие' }]}
      >
        <OutReqTable />
      </BaseLayout>
    </AuthGuard>
  );
}
