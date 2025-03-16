// Export the main component
export { DataTable } from './DataTable';

// Export types for better developer experience
export type { DataTableProps } from './types/table.types';

// Export hooks individually to support tree-shaking
// This allows users to only import what they need
export { useDataTable } from './hooks/table/useDataTable';
export { useTableSearch } from './hooks/table/useTableSearch';
export { usePagination } from './hooks/table/usePagination';
export { useTableColumns } from './hooks/table/useTableColumns';
export { useColumnVisibility } from './hooks/table/useColumnVisibility';
export { useSummaryColumns } from './hooks/table/useSummaryColumns';
export { useResponsive } from './hooks/ui/useResponsive';
export { useAccordion } from './hooks/ui/useAccordion';

// Re-export component groups
export * from './components';
export * from './types';
export * from './utils';

// Explicitly re-export action types for external use
export type { ActionItem, ActionGroup } from './components/actions/DataTableRowActions';

// Export specific optimization utilities for direct usage
export { useTableVirtualizer } from "./utils/virtualizer";
export { useTableWorker } from "./utils/tableWorker"; 