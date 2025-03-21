import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
// Import types from the shared types directory
import { DataTableBodyProps } from "../../types/table.types";

// Remove interface since it's now in the types file
// interface DataTableBodyProps<TData> {...}

export function DataTableBody<TData>({ table }: DataTableBodyProps<TData>) {
  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
} 