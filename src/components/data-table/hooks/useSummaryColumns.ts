import { Table } from "@tanstack/react-table";
import { useState, useEffect } from "react";

export function useSummaryColumns<TData>(
  table: Table<TData>,
  summaryColumns?: string[],
  actionsColumnId?: string,
) {
  const [activeSummaryColumns, setActiveSummaryColumns] = useState<string[]>([]);

  useEffect(() => {
    // If summary columns are provided, use them
    if (summaryColumns) {
      setActiveSummaryColumns(summaryColumns);
      return;
    }

    // Otherwise, determine default summary columns
    const visibleColumns = table.getAllColumns()
      .filter(column => 
        column.getCanHide() && 
        column.getIsVisible() && 
        column.id !== actionsColumnId &&
        !column.id.includes("accordionSummary")
      )
      .map(column => column.id);
    
    // Use first 2-3 columns (max 3 total)
    const minColumns = 2;
    const maxColumns = 3;
    const defaultSummaryColumns = visibleColumns.slice(0, Math.max(minColumns, Math.min(maxColumns, visibleColumns.length)));
    
    setActiveSummaryColumns(defaultSummaryColumns);
  }, [table, summaryColumns, actionsColumnId]);

  return activeSummaryColumns;
} 