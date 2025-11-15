import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export function usePagination(totalItems, itemsPerPage) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = useMemo(() => {
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    if (Number.isNaN(pageParam) || pageParam < 1) return 1;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    return Math.min(pageParam, totalPages);
  }, [searchParams, totalItems, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  // scroll to top when page is changed
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Change page function
  const goToPage = (page) => {
    const next = Math.min(Math.max(1, page), totalPages);
    setSearchParams({ page: String(next) });
  };

  return { currentPage, totalPages, startIndex, endIndex, goToPage };
}
