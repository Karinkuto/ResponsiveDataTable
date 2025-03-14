import { Table as TableType } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useId } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { usePagination } from "../../hooks/table/usePagination";
import { DataTablePaginationProps } from "../../types/table.types";

export function DataTablePagination<TData>({ table, isMobile }: DataTablePaginationProps<TData>) {
  const id = useId();
  
  const {
    startItem,
    endItem,
    totalItems,
    canPreviousPage,
    canNextPage,
    firstPage,
    previousPage,
    nextPage,
    lastPage,
    setPageSize
  } = usePagination(table);

  return (
    <Card className="p-0">
      <CardContent className="py-3 px-4">
        <div className="flex items-center justify-between gap-8">
          {/* Rows per page selector - hidden on mobile */}
          {!isMobile && (
            <div className="flex items-center gap-3">
              <Label htmlFor={id}>
                Rows per page
              </Label>
              <Select
                value={table.getState().pagination.pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                }}
              >
                <SelectTrigger id={id} className="w-fit whitespace-nowrap">
                  <SelectValue placeholder="Select number of results" />
                </SelectTrigger>
                <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                  {[5, 10, 25, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Page info - moved to left on mobile */}
          <div className={cn(
            "text-muted-foreground text-sm whitespace-nowrap min-w-[5rem]",
            isMobile ? "flex-1" : "flex grow justify-end"
          )}>
            <p className="text-muted-foreground text-sm whitespace-nowrap" aria-live="polite">
              <span className="text-foreground">
                {startItem}-{endItem}
              </span>{" "}
              of <span className="text-foreground">{totalItems}</span>
            </p>
          </div>

          {/* Navigation buttons */}
          <div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={firstPage}
                    disabled={!canPreviousPage}
                    aria-label="Go to first page"
                  >
                    <ChevronFirstIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={previousPage}
                    disabled={!canPreviousPage}
                    aria-label="Go to previous page"
                  >
                    <ChevronLeftIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={nextPage}
                    disabled={!canNextPage}
                    aria-label="Go to next page"
                  >
                    <ChevronRightIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={lastPage}
                    disabled={!canNextPage}
                    aria-label="Go to last page"
                  >
                    <ChevronLastIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 