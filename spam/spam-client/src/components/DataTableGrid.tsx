import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import type { Restore, Block } from '../types';
import { TableType } from '../types';

import { sortByDate } from '@/utils/date';
import { getEmailDomain } from '@/utils/email';

import { Pagination } from './Pagination';
import { SearchBox } from './SearchBox';
import { DomainCheckBox } from './DomainCheckBox';
import { Table } from './Table';
import { toast } from 'react-toastify';

interface TableRowProps {
  data: (Block | Restore)[];
  type: TableType;
}

export default function DataTableGrid({ data: initialData, type }: TableRowProps) {
  const router = useRouter();

  const [filteredData, setFilteredData] = useState(initialData);

  const [isSortedAscending, setIsSortedAscending] = useState(true);

  const [selectedFromEmails, setSelectedFromEmails] = useState<string[]>([]);
  const [selectedToEmails, setSelectedToEmails] = useState<string[]>([]);

  const [selectedRowsPerPage, setSelectedRowsPerPage] = useState(10);
  const [selectedCurrentPage, setSelectedCurrentPage] = useState(1);
  const [currentPageGroup, setCurrentPageGroup] = useState(1);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');

  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  const startIndex = (selectedCurrentPage - 1) * selectedRowsPerPage;
  const endIndex = startIndex + selectedRowsPerPage;

  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        search: searchTerm.trim(),
        type: searchType,
      },
    });
  };

  const handleSortByDate = () => {
    const nextIsSortedAscending = !isSortedAscending;

    setIsSortedAscending(nextIsSortedAscending);

    let sortedData = [...filteredData];

    if (selectedFromEmails.length > 0) {
      sortedData = sortedData.filter((item) =>
        selectedFromEmails.includes(getEmailDomain(item.from)),
      );
    }

    if (selectedToEmails.length > 0) {
      sortedData = sortedData.filter((item) => selectedToEmails.includes(getEmailDomain(item.to)));
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

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setSelectedEmails: React.Dispatch<React.SetStateAction<string[]>>,
    queryParam: string,
  ) => {
    const value = e.target.value;
    setSelectedEmails((prevSelectedEmails: string[]) => {
      let nextSelectedEmails;
      if (prevSelectedEmails.includes(value)) {
        // 이미 체크된 경우 한번 더 체크하면 삭제되도록!
        nextSelectedEmails = prevSelectedEmails.filter((email) => email !== value);
      } else {
        nextSelectedEmails = [...prevSelectedEmails, value];
      }

      router.push({
        query: {
          ...router.query,
          page: '1',
          [queryParam]: nextSelectedEmails.length > 0 ? nextSelectedEmails.join(',') : undefined,
        },
      });

      return nextSelectedEmails;
    });
  };

  useEffect(() => {
    let filteredData = [...initialData];

    if (router.query.from_domain) {
      const fromDomains = Array.isArray(router.query.from_domain)
        ? router.query.from_domain
        : router.query.from_domain.split(',');
      setSelectedFromEmails(fromDomains);
      filteredData = filteredData.filter((item) => fromDomains.includes(getEmailDomain(item.from)));
    }

    if (router.query.to_domain) {
      const toDomains = Array.isArray(router.query.to_domain)
        ? router.query.to_domain
        : router.query.to_domain.split(',');
      setSelectedToEmails(toDomains);
      filteredData = filteredData.filter((item) => toDomains.includes(getEmailDomain(item.to)));
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

    if (router.query.search || router.query.type) {
      const searchTermFromQuery = router.query.search as string;
      const searchTypeFromQuery = router.query.type as string;

      setSearchTerm(searchTermFromQuery);
      setSearchType(searchTypeFromQuery);

      const result = filteredData.filter((item) => {
        if (searchTypeFromQuery === 'all') {
          return Object.values(item).some(
            (value) => value?.toString().toLowerCase().includes(searchTermFromQuery.toLowerCase()),
          );
        } else if (
          ['blocked_ip', 'restored_name', 'subject', 'to', 'from'].includes(searchTypeFromQuery)
        ) {
          return item[searchTypeFromQuery as keyof (Block | Restore)]
            ?.toLowerCase()
            .includes(searchTermFromQuery.toLowerCase());
        }
        return false;
      });

      filteredData = result;
    }
    setFilteredData(sortByDate(filteredData, isSortedAscending));
    setIsLoading(false);
  }, [initialData, router.query]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('로그인이 필요합니다.');
      router.push('/login');
    } else {
      setIsLogin(true);
    }
  }, []);

  if (isLoading) {
    return <div></div>; // 필터링 로딩 중일때 아무것도 안 보여주기
  }

  return (
    <main className="space-y-4">
      {isLogin && (
        <>
          <div className="flex justify-between">
            <div className="space-x-2">
              <label>Rows per page</label>
              <select
                className="text-gray-900 w-14 h-9"
                value={selectedRowsPerPage}
                onChange={handleRowsPerPageChange}
              >
                <option>10</option>
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
            <SearchBox
              handleSearchSubmit={handleSearchSubmit}
              handleSearchChange={handleSearchChange}
              searchTerm={searchTerm}
              handleSearchTypeChange={handleSearchTypeChange}
              type={type}
            />
          </div>

          <div className="flex space-x-4">
            <DomainCheckBox
              handleCheckboxChange={handleCheckboxChange}
              selectedDomains={selectedFromEmails}
              setSelectedDomains={setSelectedFromEmails}
              domains={['gmail.com', 'hotmail.com', 'yahoo.com']}
              label="From"
              queryParam="from_domain"
            />

            <DomainCheckBox
              handleCheckboxChange={handleCheckboxChange}
              selectedDomains={selectedToEmails}
              setSelectedDomains={setSelectedToEmails}
              domains={['gmail.com', 'hotmail.com', 'yahoo.com']}
              label="To"
              queryParam="to_domain"
            />
          </div>

          <Pagination
            totalData={filteredData.length}
            selectedRowsPerPage={selectedRowsPerPage}
            setSelectedCurrentPage={setSelectedCurrentPage}
            setCurrentPageGroup={setCurrentPageGroup}
            currentPageGroup={currentPageGroup}
            selectedCurrentPage={selectedCurrentPage}
          />

          <Table
            filteredData={filteredData}
            type={type}
            handleSortByDate={handleSortByDate}
            isSortedAscending={isSortedAscending}
            startIndex={startIndex}
            endIndex={endIndex}
          />
        </>
      )}
    </main>
  );
}
