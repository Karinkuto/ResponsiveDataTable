import { ColumnDef, SortingState, VisibilityState } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { useDataTable } from "./hooks/useDataTable";
import { useSummaryColumns } from "./hooks/useSummaryColumns";
import { DataTableHeader } from "./DataTableHeader";
import { DataTableBody } from "./DataTableBody";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableMobile } from "./DataTableMobile";
import { DataTableRowActions, DataTableRowActionsProps, ActionItem, ActionGroup } from "./DataTableRowActions";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTableToolbarMobile } from "./DataTableToolbarMobile";
import { useEffect, useState } from "react";

interface DataTableProps<TData> {
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

export function DataTable<TData>({ 
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
}: DataTableProps<TData>) {
  const [isMobile, setIsMobile] = useState(false);
  
  // Add actions column if rowActions is provided and set enableHiding to true by default for all columns
  const columnsWithActions = rowActions 
    ? [
        ...columns.map(col => ({
          ...col,
          enableHiding: col.enableHiding ?? true,
        })),
        {
          id: actionsColumnId,
          cell: ({ row }) => (
            <DataTableRowActions 
              row={row} 
              actions={rowActions} 
            />
          ),
          size: 50,
          enableHiding: false,
        } as ColumnDef<TData>,
      ] 
    : columns.map(col => ({
        ...col,
        enableHiding: col.enableHiding ?? true,
      }));

  const table = useDataTable({
    data,
    columns: columnsWithActions,
    initialSorting,
    initialPageSize,
    enableRowSelection,
    initialColumnVisibility,
  });

  // Get the active summary columns
  const activeSummaryColumns = useSummaryColumns(table, summaryColumns, actionsColumnId);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Force 5 rows per page on mobile
  useEffect(() => {
    if (isMobile) {
      table.setPageSize(5);
    }
  }, [isMobile, table]);

  return (
    <div className={`flex flex-col gap-4 ${className || ''}`}>
      {/* Desktop Toolbar */}
      <div className="hidden md:block">
        <DataTableToolbar 
          table={table}
          searchColumn={searchColumn}
          searchableColumns={searchableColumns}
          onAddClick={onAddClick}
          onRefreshClick={onRefreshClick}
          onExportClick={onExportClick}
          onImportClick={onImportClick}
          filterableColumns={filterableColumns}
          summaryColumns={activeSummaryColumns}
        />
      </div>
      
      {/* Mobile Toolbar */}
      <div className="md:hidden">
        <DataTableToolbarMobile 
          table={table}
          searchColumn={searchColumn}
          searchableColumns={searchableColumns}
          onAddClick={onAddClick}
          onRefreshClick={onRefreshClick}
          onExportClick={onExportClick}
          onImportClick={onImportClick}
          filterableColumns={filterableColumns}
          summaryColumns={activeSummaryColumns}
        />
      </div>
      
      {/* Desktop View */}
      <div className="hidden md:block">
        <Card className="p-0 overflow-hidden">
          <CardContent className="p-0">
            <Table className="table-fixed">
              <DataTableHeader table={table} />
              <DataTableBody table={table} />
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <DataTableMobile 
          table={table} 
          actionsColumnId={rowActions ? actionsColumnId : undefined}
          summaryColumns={activeSummaryColumns}
        />
      </div>

      <DataTablePagination 
        table={table} 
        isMobile={isMobile}
      />
    </div>
  );
} 