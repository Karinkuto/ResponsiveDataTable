import React, { memo } from 'react';
import { flexRender, Table } from '@tanstack/react-table';
import { useTableVirtualizer } from '../../utils/virtualizer';
import { TableHead, TableHeader, TableRow, TableCell, TableBody } from '@/components/ui/table';

interface VirtualizedTableProps<TData> {
  table: Table<TData>;
  virtualizer: ReturnType<typeof useTableVirtualizer<TData>>;
}

/**
 * A virtualized table component that only renders visible rows
 * Significantly improves performance for large datasets
 */
function VirtualizedTableComponent<TData>({
  table,
  virtualizer,
}: VirtualizedTableProps<TData>) {
  const { parentRef, virtualRows, totalSize } = virtualizer;
  
  // Get all columns
  const headerGroups = table.getHeaderGroups();
  
  // If virtualization is disabled or no virtual rows, render nothing
  // (the parent component should handle this case)
  if (!virtualizer.isEnabled || virtualRows.length === 0) {
    return null;
  }
  
  return (
    <>
      {/* Table Header (not virtualized) */}
      <TableHeader>
        {headerGroups.map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} colSpan={header.colSpan} style={{ width: header.getSize() }}>
                {header.isPlaceholder ? null : (
                  <div className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </div>
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      
      {/* Virtualized Table Body */}
      <TableBody
        className="relative"
        style={{ height: `${totalSize}px` }}
      >
        {/* Container div with the reference needed for virtualization */}
        <div
          ref={parentRef}
          style={{
            height: `${totalSize}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualRows.map((virtualRow) => {
            const row = table.getRowModel().rows[virtualRow.index];
            
            return (
              <TableRow
                key={row.id}
                data-index={virtualRow.index}
                data-state={row.getIsSelected() ? 'selected' : undefined}
                className="absolute w-full"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </div>
      </TableBody>
    </>
  );
}

// Export memoized component to prevent unnecessary re-renders
export const VirtualizedTable = memo(VirtualizedTableComponent) as typeof VirtualizedTableComponent; 