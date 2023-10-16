import React, { useState, useEffect, Suspense } from 'react';
import { Table } from '@/components/Table';
import { TableType } from '@/types';
import { Spinner } from '@/components/Spinner';

export default function Home() {
  const [data, setData] = useState([]);
  const a = TableType?.block;

  useEffect(() => {
    async function fetchData() {
      try {
        const url = 'http://localhost:7777/block';
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
      <h1 className="text-4xl font-bold mb-10">Block</h1>
      <Suspense fallback={<Spinner />}>
        <Table data={data} type={a} />
      </Suspense>
    </main>
  );
}
