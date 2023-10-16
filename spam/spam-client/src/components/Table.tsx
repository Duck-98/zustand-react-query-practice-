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
  const [filteredData, setFilteredData] = useState(initialData);
  const [isSortedAscending, setIsSortedAscending] = useState(router.query.sort === 'asc');
  const [selectedFromEmail, setSelectedFromEmail] = useState(router.query.from || '');
  const [selectedToEmail, setSelectedToEmail] = useState(router.query.to || '');
  const [selectedRowsPerPage, setSelectedRowsPerPage] = useState(10);
  const [selectedCurrentPage, setSelectedCurrentPage] = useState(1);
  const [currentPageGroup, setCurrentPageGroup] = useState(1);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleSearchChangeTemp = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmitTemp = (e) => {
    e.preventDefault();

    // 검색어로 필터링
    const result = filteredData.filter((item) => {
      if (searchType === 'all') {
        return Object.values(item).some((value) =>
          value.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      } else if (
        (searchType === 'blocked_ip' && type === TableType.block && 'blocked_ip' in item) ||
        (searchType === 'restored_name' && type === TableType.restore && 'restored_name' in item)
      ) {
        return item[searchType].toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchType in item) {
        return item[searchType].toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });

    setFilteredData(result);

    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        search: searchTerm.trim() !== '' ? searchTerm : undefined,
        type: searchType !== 'all' ? searchType : undefined,
      },
    });
  };

  useEffect(() => {
    if (router.query.type) {
      setSearchType(router.query.type as string);
    }
  }, []);

  const startIndex = (selectedCurrentPage - 1) * selectedRowsPerPage;
  const endIndex = startIndex + selectedRowsPerPage;

  const handleSortByDate = () => {
    const nextIsSortedAscending = !isSortedAscending;

    setIsSortedAscending(nextIsSortedAscending);

    let sortedData = [...filteredData];

    if (selectedFromEmail) {
      sortedData = sortedData.filter((item) => getEmailDomain(item.from) === selectedFromEmail);
    }

    if (selectedToEmail) {
      sortedData = sortedData.filter((item) => getEmailDomain(item.to) === selectedToEmail);
    }

    setFilteredData(sortByDate(sortedData, nextIsSortedAscending));

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

    // 도메인으로 필터링
    if (selectedFromEmail) {
      filteredData = filteredData.filter((item) => getEmailDomain(item.from) === selectedFromEmail);
    }

    if (selectedToEmail) {
      filteredData = filteredData.filter((item) => getEmailDomain(item.to) === selectedToEmail);
    }

    const result = filteredData.filter((item) => {
      if (searchType === 'all') {
        return Object.values(item).some((value) =>
          value.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      } else if (
        (searchType === 'blocked_ip' && type === TableType.block && 'blocked_ip' in item) ||
        (searchType === 'restored_name' && type === TableType.restore && 'restored_name' in item)
      ) {
        return item[searchType].toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchType in item) {
        return item[searchType].toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
    console.log(result);

    // 정렬
    filteredData = sortByDate(result, isSortedAscending);

    setFilteredData(filteredData);
  }, [selectedFromEmail, selectedToEmail, isSortedAscending]);

  useEffect(() => {
    let filteredData = [...initialData];

    if (router.query.from_domain) {
      setSelectedFromEmail(router.query.from_domain as string);

      filteredData = filteredData.filter(
        (item) => getEmailDomain(item.from) === router.query.from_domain,
      );
    }
    if (router.query.to_domain) {
      setSelectedToEmail(router.query.to_domain as string);
      filteredData = filteredData.filter(
        (item) => getEmailDomain(item.to) === router.query.to_domain,
      );
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

    console.log(router.query);
    if (router.query.search || router.query.type) {
      setSearchTerm(router.query.search as string);
      setSearchType(router.query.type as string);

      // 검색어로 필터링
      const result = filteredData.filter((item) => {
        if (searchType === 'all') {
          return Object.values(item).some((value) =>
            value.toLowerCase().includes(searchTerm.toLowerCase()),
          );
        } else if (
          (searchType === 'blocked_ip' && type === TableType.block && 'blocked_ip' in item) ||
          (searchType === 'restored_name' && type === TableType.restore && 'restored_name' in item)
        ) {
          return item[searchType].toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchType in item) {
          return item[searchType].toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      });

      filteredData = result;
    }

    setFilteredData(sortByDate(filteredData, isSortedAscending));
  }, [initialData, router.query]); // 새로고침할 때

  return (
    <main className="space-y-2">
      <Pagination
        data={filteredData}
        selectedRowsPerPage={selectedRowsPerPage}
        setSelectedCurrentPage={setSelectedCurrentPage}
        setCurrentPageGroup={setCurrentPageGroup}
        currentPageGroup={currentPageGroup}
        selectedCurrentPage={selectedCurrentPage}
      />

      <form onSubmit={handleSearchSubmitTemp} className="space-y-4">
        <div className="grid grid-cols-2 gap-x-4">
          <label>검색 유형</label>
          <select name="type" onChange={handleSearchTypeChange} className="text-black">
            <option value="subject">Subject</option>
            <option value="from">From</option>
            <option value="to">To</option>
            {type === TableType.block ? (
              <option value="blocked_ip">Blocked IP</option>
            ) : (
              <option value="restored_name">Restored Name</option>
            )}
            <option value="all">All</option>
          </select>

          <label>검색어</label>
          <input
            type="text"
            name="term"
            onChange={handleSearchChangeTemp}
            value={searchTerm}
            placeholder={`Enter ${searchType}`}
            className="text-black"
          />
          <button type="submit">검색하기</button>
        </div>
      </form>

      <div className="grid grid-cols-2 gap-x-4">
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
      <div className="grid grid-cols-2 gap-x-4">
        <label>From</label>
        <select
          className="text-gray-900"
          value={selectedFromEmail}
          onChange={(e) => {
            setSelectedFromEmail(e.target.value);
            router.push({
              query: {
                ...router.query,
                from_domain: e.target.value,
              },
            });
          }}
        >
          <option value="">All</option>
          {emailDomains.map((domain, index) => (
            <option key={index} value={domain}>
              {domain}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <label>To</label>
        <select
          className="text-gray-900"
          value={selectedToEmail}
          onChange={(e) => {
            setSelectedToEmail(e.target.value);
            router.push({
              query: {
                ...router.query,
                to_domain: e.target.value,
              },
            });
          }}
        >
          <option value="">All</option>
          {emailDomains.map((domain, index) => (
            <option key={index} value={domain}>
              {domain}
            </option>
          ))}
        </select>
      </div>
      <table className="border border-red-300 min-w-full">
        <thead className="bg-red-300">
          <tr className="w-full">
            <th className="flex justify-center">
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
          {filteredData.length > 0 ? (
            filteredData.slice(startIndex, endIndex).map((item: Block | Restore, index: number) => {
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
            })
          ) : (
            <tr>
              <td colSpan={5}>검색 결과가 존재하지 않습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
};
