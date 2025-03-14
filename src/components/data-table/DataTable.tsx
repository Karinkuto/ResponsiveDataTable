import { ColumnDef, SortingState } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { useDataTable } from "./hooks/useDataTable";
import { DataTableHeader } from "./DataTableHeader";
import { DataTableBody } from "./DataTableBody";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableMobile } from "./DataTableMobile";
import { DataTableRowActions, DataTableRowActionsProps, ActionItem, ActionGroup } from "./DataTableRowActions";
import { useEffect, useState } from "react";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  initialSorting?: SortingState;
  initialPageSize?: number;
  enableRowSelection?: boolean;
  rowActions?: (ActionItem<TData> | ActionGroup<TData>)[];
  actionsColumnId?: string;
}

export function DataTable<TData>({ 
  data, 
  columns, 
  initialSorting,
  initialPageSize = 5,
  enableRowSelection = false,
  rowActions,
  actionsColumnId = "actions",
}: DataTableProps<TData>) {
  const [isMobile, setIsMobile] = useState(false);
  
  // Add actions column if rowActions is provided
  const columnsWithActions = rowActions 
    ? [
        ...columns,
        {
          id: actionsColumnId,
          cell: ({ row }) => (
            <DataTableRowActions 
              row={row} 
              actions={rowActions} 
            />
          ),
          size: 50,
        } as ColumnDef<TData>,
      ] 
    : columns;

  const table = useDataTable({
    data,
    columns: columnsWithActions,
    initialSorting,
    initialPageSize,
    enableRowSelection,
  });

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
    <div className="flex flex-col gap-2 m-4">
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
        />
      </div>

      <Card className="p-0">
        <CardContent className="py-3 px-4">
          <DataTablePagination 
            table={table} 
            isMobile={isMobile}
          />
        </CardContent>
      </Card>
    </div>
  );
} 