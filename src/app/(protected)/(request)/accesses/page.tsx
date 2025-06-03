'use client';

import BaseLayout from '@/components/BaseLayout';
import AccessesTable from "@/app/tables/AccessesTable";

export default function AllRequests() {
    return (
        <BaseLayout
            title="Мои доступы"
            breadcrumbs={[{title: 'Заявки', href: '/'}, {title: 'Мои доступы'}]}
        >
            <AccessesTable/>
        </BaseLayout>
    );
}
