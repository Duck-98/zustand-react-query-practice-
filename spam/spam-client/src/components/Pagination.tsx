import { useRouter } from 'next/router';
import { BiFirstPage, BiLastPage } from 'react-icons/bi';

interface PaginationProps {
  data: any[];
  selectedRowsPerPage: number;
  setSelectedCurrentPage: (pageNumber: number) => void;
  selectedCurrentPage: number;
  currentPageGroup: number;
  setCurrentPageGroup: (pageNumber: number) => void;
}

export const Pagination = ({
  data,
  selectedRowsPerPage,
  setSelectedCurrentPage,
  selectedCurrentPage,
  currentPageGroup,
  setCurrentPageGroup,
}: PaginationProps) => {
  const router = useRouter();

  const firstPageNumber = (currentPageGroup - 1) * 10 + 1;
  const lastPageNumber = currentPageGroup * 10;

  return (
    <div className="flex items-center justify-center mb-10 text-xl">
      <button
        disabled={currentPageGroup === 1} // 첫 번째 페이지 그룹인 경우 비활성화 처리
        onClick={() => setCurrentPageGroup(currentPageGroup - 1)}
      >
        <BiFirstPage />
      </button>
      {Array.from({ length: Math.ceil(data.length / selectedRowsPerPage) }, (_, index) => {
        const pageNumber = index + 1;
        if (pageNumber >= firstPageNumber && pageNumber <= lastPageNumber) {
          return (
            <button
              className={`mx-2 ${pageNumber === selectedCurrentPage && ' text-red-300'}`}
              onClick={() => {
                setSelectedCurrentPage(pageNumber);
                router.push({
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    page: pageNumber,
                  },
                });
              }}
              key={index}
            >
              {pageNumber}
            </button>
          );
        }

        return null;
      })}
      <button
        disabled={lastPageNumber >= Math.ceil(data.length / selectedRowsPerPage)} // 마지막 페이지 그룹인 경우 비활성화 처리
        onClick={() => setCurrentPageGroup(currentPageGroup + 1)}
      >
        <BiLastPage />
      </button>
    </div>
  );
};
