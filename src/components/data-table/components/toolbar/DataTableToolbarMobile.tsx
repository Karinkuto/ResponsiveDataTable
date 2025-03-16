import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Search, Filter, Plus, Check, Download, Upload, RefreshCw, MoreHorizontal, Columns } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
// Import our new hooks
import { useTableSearch } from "../../hooks/table/useTableSearch";
// Import types from the shared types directory
import { DataTableToolbarMobileProps } from "../../types/table.types";

export function DataTableToolbarMobile<TData>({
  table,
  searchColumn,
  searchableColumns = [],
  onAddClick,
  onRefreshClick,
  onExportClick,
  onImportClick,
  filterableColumns = [],
  className,
  summaryColumns = [],
}: DataTableToolbarMobileProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  
  // Use the shared search hook with debouncing
  const {
    selectedSearchColumn,
    setSelectedSearchColumn,
    searchValue,
    handleSearch,
    clearSearch
  } = useTableSearch(table, searchColumn, searchableColumns, 300);

  return (
    <Card className={cn("p-0", className)}>
      <CardContent className="py-3 px-4">
        {/* Search input with column selection */}
        {(searchColumn || searchableColumns.length > 0) && (
          <div className="mb-3 space-y-2">
            {searchableColumns.length > 1 && (
              <Select
                value={selectedSearchColumn}
                onValueChange={setSelectedSearchColumn}
              >
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Select column to search" />
                </SelectTrigger>
                <SelectContent>
                  {searchableColumns.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search${selectedSearchColumn ? '...' : ''}`}
                value={searchValue}
                onChange={(event) => handleSearch(event.target.value)}
                className="w-full pl-8 h-9 focus-visible:ring-1"
              />
              {searchValue && (
                <Button
                  variant="ghost"
                  onClick={clearSearch}
                  className="absolute right-1 top-1.5 h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Action buttons row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Add button */}
            {onAddClick && (
              <Button 
                onClick={onAddClick}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            )}
            
            {/* Reset filters button */}
            {isFiltered && (
              <Button
                variant="ghost"
                onClick={() => table.resetColumnFilters()}
                className="h-9 p-0"
                aria-label="Reset filters"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Filter dropdown */}
            {filterableColumns.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                    {isFiltered && (
                      <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                        {table.getState().columnFilters.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {filterableColumns.map((column) => (
                    <DropdownMenuSub key={column.id}>
                      <DropdownMenuSubTrigger>
                        <span>{column.title}</span>
                        {table.getColumn(column.id)?.getFilterValue() && (
                          <Check className="ml-auto h-4 w-4" />
                        )}
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {column.options.map((option) => {
                            const isSelected = 
                              (table.getColumn(column.id)?.getFilterValue() as string[])?.includes(
                                option.value
                              );
                            
                            return (
                              <DropdownMenuCheckboxItem
                                key={option.value}
                                checked={isSelected}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    table.getColumn(column.id)?.setFilterValue(
                                      [
                                        ...(table.getColumn(column.id)?.getFilterValue() as string[] || []),
                                        option.value,
                                      ]
                                    );
                                  } else {
                                    table.getColumn(column.id)?.setFilterValue(
                                      (table.getColumn(column.id)?.getFilterValue() as string[])?.filter(
                                        (value) => value !== option.value
                                      )
                                    );
                                  }
                                }}
                              >
                                {option.label}
                              </DropdownMenuCheckboxItem>
                            );
                          })}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  ))}
                  {isFiltered && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => table.resetColumnFilters()}
                        className="justify-center text-center text-sm"
                      >
                        Reset filters
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Columns button */}
            {table.getAllColumns().some(col => col.getCanHide()) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline"
                  >
                    <Columns className="h-4 w-4 mr-2" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {table
                    .getAllColumns()
                    .filter(
                      (column) => {
                        // Only show columns that:
                        // 1. Have an accessor (either accessorFn or accessorKey)
                        // 2. Can be hidden
                        // 3. Are not used in the summary view
                        return (typeof column.accessorFn !== "undefined" || column.id) && 
                          column.getCanHide() &&
                          (!summaryColumns || !summaryColumns.includes(column.id));
                      }
                    )
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) => column.toggleVisibility(!!value)}
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* More actions dropdown for mobile */}
            {(onRefreshClick || onExportClick || onImportClick) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-9 w-9"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  <DropdownMenuLabel>Table actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {onRefreshClick && (
                      <DropdownMenuItem onClick={onRefreshClick}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        <span>Refresh</span>
                      </DropdownMenuItem>
                    )}
                    {onExportClick && (
                      <DropdownMenuItem onClick={onExportClick}>
                        <Download className="mr-2 h-4 w-4" />
                        <span>Export</span>
                      </DropdownMenuItem>
                    )}
                    {onImportClick && (
                      <DropdownMenuItem onClick={onImportClick}>
                        <Upload className="mr-2 h-4 w-4" />
                        <span>Import</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 