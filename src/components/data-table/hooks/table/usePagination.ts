import { Table } from "@tanstack/react-table";
import { useMemo, useCallback } from "react";
import { memoize } from "lodash-es";

/**
 * Hook to manage pagination state and calculations
 * Uses lodash memoization for performance
 */
export function usePagination<TData>(table: Table<TData>) {
  // Memoize the calculation of page metrics
  const calculatePageMetrics = useMemo(() => 
    memoize((
      pageIndex: number, 
      pageSize: number, 
      totalItems: number
    ) => {
      const startItem = pageIndex * pageSize + 1;
      const endItem = Math.min(pageIndex * pageSize + pageSize, totalItems);
      
      return {
        startItem,
        endItem,
        currentPage: pageIndex + 1,
        totalPages: Math.ceil(totalItems / pageSize)
      };
    }), 
  []);
  
  // Get current pagination state and derived values
  const pageCount = table.getPageCount();
  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();
  const totalItems = table.getRowCount();
  
  const { pageIndex, pageSize } = table.getState().pagination;
  
  // Calculate the current page metrics
  const metrics = calculatePageMetrics(pageIndex, pageSize, totalItems);
  
  // Navigation functions wrapped with useCallback
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