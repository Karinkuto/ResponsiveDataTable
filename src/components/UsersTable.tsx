"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { TableItem, fetchTableData } from "@/data/sample-table-data";
import { DataTable } from "./data-table/DataTable";

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

const columns: ColumnDef<TableItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 28,
    enableSorting: false,
  },
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
          row.getValue("performance") === "Excellent" && "bg-green-100 text-green-800",
          row.getValue("performance") === "Good" && "bg-blue-100 text-blue-800",
          row.getValue("performance") === "Average" && "bg-yellow-100 text-yellow-800",
          row.getValue("performance") === "Poor" && "bg-red-100 text-red-800"
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
          row.getValue("status") === "Inactive" && "bg-muted-foreground/60 text-primary-foreground",
        )}
      >
        {row.getValue("status")}
      </Badge>
    ),
    size: 120,
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

  useEffect(() => {
    fetchTableData().then(setData);
  }, []);

  return (
    <div >
      <DataTable
        data={data}
        columns={columns}
        initialSorting={[{ id: "name", desc: false }]}
        initialPageSize={5}
      />
    </div>
  );
} 