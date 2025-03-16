import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Row } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTableAccordion } from "./DataTableAccordion";
import React from "react";
// Import our new hooks
import { useAccordion } from "../../hooks/ui/useAccordion";
import { useColumnVisibility } from "../../hooks/table/useColumnVisibility";
// Import types from the shared types directory
import { DataTableMobileProps } from "../../types/table.types";

export function DataTableMobile<TData>({ 
  table, 
  summaryColumns = [],
  renderSummary,
  actionsColumnId,
}: DataTableMobileProps<TData>) {
  // Use the accordion hook for open/close state
  const { openItemId, toggleItem } = useAccordion();
  
  // Use the column visibility hook to handle visibility changes
  useColumnVisibility(table, true);
  
  const getRowValue = (row: Row<TData>, columnId: string) => {
    const value = row.getValue(columnId);
    return value != null ? String(value) : "";
  };

  return (
    <div className="grid gap-2">
      {table.getRowModel().rows.map((row) => {
        // Find actions column if it exists
        const actionsCell = actionsColumnId ? row.getVisibleCells().find(
          cell => cell.column.id === actionsColumnId
        ) : null;
        
        // Get the columns to show in expanded view, excluding actions and summary columns
        const expandedColumns = row.getVisibleCells().filter(
          cell => !summaryColumns.includes(cell.column.id) && cell.column.id !== actionsColumnId
        );

        // Get primary column value
        const primaryValue = getRowValue(row, summaryColumns[0]);
        const status = getRowValue(row, "status");
        const hasStatus = summaryColumns.includes("status");

        return (
          <Card key={row.id} className="p-0">
            <CardContent className="p-0">
              <DataTableAccordion
                isOpen={openItemId === row.id}
                onToggle={() => toggleItem(row.id)}
                summary={
                  renderSummary ? (
                    renderSummary(row.original)
                  ) : (
                    <div className="flex flex-col gap-2 min-h-[2.5rem]">
                      {/* Primary information - First row */}
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-medium truncate">
                          {primaryValue || "Unnamed"}
                        </span>
                        <div className="flex items-center gap-2">
                          {hasStatus && status && (
                            <Badge 
                              variant="secondary"
                              className="shrink-0"
                            >
                              {status}
                            </Badge>
                          )}
                          {/* Add actions dropdown to the summary */}
                          {actionsCell && (
                            <div className="ml-2">
                              {flexRender(actionsCell.column.columnDef.cell, actionsCell.getContext())}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Secondary information - Second row with dot separators */}
                      <div className="text-sm text-muted-foreground flex flex-wrap items-center">
                        {(() => {
                          // Filter and prepare the values to display
                          const secondaryValues = summaryColumns.slice(1)
                            .filter(columnId => !(columnId === "status" && hasStatus)) // Skip status if shown as badge
                            .map(columnId => getRowValue(row, columnId))
                            .filter(value => value); // Remove empty values
                          
                          if (secondaryValues.length === 0) return null;
                          
                          // Return the values with dot separators
                          return secondaryValues.map((value, index) => (
                            <React.Fragment key={index}>
                              {index > 0 && <span className="mx-1.5 text-muted-foreground/60">•</span>}
                              <span className="truncate">{value}</span>
                            </React.Fragment>
                          ));
                        })()}
                      </div>
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
                            className="hover:bg-muted/50 border-b last:border-b-0 transition-colors"
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