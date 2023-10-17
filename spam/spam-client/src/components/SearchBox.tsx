import { HiOutlineSearch } from 'react-icons/hi';
import { TableType } from '../types';

interface SearchBoxProps {
  handleSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string;
  handleSearchTypeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  type: TableType;
}

export const SearchBox = ({
  handleSearchSubmit,
  handleSearchChange,
  searchTerm,
  handleSearchTypeChange,
  type,
}: SearchBoxProps) => {
  return (
    <form onSubmit={handleSearchSubmit} className="">
      <div className="relative w-[600px] h-9 border border-gray-300 bg-white flex items-center">
        <input
          type="text"
          name="term"
          onChange={handleSearchChange}
          value={searchTerm}
          placeholder="검색어를 입력하세요."
          className="text-black w-full h-8 px-2"
        />
        <button className=" text-black text-2xl" type="submit">
          <HiOutlineSearch />
        </button>
        <select
          name="type"
          onChange={handleSearchTypeChange}
          className="text-black w-20 text-lg border-l border-l-gray-300 h-full"
        >
          <option value="all">All</option>
          <option value="subject">Subject</option>
          <option value="from">From</option>
          <option value="to">To</option>
          {type === TableType.block ? (
            <option value="blocked_ip">Blocked IP</option>
          ) : (
            <option value="restored_name">Restored Name</option>
          )}
        </select>
      </div>
    </form>
  );
};
