import type { Restore, Block } from '../types';
import { TableType } from '../types';
import { formatDate } from '@/utils/date';
import { RiSortAsc, RiSortDesc } from 'react-icons/ri';

interface TableProps {
  type: TableType;
  isSortedAscending: boolean;
  handleSortByDate: () => void;
  startIndex: number;
  endIndex: number;
  filteredData: (Block | Restore)[];
}

export const Table = ({
  type,
  isSortedAscending,
  handleSortByDate,
  startIndex,
  endIndex,
  filteredData,
}: TableProps) => {
  return (
    <main className="space-y-2">
      <table className="border border-red-300 min-w-full">
        <thead className="bg-red-300 min-w-full h-[55px]">
          <tr>
            <th className="flex items-center justify-center py-3.5">
              Date
              <button onClick={handleSortByDate} className="text-xl flex items-center">
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
              <td colSpan={5} className="text-xl">
                검색 결과가 존재하지 않습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
};
