import { FilterFn } from "@tanstack/react-table";

/**
 * Custom filter function for handling array values
 */
export const arrayFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  // If the filter value is not an array, use the default includes filter
  if (!Array.isArray(filterValue) || filterValue.length === 0) {
    return true;
  }

  const value = row.getValue(columnId);
  return filterValue.includes(value);
}; 