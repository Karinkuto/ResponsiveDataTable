import { Table } from "@tanstack/react-table";
import { useEffect, useState, useCallback } from "react";

/**
 * Hook to manage column visibility with the ability to 
 * save/restore column visibility state across view changes
 */
export function useColumnVisibility<TData>(
  table: Table<TData>,
  makeAllVisible = false
) {
  const [originalVisibility, setOriginalVisibility] = useState({});
  
  // Save current visibility and apply new visibility settings
  const saveAndRestore = useCallback((shouldMakeAllVisible: boolean) => {
    if (shouldMakeAllVisible) {
      // Save original visibility state
      const currentVisibility = table.getState().columnVisibility;
      setOriginalVisibility(currentVisibility);
      
      // Make all columns visible
      const allColumns = table.getAllColumns();
      const allVisible = allColumns.reduce((acc, column) => {
        acc[column.id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      
      table.setColumnVisibility(allVisible);
      
      // Provide a cleanup function to restore original visibility
      return () => {
        table.setColumnVisibility(currentVisibility);
      };
    }
    return () => {}; // No-op if we're not changing visibility
  }, [table]);
  
  // Apply visibility changes when component renders/updates
  useEffect(() => {
    const cleanup = saveAndRestore(makeAllVisible);
    return cleanup;
  }, [makeAllVisible, saveAndRestore]);
  
  // Function to manually restore original visibility
  const restoreVisibility = useCallback(() => {
    table.setColumnVisibility(originalVisibility as any);
  }, [table, originalVisibility]);
  
  return {
    originalVisibility,
    restoreVisibility
  };
} 