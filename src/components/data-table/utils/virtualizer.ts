import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useCallback } from 'react';
import type { Table } from '@tanstack/react-table';

/**
 * Hook for virtualizing table rows to improve performance with large datasets
 * Provides a virtual window of rows to render, significantly improving performance
 * 
 * @param table The tanstack table instance
 * @param options Configuration options
 * @returns Virtualizer utilities and references
 */
export function useTableVirtualizer<TData>(
  table: Table<TData>,
  options: {
    enabled?: boolean;
    estimateSize?: (index: number) => number;
    overscan?: number;
    debug?: boolean;
  } = {}
) {
  // Create a ref for the container element
  const parentRef = useRef<HTMLDivElement>(null);
  
  // Default options
  const {
    enabled = true,
    estimateSize = () => 48, // Default row height of 48px
    overscan = 10,           // Number of items to render outside of the visible area
    debug = false,           // Enable debug mode
  } = options;
  
  // Get the rows to virtualize
  const rows = table.getRowModel().rows;
  
  // Always call useVirtualizer (respect React hooks rules), but with count=0 when disabled
  const virtualizer = useVirtualizer({
    count: enabled ? rows.length : 0,
    getScrollElement: () => parentRef.current,
    estimateSize,
    overscan,
    debug,
  });
  
  // Get the virtualized items
  const virtualRows = virtualizer.getVirtualItems();
  
  // Calculate total size
  const totalSize = virtualizer.getTotalSize();
  
  // Scroll to index utility
  const scrollToIndex = useCallback((index: number) => {
    virtualizer.scrollToIndex(index, { align: 'center' });
  }, [virtualizer]);
  
  // Scroll to top utility
  const scrollToTop = useCallback(() => {
    virtualizer.scrollToOffset(0);
  }, [virtualizer]);
  
  return {
    isEnabled: enabled,
    parentRef,
    virtualRows,
    totalSize,
    scrollToIndex,
    scrollToTop,
  };
} 