import React, { useState, useEffect, Suspense } from 'react';
import { Table } from '@/components/Table';
import { TableType } from '@/types';
import { Spinner } from '@/components/Spinner';

function RestorePage() {
  const [data, setData] = useState([]);
  const tableType = TableType?.restore;

  useEffect(() => {
    async function fetchData() {
      try {
        const url = 'http://localhost:7777/restore';
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setData(data);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error while fetching data', error);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="p-12">
      <h1 className="text-4xl font-bold mb-10">Restore</h1>
      <Suspense fallback={<Spinner />}>
        <Table data={data} type={tableType} />
      </Suspense>
    </main>
  );
}

export default RestorePage;
