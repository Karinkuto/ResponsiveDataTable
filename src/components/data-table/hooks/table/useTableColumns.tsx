import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import React from "react";
import { ActionItem, ActionGroup, DataTableRowActions } from "../../components/actions/DataTableRowActions";

/**
 * Hook for handling column manipulation logic
 * Adds action column if needed and sets default values for all columns
 */
export function useTableColumns<TData>(
  columns: ColumnDef<TData>[],
  rowActions?: (ActionItem<TData> | ActionGroup<TData>)[],
  actionsColumnId = "actions"
): ColumnDef<TData>[] {
  return useMemo(() => {
    const columnsWithSettings = columns.map(col => ({
      ...col,
      enableHiding: col.enableHiding ?? true,
    }));
    
    if (!rowActions) {
      return columnsWithSettings;
    }
    
    return [
      ...columnsWithSettings,
      {
        id: actionsColumnId,
        cell: ({ row }) => (
          <DataTableRowActions<TData>
            row={row}
            actions={rowActions}
          />
        ),
        size: 50,
        enableHiding: false,
      } as ColumnDef<TData>,
    ];
  }, [columns, rowActions, actionsColumnId]);
} 