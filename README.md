This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

# Data Table Component

A reusable, high-performance data table component built with Next.js, TanStack Table, and ShadcN UI components.

## Features

- 📊 Sortable columns
- 📱 Responsive design
- 🔢 Pagination
- ✅ Row selection
- 🎨 Clean, modern UI using ShadcN components
- 🚀 Optimized performance with virtualization and web workers
- 📦 Minimal bundle size with code splitting and lazy loading

## Performance Optimizations

The DataTable component includes several performance enhancements:

- **Row Virtualization**: For large datasets, only visible rows are rendered, significantly improving performance
- **Web Workers**: Heavy computations (sorting, filtering, searching) are offloaded to a background thread
- **React.memo**: Components are memoized to prevent unnecessary re-renders
- **Optimized State Management**: Batch updates to minimize re-renders
- **Lazy Loading**: Dynamic imports for features only used with large datasets
- **SSR Compatibility**: All optimizations work with server-side rendering

## Installation

1. First, install the required dependencies:

```bash
# Install ShadcN UI components
pnpm dlx shadcn@latest add table
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add checkbox
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add label
pnpm dlx shadcn@latest add pagination

# Install TanStack Table and virtualization
pnpm add @tanstack/react-table @tanstack/react-virtual
```

2. Copy the `data-table` folder to your components directory:
```
src/
  components/
    data-table/
      hooks/
        table/
        ui/
      utils/
        virtualizer.ts
        tableWorker.ts
      components/
        virtualized/
      DataTable.tsx
```

## Usage

### Basic Usage

```tsx
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";

// Define your data type
interface User {
  id: string;
  name: string;
  email: string;
  status: string;
}

// Define your columns
const columns: ColumnDef<User>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
];

// Use the DataTable component
export default function YourComponent() {
  const data = [/* your data array */];

  return (
    <DataTable
      data={data}
      columns={columns}
      initialSorting={[{ id: "name", desc: false }]}
      initialPageSize={5}
    />
  );
}
```

### With Optimizations Explicitly Enabled

For large datasets, you can explicitly enable virtualization and web workers:

```tsx
export default function YourLargeTableComponent() {
  const largeDataset = [/* thousands of rows */];

  return (
    <DataTable
      data={largeDataset}
      columns={columns}
      enableVirtualization={true} // Force enable virtualization
      enableWorkers={true}        // Force enable web workers 
      estimateRowHeight={() => 48} // Set estimated row height
    />
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Array of data items to display |
| `columns` | `ColumnDef<T>[]` | Column definitions for the table |
| `initialSorting` | `SortingState` | Optional initial sorting state |
| `initialPageSize` | `number` | Optional initial page size (default: 5) |
| `enableRowSelection` | `boolean` | Whether to enable row selection |
| `rowActions` | `(ActionItem<T> \| ActionGroup<T>)[]` | Row actions to display |
| `searchColumn` | `string` | Default column to search |
| `searchableColumns` | `{ id: string, title: string }[]` | Columns that can be searched |
| `filterableColumns` | `{ id: string, title: string, options: { label: string, value: string }[] }[]` | Columns that can be filtered |
| `enableVirtualization` | `boolean` | Whether to enable row virtualization (default: auto-enables for datasets > 50 rows) |
| `enableWorkers` | `boolean` | Whether to use web workers for heavy operations (default: auto-enables for datasets > 100 rows) |
| `estimateRowHeight` | `(index: number) => number` | Function to estimate row height for virtualization |
| `overscan` | `number` | Number of rows to render outside viewport (default: 10) |

## Development

```bash
# Start the development server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start
```

## Learn More

- [TanStack Table Documentation](https://tanstack.com/table/latest)
- [TanStack Virtual Documentation](https://tanstack.com/virtual/latest)
- [ShadcN UI Documentation](https://ui.shadcn.com)
- [Next.js Documentation](https://nextjs.org/docs)
