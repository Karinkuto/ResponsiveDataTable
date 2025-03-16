import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { DataTableHeaderProps } from "../../types/table.types";

export function DataTableHeader<TData>({ table }: DataTableHeaderProps<TData>) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="hover:bg-transparent">
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              style={{ width: header.getSize() ? `${header.getSize()}px` : undefined }}
              className="h-11"
            >
              {header.isPlaceholder ? null : header.column.getCanSort() ? (
                <div
                  className={cn(
                    header.column.getCanSort() &&
                      "flex h-full cursor-pointer items-center justify-between gap-2 select-none",
                  )}
                  onClick={header.column.getToggleSortingHandler()}
                  onKeyDown={(e) => {
                    if (
                      header.column.getCanSort() &&
                      (e.key === "Enter" || e.key === " ")
                    ) {
                      e.preventDefault();
                      header.column.getToggleSortingHandler()?.(e);
                    }
                  }}
                  tabIndex={header.column.getCanSort() ? 0 : undefined}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: (
                      <ChevronUpIcon
                        className="shrink-0 opacity-60"
                        size={16}
                        aria-hidden="true"
                      />
                    ),
                    desc: (
                      <ChevronDownIcon
                        className="shrink-0 opacity-60"
                        size={16}
                        aria-hidden="true"
                      />
                    ),
                  }[header.column.getIsSorted() as string] ?? null}
                </div>
              ) : (
                flexRender(header.column.columnDef.header, header.getContext())
              )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
} 