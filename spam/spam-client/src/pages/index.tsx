import React from 'react';
import { TableType } from '@/types';
import { Spinner } from '@/components/Spinner';
import DataTableGrid from '@/components/DataTableGrid';
import { fetchBlock } from '@/api';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const { data, isLoading, error } = useQuery({ queryKey: ['block'], queryFn: fetchBlock });

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }

  return (
    <main className="p-12">
      <h1 className="text-4xl font-bold mb-10">Block</h1>
      <DataTableGrid data={data} type={TableType.block} />
    </main>
  );
}
