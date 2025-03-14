import { Table } from "@tanstack/react-table";
import { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash-es";

/**
 * Hook for handling search functionality in data tables
 * Uses lodash debounce to prevent excessive filter calls during typing
 */
export function useTableSearch<TData>(
  table: Table<TData>,
  searchColumn?: string,
  searchableColumns: { id: string, title: string }[] = [],
  debounceMs = 300
) {
  const [selectedSearchColumn, setSelectedSearchColumn] = useState<string | undefined>(
    searchColumn || (searchableColumns.length > 0 ? searchableColumns[0].id : undefined)
  );
  
  const [searchValue, setSearchValue] = useState("");
  
  // Create debounced search function with lodash
  // Use useRef to ensure the same debounced function instance persists between renders
  const debouncedSearch = useRef(
    debounce((value: string, columnId: string | undefined) => {
      if (columnId) {
        table.getColumn(columnId)?.setFilterValue(value);
      }
    }, debounceMs)
  ).current;
  
  // Clean up debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);
  
  // Get current search value from table state for controlled input
  const currentFilterValue = selectedSearchColumn
    ? (table.getColumn(selectedSearchColumn)?.getFilterValue() as string) ?? ""
    : "";
    
  // Update search input without triggering immediate table filter
  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    if (selectedSearchColumn) {
      debouncedSearch(value, selectedSearchColumn);
    }
  }, [selectedSearchColumn, debouncedSearch]);
  
  // Handle search column change
  const handleSearchColumnChange = useCallback((columnId: string) => {
    // If there's an active search, apply it to the new column
    if (searchValue) {
      // Cancel pending debounce on the previous column
      debouncedSearch.cancel();
      
      // Clear filter on previous column if exists
      if (selectedSearchColumn) {
        table.getColumn(selectedSearchColumn)?.setFilterValue("");
      }
      
      // Set the new column and apply filter immediately
      setSelectedSearchColumn(columnId);
      table.getColumn(columnId)?.setFilterValue(searchValue);
    } else {
      setSelectedSearchColumn(columnId);
    }
  }, [selectedSearchColumn, searchValue, table, debouncedSearch]);
  
  // Clear search function
  const clearSearch = useCallback(() => {
    setSearchValue("");
    if (selectedSearchColumn) {
      // Cancel any pending debounced searches
      debouncedSearch.cancel();
      // Immediately clear the filter
      table.getColumn(selectedSearchColumn)?.setFilterValue("");
    }
  }, [selectedSearchColumn, table, debouncedSearch]);

  return {
    selectedSearchColumn,
    setSelectedSearchColumn: handleSearchColumnChange,
    searchValue,
    currentFilterValue,
    handleSearch,
    clearSearch
  };
} 