import React, { useEffect } from 'react';
import { Restore, TableType } from '@/types';
import { Spinner } from '@/components/Spinner';
import { fetchRestore } from '@/api';
import { useQuery } from '@tanstack/react-query';
import DataTableGrid from '@/components/DataTableGrid';
import { useRestoreStore } from '@/store';

function RestorePage() {
  const { setRestore, restore } = useRestoreStore();

  const query = useQuery<Restore[], Error>({
    queryKey: ['restore'],
    queryFn: fetchRestore,
  });

  const tableType = TableType?.restore;

  useEffect(() => {
    if (query.data) {
      setRestore(query.data);
    }
  }, [query.data]);

  if (query.isLoading) {
    return <Spinner />;
  }

  if (query.error) {
    return <div>에러가 발생했습니다.</div>;
  }

  return (
    <main className="p-12">
      <h1 className="text-4xl font-bold mb-10">Restore</h1>
      <DataTableGrid data={query.data} type={tableType} />
    </main>
  );
}

export default RestorePage;
