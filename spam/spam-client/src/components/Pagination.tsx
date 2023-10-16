import { useRouter } from 'next/router';
import { BiFirstPage, BiLastPage } from 'react-icons/bi';

interface PaginationProps {
  tableData: any[];
  selectedRowsPerPage: number;
  setSelectedCurrentPage: (pageNumber: number) => void;
  selectedCurrentPage: number;
  currentPageGroup: number;
  setCurrentPageGroup: (pageNumber: number) => void;
}

export const Pagination = ({
  tableData,
  selectedRowsPerPage,
  setSelectedCurrentPage,
  selectedCurrentPage,
  currentPageGroup,
  setCurrentPageGroup,
}: PaginationProps) => {
  const router = useRouter();

  //   const [selectedCurrentPage, setSelectedCurrentPage] = useState(1);
  //   const [currentPageGroup, setCurrentPageGroup] = useState(1);

  const firstPageNumber = (currentPageGroup - 1) * 10 + 1;
  const lastPageNumber = currentPageGroup * 10;

  return (
    <div className="flex items-center justify-center">
      <button
        disabled={currentPageGroup === 1} // 첫 번째 페이지 그룹인 경우 비활성화 처리
        onClick={() => setCurrentPageGroup(currentPageGroup - 1)}
      >
        <BiFirstPage />
      </button>
      {Array.from({ length: Math.ceil(tableData.length / selectedRowsPerPage) }, (_, index) => {
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
        disabled={lastPageNumber >= Math.ceil(tableData.length / selectedRowsPerPage)} // 마지막 페이지 그룹인 경우 비활성화 처리
        onClick={() => setCurrentPageGroup(currentPageGroup + 1)}
      >
        <BiLastPage />
      </button>
    </div>
  );
};
