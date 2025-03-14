import { ColumnDef, Table as TableType, Row, SortingState, VisibilityState } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { ActionItem, ActionGroup } from "../components/actions";

// Main DataTable props
export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  initialSorting?: SortingState;
  initialPageSize?: number;
  enableRowSelection?: boolean;
  rowActions?: (ActionItem<TData> | ActionGroup<TData>)[];
  actionsColumnId?: string;
  searchColumn?: string;
  searchableColumns?: {
    id: string;
    title: string;
  }[];
  onAddClick?: () => void;
  onRefreshClick?: () => void;
  onExportClick?: () => void;
  onImportClick?: () => void;
  filterableColumns?: {
    id: string;
    title: string;
    options: {
      label: string;
      value: string;
    }[];
  }[];
  initialColumnVisibility?: VisibilityState;
  className?: string;
  /**
   * Column IDs to show in the mobile accordion summary.
   * If not provided, the first 2-4 columns will be used.
   */
  summaryColumns?: string[];
}

// Mobile table props
export interface DataTableMobileProps<TData> {
  table: TableType<TData>;
  /**
   * Column IDs to show in the accordion summary.
   * First column is treated as the title.
   * If not provided, the first 2-4 columns will be used (min 2, max 4).
   */
  summaryColumns?: string[];
  /**
   * Optional custom render function for the summary
   */
  renderSummary?: (row: TData) => ReactNode;
  /**
   * Column ID for the actions column
   */
  actionsColumnId?: string;
}

// Table toolbar props
export interface DataTableToolbarProps<TData> {
  table: TableType<TData>;
  searchColumn?: string;
  searchableColumns?: {
    id: string;
    title: string;
  }[];
  onAddClick?: () => void;
  onRefreshClick?: () => void;
  onExportClick?: () => void;
  onImportClick?: () => void;
  filterableColumns?: {
    id: string;
    title: string;
    options: {
      label: string;
      value: string;
    }[];
  }[];
  className?: string;
  summaryColumns?: string[];
}

// Mobile toolbar props - extends the main toolbar props
export interface DataTableToolbarMobileProps<TData> extends DataTableToolbarProps<TData> {}

// Table header props
export interface DataTableHeaderProps<TData> {
  table: TableType<TData>;
}

// Table body props
export interface DataTableBodyProps<TData> {
  table: TableType<TData>;
}

// Pagination props
export interface DataTablePaginationProps<TData> {
  table: TableType<TData>;
  isMobile?: boolean;
}

// Accordion props
export interface DataTableAccordionProps {
  isOpen: boolean;
  onToggle: () => void;
  summary: ReactNode;
  children: ReactNode;
} 