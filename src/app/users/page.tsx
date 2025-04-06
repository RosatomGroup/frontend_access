'use client';

import { AppTable } from '../../components/ui/table';
import Header from '@/components/common/header/Header';

export default function page({}) {
  return (
    <>
      <Header />
      <div className="wrapper">
        <AppTable />
      </div>
    </>
  );
}
