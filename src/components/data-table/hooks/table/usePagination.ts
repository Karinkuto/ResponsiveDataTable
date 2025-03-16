import { Table } from "@tanstack/react-table";
import { useMemo, useCallback } from "react";

/**
 * Hook to manage pagination state and calculations
 * Uses React's useMemo for performance instead of lodash memoization
 */
export function usePagination<TData>(table: Table<TData>) {
  // Get current pagination state and derived values
  const pageCount = table.getPageCount();
  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();
  const totalItems = table.getRowCount();
  
  const { pageIndex, pageSize } = table.getState().pagination;
  
  // Replace lodash memoize with direct useMemo implementation
  const metrics = useMemo(() => {
    const startItem = pageIndex * pageSize + 1;
    const endItem = Math.min(pageIndex * pageSize + pageSize, totalItems);
    
    return {
      startItem,
      endItem,
      currentPage: pageIndex + 1,
      totalPages: Math.ceil(totalItems / pageSize)
    };
  }, [pageIndex, pageSize, totalItems]);
  
  // Navigation functions wrapped with useCallback for stable references
  const firstPage = useCallback(() => table.firstPage(), [table]);
  const previousPage = useCallback(() => table.previousPage(), [table]);
  const nextPage = useCallback(() => table.nextPage(), [table]);
  const lastPage = useCallback(() => table.lastPage(), [table]);
  const setPageSize = useCallback((size: number) => table.setPageSize(size), [table]);
  
  return {
    ...metrics,
    pageCount,
    canPreviousPage,
    canNextPage,
    totalItems,
    firstPage,
    previousPage,
    nextPage,
    lastPage,
    setPageSize,
  };
} 