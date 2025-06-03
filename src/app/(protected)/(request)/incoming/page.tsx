'use client';

import BaseLayout from '@/components/BaseLayout';
import OutReqTable from '@/app/tables/OutReqTable';

export default function IncomingRequest() {
  return (
    <BaseLayout
      title="Входящие заявки"
      breadcrumbs={[{ title: 'Заявки', href: '/' }, { title: 'Входящие' }]}
    >
      <OutReqTable />
    </BaseLayout>
  );
}

