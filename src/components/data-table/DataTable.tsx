import { ColumnDef, SortingState } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { useDataTable } from "./hooks/useDataTable";
import { DataTableHeader } from "./DataTableHeader";
import { DataTableBody } from "./DataTableBody";
import { DataTablePagination } from "./DataTablePagination";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  initialSorting?: SortingState;
  initialPageSize?: number;
}

export function DataTable<TData>({ 
  data, 
  columns, 
  initialSorting,
  initialPageSize,
}: DataTableProps<TData>) {
  const table = useDataTable({
    data,
    columns,
    initialSorting,
    initialPageSize,
  });

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-0">
        <CardContent className="p-0">
          <Table className="table-fixed">
            <DataTableHeader table={table} />
            <DataTableBody table={table} />
          </Table>
        </CardContent>
      </Card>

      <Card className="p-0">
        <CardContent className="p-3">
          <DataTablePagination table={table} />
        </CardContent>
      </Card>
    </div>
  );
} 