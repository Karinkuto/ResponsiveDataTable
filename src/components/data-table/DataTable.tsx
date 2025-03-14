import { ColumnDef, SortingState, VisibilityState } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { useDataTable } from "./hooks/table/useDataTable";
import { useSummaryColumns } from "./hooks/table/useSummaryColumns";
import { DataTableHeader } from "./components/core/DataTableHeader";
import { DataTableBody } from "./components/core/DataTableBody";
import { DataTablePagination } from "./components/pagination/DataTablePagination";
import { DataTableMobile } from "./components/mobile/DataTableMobile";
import { DataTableRowActions, DataTableRowActionsProps, ActionItem, ActionGroup } from "./components/actions/DataTableRowActions";
import { DataTableToolbar } from "./components/toolbar/DataTableToolbar";
import { DataTableToolbarMobile } from "./components/toolbar/DataTableToolbarMobile";
import { useEffect } from "react";
// Import our new hooks
import { useResponsive } from "./hooks/ui/useResponsive";
import { useTableColumns } from "./hooks/table/useTableColumns";
// Import types from the types directory
import { DataTableProps } from "./types/table.types";

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
  // Replace custom implementation with the responsive hook
  const { isMobile } = useResponsive();
  
  // Use the table columns hook to handle column manipulation
  const columnsWithActions = useTableColumns(columns, rowActions, actionsColumnId);

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