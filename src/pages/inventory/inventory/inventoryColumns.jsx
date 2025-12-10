import React from "react";
import { createSortableHeader } from "@/components/ui/data-table";

export const getInventoryColumns = () => [
  {
    accessorKey: "warehouseCode",
    header: createSortableHeader("Mã kho"),
    cell: ({ getValue }) => <span className="font-medium text-blue-600">{getValue() || ""}</span>
  },
  {
    accessorKey: "warehouseName",
    header: createSortableHeader("Tên kho"),
    cell: ({ getValue }) => <span className="font-medium">{getValue() || ""}</span>
  },
  {
    accessorKey: "itemCode",
    header: createSortableHeader("Mã hàng hóa"),
    cell: ({ getValue }) => <span className="font-medium">{getValue() || ""}</span>
  },
  {
    accessorKey: "itemName",
    header: createSortableHeader("Tên hàng hóa"),
    cell: ({ getValue }) => <span>{getValue() || ""}</span>
  },
  {
    accessorKey: "quantity",
    header: createSortableHeader("Số lượng"),
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <span className="font-semibold text-blue-600">
          {value ? Number(value).toLocaleString() : "0"}
        </span>
      );
    },
  },
  {
    accessorKey: "onDemandQuantity",
    header: createSortableHeader("Cần dùng"),
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <span className="font-semibold text-orange-600">
          {value ? Number(value).toLocaleString() : "0"}
        </span>
      );
    },
  },
];
