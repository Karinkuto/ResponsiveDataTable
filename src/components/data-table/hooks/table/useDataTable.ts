import { useState, useMemo, useCallback } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";

// Custom filter function for handling array values
const arrayFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  if (!Array.isArray(filterValue) || filterValue.length === 0) {
    return true;
  }
  const value = row.getValue(columnId);
  return filterValue.includes(value);
};

// Custom filter function for handling string searches
const stringFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  if (filterValue === undefined || filterValue === null || filterValue === "" || typeof filterValue !== 'string') {
    return true;
  }
  const value = row.getValue(columnId);
  if (value === undefined || value === null) {
    return false;
  }
  return String(value).toLowerCase().includes(filterValue.toLowerCase());
};

interface UseDataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  initialSorting?: SortingState;
  initialPageSize?: number;
  enableRowSelection?: boolean;
  initialColumnVisibility?: VisibilityState;
}

export function useDataTable<TData>({
  data,
  columns,
  initialSorting = [],
  initialPageSize = 5,
  enableRowSelection = false,
  initialColumnVisibility = {},
}: UseDataTableProps<TData>) {
  // Memoize pagination state to maintain stable reference
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialColumnVisibility);

  // Define a stable filter function using useCallback with empty deps array
  // since this function doesn't depend on any external variables
  const filterFn = useCallback((row: any, columnId: string, value: any) => {
    if (Array.isArray(value)) {
      return arrayFilterFn(row, columnId, value);
    }
    if (typeof value === 'string') {
      return stringFilterFn(row, columnId, value);
    }
    return true;
  }, []);

  // Properly memoize columns with filters to prevent unnecessary recreations
  const columnsWithFilters = useMemo(() => 
    columns.map(column => {
      if (typeof column === 'object' && column !== null) {
        return {
          ...column,
          filterFn,
        };
      }
      return column;
    }),
    // Only recreate when columns or filterFn actually change
    [columns, filterFn]
  );

  // Memoize the table configuration object to prevent unnecessary recreations
  const tableConfig = useMemo(() => ({
    data,
    columns: columnsWithFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
  }), [
    data, 
    columnsWithFilters, 
    sorting, 
    pagination, 
    rowSelection, 
    columnFilters, 
    columnVisibility, 
    enableRowSelection
  ]);

  const table = useReactTable(tableConfig);

  return table;
}