import { useState } from "react";
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
  // If the filter value is not an array, use the default includes filter
  if (!Array.isArray(filterValue) || filterValue.length === 0) {
    return true;
  }

  const value = row.getValue(columnId);
  return filterValue.includes(value);
};

// Custom filter function for handling string searches
const stringFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  // If no filter value or not a string, don't filter
  if (filterValue === undefined || filterValue === null || filterValue === "" || typeof filterValue !== 'string') {
    return true;
  }

  const value = row.getValue(columnId);
  // Handle null or undefined values
  if (value === undefined || value === null) {
    return false;
  }

  // Case-insensitive search for string values
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
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialColumnVisibility);

  // Add the custom filter function to all columns
  const columnsWithFilters = columns.map(column => {
    if (typeof column === 'object' && column !== null) {
      return {
        ...column,
        filterFn: (row, columnId, value) => {
          // Use array filter for array filter values
          if (Array.isArray(value)) {
            return arrayFilterFn(row, columnId, value);
          }
          
          // Use string filter for string filter values
          if (typeof value === 'string') {
            return stringFilterFn(row, columnId, value);
          }
          
          // Default case - no filtering
          return true;
        },
      };
    }
    return column;
  });

  const table = useReactTable({
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
  });

  return table;
} 