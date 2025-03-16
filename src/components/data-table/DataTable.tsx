import { ColumnDef, SortingState, VisibilityState } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useDataTable } from "./hooks/table/useDataTable";
import { useSummaryColumns } from "./hooks/table/useSummaryColumns";
import { useTableColumns } from "./hooks/table/useTableColumns";
import { useResponsive } from "./hooks/ui/useResponsive";
import { DataTableProps } from "./types/table.types";
import { useTableVirtualizer } from "./utils/virtualizer";
import { useTableWorker } from "./utils/tableWorker";
import React, { lazy, Suspense, memo, useEffect, useMemo, useState, useCallback } from "react";

// Lazy load all components for better initial loading performance
const DataTableHeader = lazy(() => import("./components/core/DataTableHeader").then(
  module => ({ default: module.DataTableHeader })
));
const DataTableBody = lazy(() => import("./components/core/DataTableBody").then(
  module => ({ default: module.DataTableBody })
));
const DataTablePagination = lazy(() => import("./components/pagination/DataTablePagination").then(
  module => ({ default: module.DataTablePagination })
));
const DataTableMobile = lazy(() => import("./components/mobile/DataTableMobile").then(
  module => ({ default: module.DataTableMobile })
));
const DataTableToolbar = lazy(() => import("./components/toolbar/DataTableToolbar").then(
  module => ({ default: module.DataTableToolbar })
));
const DataTableToolbarMobile = lazy(() => import("./components/toolbar/DataTableToolbarMobile").then(
  module => ({ default: module.DataTableToolbarMobile })
));

// Dynamic import for virtualized table - only loaded when needed
const VirtualizedTable = lazy(() => import("./components/virtualized/VirtualizedTable").then(
  module => ({ default: module.VirtualizedTable })
));

// Thresholds for optimization features - lowered for earlier activation
const VIRTUALIZATION_THRESHOLD = 30; // Lowered from 50
const WORKER_THRESHOLD = 75;         // Lowered from 100

/**
 * Optimized DataTable component with:
 * - Memoization to prevent unnecessary re-renders
 * - Row virtualization for large datasets
 * - Web worker for heavy computations
 * - Lazy loading for all components
 * - Skeleton loading UI
 */
