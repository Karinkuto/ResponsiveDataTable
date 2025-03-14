// Main DataTable component
export { DataTable } from './DataTable';

// Re-export component groups
export * from './components';
export * from './hooks';
export * from './types';
export * from './utils';

// Explicitly re-export action types for external use
export type { ActionItem, ActionGroup } from './components/actions/DataTableRowActions'; 