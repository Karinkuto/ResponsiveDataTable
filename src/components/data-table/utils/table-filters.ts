import { FilterFn, FilterMeta } from "@tanstack/react-table";

/**
 * Custom filter function for handling array values
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const arrayFilterFn: FilterFn<unknown> = (row, columnId, filterValue, _addMeta: (meta: FilterMeta) => void) => {
  // If the filter value is not an array, use the default includes filter
  if (!Array.isArray(filterValue) || filterValue.length === 0) {
    return true;
  }

  const value = row.getValue(columnId);
  return filterValue.includes(value);
}; 