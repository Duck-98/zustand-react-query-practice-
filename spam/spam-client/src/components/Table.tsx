import React, { useState, useEffect } from 'react';
import type { Restore, Block } from '../types';
import { TableType } from '../types';
import { formatDate, sortByDate } from '@/utils/date';
import { getEmailDomain } from '@/utils/email';
import { RiSortAsc, RiSortDesc } from 'react-icons/ri';
import { useRouter } from 'next/router';
import { Pagination } from './Pagination';

const emailDomains = ['gmail.com', 'hotmail.com', 'yahoo.com'];

interface TableRowProps {
  data: (Block | Restore)[];
  type: TableType;
}

export const Table = ({ data: initialData, type }: TableRowProps) => {
  const router = useRouter();

  const [tableData, setTableData] = useState(initialData);
  const [isSortedAscending, setIsSortedAscending] = useState(router.query.sort === 'asc');
  const [selectedFromEmail, setSelectedFromEmail] = useState(router.query.from || '');
  const [selectedToEmail, setSelectedToEmail] = useState(router.query.to || '');
  const [selectedRowsPerPage, setSelectedRowsPerPage] = useState(10);
  const [selectedCurrentPage, setSelectedCurrentPage] = useState(1);
  const [currentPageGroup, setCurrentPageGroup] = useState(1);

  const startIndex = (selectedCurrentPage - 1) * selectedRowsPerPage;
  const endIndex = startIndex + selectedRowsPerPage;

  const handleSortByDate = () => {
    const nextIsSortedAscending = !isSortedAscending;

    setIsSortedAscending(nextIsSortedAscending);

    let sortedData = [...initialData];

    if (selectedFromEmail) {
      sortedData = sortedData.filter((item) => getEmailDomain(item.from) === selectedFromEmail);
    }

    if (selectedToEmail) {
      sortedData = sortedData.filter((item) => getEmailDomain(item.to) === selectedToEmail);
    }

    setTableData(sortByDate(sortedData, nextIsSortedAscending));

    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        sort: nextIsSortedAscending ? 'asc' : 'desc',
      },
    });
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = Number(e.target.value);
    setSelectedRowsPerPage(newValue);
    setSelectedCurrentPage(1);
    setCurrentPageGroup(1);

    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        rows: newValue,
        page: '1',
      },
    });
  };

  useEffect(() => {
    let filteredData = [...initialData];

    if (selectedFromEmail) {
      filteredData = filteredData.filter((item) => getEmailDomain(item.from) === selectedFromEmail);
    }

    if (selectedToEmail) {
      filteredData = filteredData.filter((item) => getEmailDomain(item.to) === selectedToEmail);
    }

    setTableData(filteredData);
    setSelectedCurrentPage(1);
    setCurrentPageGroup(1);

    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        from: selectedFromEmail,
        to: selectedToEmail,
        page: '1',
      },
    });
  }, [selectedFromEmail, selectedToEmail]);

  useEffect(() => {
    let filteredData = [...initialData];
    if (router.query.from) {
      setSelectedFromEmail(router.query.from as string);
      filteredData = filteredData.filter((item) => getEmailDomain(item.from) === router.query.from);
    }
    if (router.query.to) {
      setSelectedToEmail(router.query.to as string);
      filteredData = filteredData.filter((item) => getEmailDomain(item.to) === router.query.to);
    }

    if (router.query.sort) {
      setIsSortedAscending(router.query.sort === 'asc');
    }

    if (router.query.rows) {
      setSelectedRowsPerPage(Number(router.query.rows));
    }

    if (router.query.page) {
      const pageNumber = Number(router.query.page);
      setSelectedCurrentPage(pageNumber);
      setCurrentPageGroup(Math.ceil(pageNumber / 10));
    } else {
      setSelectedCurrentPage(1);
      setCurrentPageGroup(1);
    }

    setTableData(sortByDate(filteredData, isSortedAscending));
  }, [initialData]);

  return (
    <main>
      <Pagination
        tableData={tableData}
        selectedRowsPerPage={selectedRowsPerPage}
        setSelectedCurrentPage={setSelectedCurrentPage}
        setCurrentPageGroup={setCurrentPageGroup}
        currentPageGroup={currentPageGroup}
        selectedCurrentPage={selectedCurrentPage}
      />

      <div>
        <label>Rows per page</label>
        <select
          className="text-gray-900"
          value={selectedRowsPerPage}
          onChange={handleRowsPerPageChange}
        >
          <option>10</option>
          <option>20</option>
          <option>50</option>
          <option>100</option>
        </select>
      </div>
      <div>
        <label>From</label>
        <select
          className="text-gray-900"
          value={selectedFromEmail}
          onChange={(e) => setSelectedFromEmail(e.target.value)}
        >
          <option value="">All</option>
          {emailDomains.map((domain, index) => (
            <option key={index} value={domain}>
              {domain}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>To</label>
        <select
          className="text-gray-900"
          value={selectedToEmail}
          onChange={(e) => setSelectedToEmail(e.target.value)}
        >
          <option value="">All</option>
          {emailDomains.map((domain, index) => (
            <option key={index} value={domain}>
              {domain}
            </option>
          ))}
        </select>
      </div>
      <table className="border border-red-300">
        <thead className="bg-red-300">
          <tr className="w-full">
            <th className="flex justify-center w-full">
              Date
              <button onClick={handleSortByDate}>
                {isSortedAscending ? <RiSortAsc /> : <RiSortDesc />}
              </button>
            </th>
            <th> {type === TableType?.block ? 'Blocked IP' : 'Restored Name'}</th>
            <th>Subject</th>
            <th>From</th>
            <th>To</th>
          </tr>
        </thead>
        <tbody>
          {tableData.slice(startIndex, endIndex).map((item: Block | Restore, index: number) => {
            const date = 'block_date' in item ? item.block_date : item.restore_date;
            const secondColumn =
              type === TableType.block
                ? (item as Block).blocked_ip
                : (item as Restore).restored_name;

            return (
              <tr key={index}>
                <td>{formatDate(date)}</td>
                <td>{secondColumn}</td>
                <td>{item.subject}</td>
                <td>{item.from}</td>
                <td>{item.to}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
};
