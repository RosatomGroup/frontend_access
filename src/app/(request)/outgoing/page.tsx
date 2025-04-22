'use client';

import OutReqTable from '../../tables/OutReqTable';
import BaseLayout from '@/components/BaseLayout';

export default function OutgoingRequest() {
  return (
    <BaseLayout
      title="Исходящие заявки"
      breadcrumbs={[
        { title: 'Заявки', href: '/' },
        { title: 'Исходящие' },
      ]}
    >
      <OutReqTable />
    </BaseLayout>
  );
}