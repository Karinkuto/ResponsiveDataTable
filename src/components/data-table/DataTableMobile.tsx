import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Table as TableType, Row } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTableAccordion } from "./DataTableAccordion";
import { useState } from "react";

interface DataTableMobileProps<TData> {
  table: TableType<TData>;
  /**
   * Column IDs to show in the accordion summary.
   * First column is treated as the title.
   */
  summaryColumns?: string[];
  /**
   * Optional custom render function for the summary
   */
  renderSummary?: (row: TData) => React.ReactNode;
}

export function DataTableMobile<TData>({ 
  table, 
  summaryColumns = ["name", "email", "status"],
  renderSummary,
}: DataTableMobileProps<TData>) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getRowValue = (row: Row<TData>, columnId: string) => {
    const value = row.getValue(columnId);
    return value != null ? String(value) : "";
  };

  return (
    <div className="space-y-2">
      {table.getRowModel().rows.map((row) => {
        // Get the columns to show in expanded view
        const expandedColumns = row.getVisibleCells().filter(
          cell => !summaryColumns.includes(cell.column.id) && cell.column.id !== "select"
        );

        // Get primary column value
        const primaryValue = getRowValue(row, summaryColumns[0]);
        const status = getRowValue(row, "status");

        return (
          <Card key={row.id} className="p-0">
            <CardContent className="p-0">
              <DataTableAccordion
                isOpen={openItems[row.id] || false}
                onToggle={() => toggleItem(row.id)}
                summary={
                  renderSummary ? (
                    renderSummary(row.original)
                  ) : (
                    <div className="flex flex-col gap-2 min-h-[2.5rem]">
                      {/* Primary information */}
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-medium truncate">
                          {primaryValue || "Unnamed"}
                        </span>
                        {status && (
                          <Badge 
                            variant="secondary"
                            className="shrink-0"
                          >
                            {status}
                          </Badge>
                        )}
                      </div>
                      {/* Secondary information */}
                      {summaryColumns.slice(1).map((columnId) => {
                        if (columnId === "status") return null; // Skip status as it's shown above
                        const value = getRowValue(row, columnId);
                        if (!value) return null;
                        
                        const header = table.getHeaderGroups()[0].headers.find(
                          h => h.id === columnId
                        );
                        const headerContent = header?.column.columnDef.header;
                        const headerString = typeof headerContent === "string" 
                          ? headerContent 
                          : columnId;
                        
                        return (
                          <div 
                            key={columnId}
                            className="text-sm text-muted-foreground flex items-center gap-2"
                          >
                            <span className="font-medium">
                              {headerString}:
                            </span>
                            <span className="truncate">
                              {value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )
                }
              >
                <div className="border-t">
                  <Table>
                    <TableBody>
                      {expandedColumns.map((cell) => {
                        const header = table.getHeaderGroups()[0].headers.find(
                          (h) => h.id === cell.column.id
                        );
                        const headerContent = header
                          ? flexRender(header.column.columnDef.header, header.getContext())
                          : cell.column.id;

                        return (
                          <TableRow
                            key={cell.id}
                            data-state={row.getIsSelected() && "selected"}
                            className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b last:border-b-0 transition-colors"
                          >
                            <TableCell className="bg-muted/50 py-3 font-medium w-[35%]">
                              {headerContent}
                            </TableCell>
                            <TableCell className="py-3">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </DataTableAccordion>
            </CardContent>
          </Card>
        );
      })}
      
      {table.getRowModel().rows.length === 0 && (
        <Card className="p-0">
          <CardContent className="h-24 text-center flex items-center justify-center text-muted-foreground">
            No results.
          </CardContent>
        </Card>
      )}
    </div>
  );
}