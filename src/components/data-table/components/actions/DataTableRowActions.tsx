import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode } from "react";

export interface ActionItem<TData> {
  label: string;
  onClick: (row: TData) => void;
  icon?: ReactNode;
  disabled?: boolean | ((row: TData) => boolean);
}

export interface ActionGroup<TData> {
  groupLabel?: string;
  items: ActionItem<TData>[];
}

export interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  actions: (ActionItem<TData> | ActionGroup<TData>)[];
  dropdownLabel?: string;
}

export function DataTableRowActions<TData>({
  row,
  actions,
  dropdownLabel = "Actions",
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 data-[state=open]:bg-muted"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[160px]"
        sideOffset={8}
        alignOffset={-4}
        onClick={(e) => e.stopPropagation()}
      >
        {dropdownLabel && <DropdownMenuLabel>{dropdownLabel}</DropdownMenuLabel>}
        
        {actions.map((actionOrGroup, index) => {
          // Check if it's a group or a single action
          if ('items' in actionOrGroup) {
            const group = actionOrGroup as ActionGroup<TData>;
            return (
              <div key={index}>
                {index > 0 && <DropdownMenuSeparator />}
                {group.groupLabel && <DropdownMenuLabel>{group.groupLabel}</DropdownMenuLabel>}
                {group.items.map((action, actionIndex) => {
                  const isDisabled = typeof action.disabled === 'function' 
                    ? action.disabled(row.original) 
                    : action.disabled;
                    
                  return (
                    <DropdownMenuItem
                      key={`${index}-${actionIndex}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        action.onClick(row.original);
                      }}
                      disabled={isDisabled}
                    >
                      {action.icon && <span className="mr-2">{action.icon}</span>}
                      {action.label}
                    </DropdownMenuItem>
                  );
                })}
              </div>
            );
          } else {
            const action = actionOrGroup as ActionItem<TData>;
            const isDisabled = typeof action.disabled === 'function' 
              ? action.disabled(row.original) 
              : action.disabled;
              
            return (
              <DropdownMenuItem
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  action.onClick(row.original);
                }}
                disabled={isDisabled}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </DropdownMenuItem>
            );
          }
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 