import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { TableType } from '@/types';
import { Spinner } from '@/components/Spinner';

const DataTableGrid = dynamic(() => import('@/components/DataTableGrid'), {
  suspense: true,
  ssr: false,
  loading: () => <Spinner />,
});

export default function Home() {
  const [data, setData] = useState([]);

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
      {/* <Suspense fallback={<Spinner />}> */}
      <DataTableGrid data={data} type={TableType.block} />
      {/* </Suspense> */}
    </main>
  );
}