function DataTableComponent<TData>({ 
  data, 
  columns, 
  initialSorting,
  initialPageSize = 5,
  enableRowSelection = false,
  rowActions,
  actionsColumnId = "actions",
  searchColumn,
  searchableColumns = [],
  onAddClick,
  onRefreshClick,
  onExportClick,
  onImportClick,
  filterableColumns = [],
  initialColumnVisibility,
  className,
  summaryColumns,
  isLoading = false,
  // Performance optimization props
  enableVirtualization = data.length > VIRTUALIZATION_THRESHOLD,
  enableWorkers = data.length > WORKER_THRESHOLD,
  estimateRowHeight = () => 48,
  overscan = 10,
}: DataTableProps<TData> & {
  enableVirtualization?: boolean;
  enableWorkers?: boolean;
  estimateRowHeight?: (index: number) => number;
  overscan?: number;
}) {
  const { isMobile } = useResponsive();
  
  // Initialize worker if enabled and data exceeds threshold
  const tableWorker = useMemo(
    () => enableWorkers ? useTableWorker<TData>() : null,
    [enableWorkers]
  );
  
  // Track original data and processed data
  const [processedData, setProcessedData] = useState(data);
  
  // Use worker for sorting if available
  const [sorting, setSorting] = useState<SortingState>(initialSorting || []);
  
  // Move hook calls to the top level - don't call hooks inside useMemo
  const tableColumnsWithActions = useTableColumns(columns, rowActions, actionsColumnId);
  
  // Properly memoize columns with actions for better performance
  const columnsWithActions = useMemo(
    () => tableColumnsWithActions,
    [tableColumnsWithActions]
  );
  
  // Optimize worker processing with proper cleanup
  useEffect(() => {
    let isMounted = true;
    
    if (tableWorker && enableWorkers && sorting.length > 0) {
      // Process data in worker
      tableWorker.sortData(data, sorting).then(result => {
        if (isMounted) {
          setProcessedData(result);
        }
      });
    } else {
      // If no worker or no sorting, use original data
      setProcessedData(data);
    }
    
    return () => { isMounted = false; };
  }, [data, sorting, tableWorker, enableWorkers]);

  // Create the table instance with either processed or original data
  const table = useDataTable({
    data: processedData,
    columns: columnsWithActions,
    initialSorting,
    initialPageSize,
    enableRowSelection,
    initialColumnVisibility,
  });
  
  // Override the sorting state handler to use worker when available
  useEffect(() => {
    if (enableWorkers) {
      const originalOnSortingChange = table.getState().sorting;
      table.setColumnOrder = (updater) => {
        const newSorting = typeof updater === 'function' 
          ? updater(originalOnSortingChange) 
          : updater;
        setSorting(newSorting);
      };
    }
  }, [table, enableWorkers]);

  // Move hook call to the top level - don't call hooks inside useMemo
  const tableSummaryColumns = useSummaryColumns(table, summaryColumns, actionsColumnId);
  
  // Get the active summary columns - now just memoize the result
  const activeSummaryColumns = useMemo(
    () => tableSummaryColumns,
    [tableSummaryColumns]
  );

  // Create virtualizer - now we ALWAYS call the hook but pass enabled flag
  const virtualizer = useTableVirtualizer(table, { 
    enabled: enableVirtualization,
    estimateSize: estimateRowHeight, 
    overscan 
  });

  // Force 5 rows per page on mobile
  useEffect(() => {
    if (isMobile) {
      table.setPageSize(5);
    }
  }, [isMobile, table]);

  // Memoize component props to prevent unnecessary re-renders
  const toolbarProps = useMemo(() => ({
    table,
    searchColumn,
    searchableColumns,
    onAddClick,
    onRefreshClick,
    onExportClick,
    onImportClick,
    filterableColumns,
    summaryColumns: activeSummaryColumns
  }), [
    table, 
    searchColumn, 
    searchableColumns, 
    onAddClick, 
    onRefreshClick, 
    onExportClick, 
    onImportClick, 
    filterableColumns, 
    activeSummaryColumns
  ]);

  const mobileProps = useMemo(() => ({
    table,
    actionsColumnId: rowActions ? actionsColumnId : undefined,
    summaryColumns: activeSummaryColumns
  }), [table, rowActions, actionsColumnId, activeSummaryColumns]);

  // Simple table skeleton loading component - simplified to use block skeletons
  const TableSkeleton = useCallback(({ rowCount }: { rowCount?: number }) => {
    // Use the current page size for number of rows if rowCount is not provided
    const skeletonRowCount = rowCount || table.getState().pagination.pageSize;
    
    return (
      <>
        <TableHeader>
          <TableRow>
            <TableHead colSpan={columns.length + (rowActions ? 1 : 0)}>
              <Skeleton className="w-full h-10" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: skeletonRowCount }).map((_, row) => (
            <TableRow key={`skeleton-row-${row}`}>
              <TableCell colSpan={columns.length + (rowActions ? 1 : 0)}>
                <Skeleton className="w-full h-10 my-0.5" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </>
    );
  }, [columns.length, rowActions, table]);

  // Add a new state to track initial loading
  const [showSkeletons, setShowSkeletons] = useState(true);
  
  // Effect to handle initial load and transitions
  useEffect(() => {
    if (isLoading) {
      // When loading starts/changes, always show skeletons first
      setShowSkeletons(true);
    } else {
      // Add a small delay before hiding skeletons to prevent flashes
      const timer = setTimeout(() => {
        setShowSkeletons(false);
      }, 300); // Short delay to ensure smooth transition
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Modify renderTableContent to use the combined loading state
  const renderTableContent = useCallback(() => {
    // If loading or in initial skeleton state, show skeleton UI
    if (isLoading || showSkeletons) {
      return <TableSkeleton />;
    }

    // If virtualization is enabled, render virtualized content
    if (virtualizer.isEnabled && virtualizer.virtualRows.length > 0) {
      return (
        <Suspense fallback={<TableSkeleton />}>
          <VirtualizedTable 
            table={table} 
            virtualizer={virtualizer} 
          />
        </Suspense>
      );
    }

    // Otherwise render regular table
    return (
      <Suspense fallback={<TableSkeleton />}>
        <>
          <DataTableHeader table={table} />
          <DataTableBody table={table} />
        </>
      </Suspense>
    );
  }, [table, virtualizer, isLoading, showSkeletons, TableSkeleton]);

  // Simple toolbar skeleton for desktop - simplified to a single block
  const DesktopToolbarSkeleton = () => (
    <Card className="p-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-9 w-[250px]" />
        <div className="flex space-x-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </Card>
  );

  // Simple toolbar skeleton for mobile - simplified to a single block
  const MobileToolbarSkeleton = () => (
    <Card className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-9 w-full rounded-md" />
        <div className="flex justify-end space-x-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </Card>
  );

  // Simple pagination skeleton - simplified to a single block
  const PaginationSkeleton = () => (
    <Card className="p-2">
      <div className="flex justify-between items-center px-2">
        <Skeleton className="h-8 w-[180px] rounded-md" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </Card>
  );

  // Mobile accordion skeleton - creates multiple accordion skeletons
  const MobileAccordionSkeletons = useCallback(() => {
    // Always use 5 for mobile as we force 5 rows per page on mobile
    const mobileRowCount = 5;
    
    return (
      <div className="space-y-2">
        {Array.from({ length: mobileRowCount }).map((_, index) => (
          <Card key={`mobile-skeleton-${index}`} className="overflow-hidden">
            <div className="p-3 border-b border-border bg-muted/40">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-3/4 rounded-md" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {/* Simulate 3 rows of data in each accordion */}
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-1/4 rounded-md" />
                  <Skeleton className="h-4 w-2/4 rounded-md" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-1/4 rounded-md" />
                  <Skeleton className="h-4 w-2/4 rounded-md" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-1/4 rounded-md" />
                  <Skeleton className="h-4 w-2/4 rounded-md" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }, []);

  return (
    <div className={`flex flex-col gap-4 ${className || ''}`}>
      {/* Desktop Toolbar */}
      <div className="hidden md:block">
        {isLoading || showSkeletons ? (
          <DesktopToolbarSkeleton />
        ) : (
          <Suspense fallback={<DesktopToolbarSkeleton />}>
            <DataTableToolbar {...toolbarProps} />
          </Suspense>
        )}
      </div>
      
      {/* Mobile Toolbar */}
      <div className="md:hidden">
        {isLoading || showSkeletons ? (
          <MobileToolbarSkeleton />
        ) : (
          <Suspense fallback={<MobileToolbarSkeleton />}>
            <DataTableToolbarMobile {...toolbarProps} />
          </Suspense>
        )}
      </div>
      
      {/* Desktop View */}
      <div className="hidden md:block">
        <Card className="p-0 overflow-hidden">
          <CardContent className="p-0">
            <Table className="table-fixed">
              {renderTableContent()}
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {isLoading || showSkeletons ? (
          <MobileAccordionSkeletons />
        ) : (
          <Suspense fallback={<MobileAccordionSkeletons />}>
            <DataTableMobile {...mobileProps} />
          </Suspense>
        )}
      </div>

      {/* Pagination */}
      {isLoading || showSkeletons ? (
        <PaginationSkeleton />
      ) : (
        <Suspense fallback={<PaginationSkeleton />}>
          <DataTablePagination 
            table={table} 
            isMobile={isMobile}
          />
        </Suspense>
      )}
    </div>
  );
}

// Export the component
export { DataTableComponent as DataTable }; 