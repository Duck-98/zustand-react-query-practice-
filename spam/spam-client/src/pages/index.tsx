import React, { useEffect } from 'react';
import { TableType } from '@/types';
import { Spinner } from '@/components/Spinner';
import DataTableGrid from '@/components/DataTableGrid';
import { fetchBlock } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useBlockStore } from '@/store';

export default function Home() {
  const { setBlock, block } = useBlockStore();
  const { data, isLoading, error } = useQuery({ queryKey: ['block'], queryFn: fetchBlock });
  const router = useRouter();

  useEffect(() => {
    if (data) {
      setBlock(data);
    }
  }, [data]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    if (error.message === '401') {
      toast.error('로그인이 필요합니다.');
      router.push('/login');
    }
    return <div>에러가 발생했습니다.</div>;
  }

  return (
    <main className="p-12">
      <h1 className="text-4xl font-bold mb-10">Block</h1>
      <DataTableGrid data={data} type={TableType.block} />
    </main>
  );
}
