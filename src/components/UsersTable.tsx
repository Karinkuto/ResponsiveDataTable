"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { fetchTableData } from "@/data/sample-table-data";
import { DataTable, ActionItem, ActionGroup } from "@/components/data-table";
import { toast } from "sonner";
import { Copy, Eye, Pencil, UserPlus } from "lucide-react";

export type TableItem = {
  id: string;
  name: string;
  email: string;
  location: string;
  flag: string;
  status: "Active" | "Inactive" | "Pending";
  balance: number;
  department: string;
  role: string;
  joinDate: string;
  performance: string;
};

// Default actions that will be available for all tables
const getDefaultActions = <TData extends { id: string }>(
  onView?: (data: TData) => void,
  onEdit?: (data: TData) => void,
  onCopy?: (data: TData) => void,
): (ActionItem<TData> | ActionGroup<TData>)[] => {
  return [
    {
      label: "View details",
      onClick: (row: TData) => {
        if (onView) {
          onView(row);
        } else {
          toast.info(`Viewing details for ${row.id}`);
        }
      },
      icon: <Eye className="h-4 w-4" />,
    },
    {
      groupLabel: "Actions",
      items: [
        {
          label: "Edit",
          onClick: (row: TData) => {
            if (onEdit) {
              onEdit(row);
            } else {
              toast.info(`Editing ${row.id}`);
            }
          },
          icon: <Pencil className="h-4 w-4" />,
        },
        {
          label: "Copy ID",
          onClick: (row: TData) => {
            if (onCopy) {
              onCopy(row);
            } else {
              navigator.clipboard.writeText(row.id);
              toast.success("ID copied to clipboard");
            }
          },
          icon: <Copy className="h-4 w-4" />,
        },
      ],
    },
  ];
};

const columns: ColumnDef<TableItem>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    size: 180,
  },
  {
    header: "Email",
    accessorKey: "email",
    size: 200,
  },
  {
    header: "Location",
    accessorKey: "location",
    cell: ({ row }) => (
      <div>
        <span className="text-lg leading-none">{row.original.flag}</span> {row.getValue("location")}
      </div>
    ),
    size: 180,
  },
  {
    header: "Department",
    accessorKey: "department",
    size: 150,
    filterFn: "arrIncludesSome",
  },
  {
    header: "Role",
    accessorKey: "role",
    size: 180,
  },
  {
    header: "Join Date",
    accessorKey: "joinDate",
    cell: ({ row }) => {
      const date = new Date(row.getValue("joinDate"));
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    },
    size: 120,
  },
  {
    header: "Performance",
    accessorKey: "performance",
    cell: ({ row }) => (
      <Badge
        className={cn(
          row.getValue("performance") === "Excellent" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
          row.getValue("performance") === "Good" && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
          row.getValue("performance") === "Average" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
          row.getValue("performance") === "Poor" && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
        )}
      >
        {row.getValue("performance")}
      </Badge>
    ),
    size: 120,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => (
      <Badge
        className={cn(
          row.getValue("status") === "Inactive" && "bg-muted-foreground/60 text-primary-foreground dark:bg-muted-foreground/40",
          row.getValue("status") === "Active" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
          row.getValue("status") === "Pending" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
        )}
      >
        {row.getValue("status")}
      </Badge>
    ),
    size: 120,
    filterFn: "arrIncludesSome",
  },
  {
    header: "Balance",
    accessorKey: "balance",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("balance"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
    size: 120,
  },
];

export default function UsersTable() {
  const [data, setData] = useState<TableItem[]>([]);
  const [columnVisibility] = useState<VisibilityState>({
    balance: false,
  });

  useEffect(() => {
    fetchTableData().then(setData);
  }, []);

  // Example of custom action handlers
  const handleView = (user: TableItem) => {
    toast.info(`Viewing details for ${user.name}`, {
      description: `Email: ${user.email}\nDepartment: ${user.department}\nRole: ${user.role}`,
    });
  };

  const handleEdit = (user: TableItem) => {
    toast.info(`Editing ${user.name}`, {
      description: "Opening edit form...",
    });
  };

  // Get default actions with custom handlers
  const actions = getDefaultActions<TableItem>(
    handleView,
    handleEdit,
  );

  // Example of adding custom actions
  const customActions: ActionGroup<TableItem> = {
    groupLabel: "Custom Actions",
    items: [
      {
        label: "Send Message",
        onClick: (user: TableItem) => {
          toast.info(`Sending message to ${user.name}`, {
            description: `Opening message composer for ${user.email}`,
          });
        },
        // Disable for inactive users
        disabled: (user: TableItem) => user.status === "Inactive",
      },
    ],
  };

  // Handle add new user
  const handleAddUser = () => {
    toast.success("Add new user", {
      description: "Opening new user form...",
      icon: <UserPlus className="h-4 w-4" />,
    });
  };

  // Define filterable columns
  const filterableColumns = [
    {
      id: "status",
      title: "Status",
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
        { label: "Pending", value: "Pending" },
      ],
    },
    {
      id: "department",
      title: "Department",
      options: [
        { label: "Engineering", value: "Engineering" },
        { label: "Marketing", value: "Marketing" },
        { label: "Sales", value: "Sales" },
        { label: "Product", value: "Product" },
        { label: "Finance", value: "Finance" },
      ],
    },
  ];

  return (
    <div className="w-full">
      <DataTable
        data={data}
        columns={columns}
        initialSorting={[{ id: "name", desc: false }]}
        initialPageSize={5}
        rowActions={[...actions, customActions]}
        searchColumn="name"
        onAddClick={handleAddUser}
        filterableColumns={filterableColumns}
        initialColumnVisibility={columnVisibility}
      />
    </div>
  );
} 