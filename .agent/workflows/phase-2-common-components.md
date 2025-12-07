---
description: Phase 2 - Migrate Common Components (Week 3-4)
---

# Phase 2: Migrate Common Components

## Mục tiêu

Migrate các components dùng chung từ Material Tailwind sang Shadcn/UI.

---

## Step 1: DataTable → TanStack Table

### 1.1 Install TanStack Table

```bash
npm install @tanstack/react-table
npx shadcn-ui@latest add table
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dropdown-menu
```

### 1.2 Create new DataTable component

**File: `src/components/ui/data-table.jsx`**

```javascript
import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export function DataTable({ columns, data, searchKey = "name" }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      <Input
        placeholder={`Tìm kiếm...`}
        value={table.getColumn(searchKey)?.getFilterValue() ?? ""}
        onChange={(event) =>
          table.getColumn(searchKey)?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Hiển thị{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{" "}
          -{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          trong tổng số {table.getFilteredRowModel().rows.length} kết quả
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 1.3 Create column helpers

**File: `src/lib/table-helpers.jsx`**

```javascript
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Sortable column header
export const createSortableHeader =
  (label) =>
  ({ column }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {label}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    );
  };

// Status badge cell
export const createStatusCell =
  (statusColors) =>
  ({ row }) => {
    const status = row.getValue("status");
    const color = statusColors[status] || "default";
    return <Badge variant={color}>{status}</Badge>;
  };

// Action cell with dropdown
export const createActionCell =
  (actions) =>
  ({ row }) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions.map((action) => (
            <DropdownMenuItem
              key={action.label}
              onClick={() => action.onClick(row.original)}
            >
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
```

### 1.4 Migrate ItemInCompany to use new DataTable

**Example usage:**

```javascript
import { DataTable } from "@/components/ui/data-table";
import { createSortableHeader, createStatusCell } from "@/lib/table-helpers";

const columns = [
  {
    accessorKey: "itemCode",
    header: createSortableHeader("Mã hàng hóa"),
  },
  {
    accessorKey: "itemName",
    header: createSortableHeader("Tên hàng hóa"),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: createStatusCell({
      "Đang hoạt động": "success",
      "Ngừng hoạt động": "destructive",
    }),
  },
];

// In component
<DataTable columns={columns} data={items} searchKey="itemName" />;
```

---

## Step 2: StatusSummaryCard → Shadcn Card + Badge

### 2.1 Install components

```bash
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
```

### 2.2 Create StatusSummaryCard

**File: `src/components/ui/status-summary-card.jsx`**

```javascript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function StatusSummaryCard({ title, stats }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
              <Badge variant={stat.variant || "default"} className="ml-2">
                {stat.value}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## Step 3: SelectAutocomplete → Shadcn Command

### 3.1 Install Command component

```bash
npx shadcn-ui@latest add command
npx shadcn-ui@latest add popover
```

### 3.2 Create Combobox component

**File: `src/components/ui/combobox.jsx`**

```javascript
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Tìm kiếm..." />
          <CommandEmpty>Không tìm thấy kết quả</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
```

---

## Step 4: ConfirmDialog → Shadcn AlertDialog

### 4.1 Install AlertDialog

```bash
npx shadcn-ui@latest add alert-dialog
```

### 4.2 Create ConfirmDialog

**File: `src/components/ui/confirm-dialog.jsx`**

```javascript
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Xác nhận</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

---

## Step 5: LoadingPaper → Shadcn Skeleton

### 5.1 Install Skeleton

```bash
npx shadcn-ui@latest add skeleton
```

### 5.2 Create loading components

**File: `src/components/ui/loading-skeleton.jsx`**

```javascript
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-12 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-[200px]" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  );
}
```

---

## Checklist

- [ ] DataTable migrated to TanStack Table
- [ ] StatusSummaryCard using Shadcn Card + Badge
- [ ] SelectAutocomplete replaced with Combobox
- [ ] ConfirmDialog using AlertDialog
- [ ] LoadingPaper replaced with Skeleton
- [ ] All old components removed
- [ ] All pages using new components
- [ ] Styling consistent with design system

---

## Testing

1. Test DataTable sorting, filtering, pagination
2. Test StatusSummaryCard display
3. Test Combobox search and selection
4. Test ConfirmDialog actions
5. Test loading states with Skeleton

---

## Next Phase

👉 **Phase 3: Migrate Product Module**
