import React, { useState, useEffect, Suspense } from 'react';
import { Table } from '@/components/Table';
import { TableType } from '@/types';

function RestorePage() {
  const [tableData, setTableData] = useState([]);
  const tableType = TableType?.restore;

  useEffect(() => {
    async function fetchData() {
      try {
        const url = 'http://localhost:7777/restore';
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setTableData(data);
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
      <Suspense fallback={<div>Loading...</div>}>
        <Table data={tableData} type={tableType} />
      </Suspense>
    </main>
  );
}

export default RestorePage;
