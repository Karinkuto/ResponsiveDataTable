import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Search, Filter, Columns, Plus, Check, Download, Upload, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchColumn?: string;
  searchableColumns?: {
    id: string;
    title: string;
  }[];
  onAddClick?: () => void;
  onRefreshClick?: () => void;
  onExportClick?: () => void;
  onImportClick?: () => void;
  filterableColumns?: {
    id: string;
    title: string;
    options: {
      label: string;
      value: string;
    }[];
  }[];
  className?: string;
  summaryColumns?: string[];
}

export function DataTableToolbar<TData>({
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
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [selectedSearchColumn, setSelectedSearchColumn] = useState<string | undefined>(
    searchColumn || (searchableColumns.length > 0 ? searchableColumns[0].id : undefined)
  );

  // Function to handle search across multiple columns
  const handleSearch = (value: string) => {
    if (selectedSearchColumn) {
      table.getColumn(selectedSearchColumn)?.setFilterValue(value);
    }
  };

  // Get current search value
  const currentSearchValue = selectedSearchColumn
    ? (table.getColumn(selectedSearchColumn)?.getFilterValue() as string) ?? ""
    : "";

  // Clear search function
  const clearSearch = () => {
    if (selectedSearchColumn) {
      table.getColumn(selectedSearchColumn)?.setFilterValue("");
    }
  };

  return (
    <Card className={cn("p-0", className)}>
      <CardContent className="py-3 px-4">
        <div className="flex flex-row items-center justify-between gap-2">
          <div className="flex flex-1 items-center space-x-2">
            {/* Enhanced search with column selection */}
            {(searchColumn || searchableColumns.length > 0) && (
              <div className="flex items-center gap-2">
                {searchableColumns.length > 1 && (
                  <Select
                    value={selectedSearchColumn}
                    onValueChange={setSelectedSearchColumn}
                  >
                    <SelectTrigger className="w-[130px] h-9">
                      <SelectValue placeholder="Select column" />
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
                
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={`Search${selectedSearchColumn ? '...' : ''}`}
                    value={currentSearchValue}
                    onChange={(event) => handleSearch(event.target.value)}
                    className="w-full pl-8 h-9 focus-visible:ring-1"
                  />
                  {currentSearchValue && (
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

            {/* Filter dropdown with improved styling */}
            {filterableColumns.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 gap-1 border-border/40 hover:bg-muted/50"
                  >
                    <Filter className="h-4 w-4" />
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

            {/* Reset filters button */}
            {isFiltered && (
              <Button
                variant="ghost"
                onClick={() => table.resetColumnFilters()}
                className="h-9 px-2 lg:px-3 text-muted-foreground hover:text-foreground"
              >
                Reset
                <X className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Refresh button */}
            {onRefreshClick && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-9 w-9 border-border/40"
                      onClick={onRefreshClick}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Export button */}
            {onExportClick && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-9 w-9 border-border/40"
                      onClick={onExportClick}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Import button */}
            {onImportClick && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-9 w-9 border-border/40"
                      onClick={onImportClick}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Import data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Column visibility dropdown */}
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 gap-1 border-border/40"
                      >
                  <Columns className="h-4 w-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle columns</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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

            {/* Add button */}
            {onAddClick && (
              <Button 
                size="sm" 
                className="h-9 gap-1 px-3" 
                onClick={onAddClick}
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 