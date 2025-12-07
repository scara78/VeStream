import { usePagination, DOTS } from "@/hooks/usePagination";
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/Pagination"

const PaginationControls = ({ currentPage, totalPages, basePath }) => {
  if (totalPages <= 1) return null;

  const paginationRange = usePagination({
    currentPage,
    totalPages,
  });

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const getPageUrl = (page) => {
    const url = new URL(basePath, 'http://localhost'); // Base URL is needed for URL object
    url.searchParams.set('page', page);
    return `${url.pathname}${url.search}`;
  };

  return (
    <Pagination>
      <PaginationContent>
        {hasPrev && (
          <PaginationItem>
            <PaginationPrevious href={getPageUrl(currentPage - 1)} />
          </PaginationItem>
        )}
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return <PaginationItem key={`dots-${index}`}><PaginationEllipsis /></PaginationItem>;
          }
          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink href={getPageUrl(pageNumber)} isActive={pageNumber === currentPage}>{pageNumber}</PaginationLink>
            </PaginationItem>
          );
        })}
        {hasNext && (
          <PaginationItem>
            <PaginationNext href={getPageUrl(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationControls;