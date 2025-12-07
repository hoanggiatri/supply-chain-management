import { createSortableHeader } from "@/components/ui/data-table";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";

export const getLineColumns = (onView, onEdit) => [
  {
    accessorKey: "lineCode",
    header: createSortableHeader("Mã dây chuyền"),
    cell: ({ getValue }) => {
      const code = getValue();
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          {code}
        </span>
      );
    },
  },
  {
    accessorKey: "lineName",
    header: createSortableHeader("Tên dây chuyền"),
  },
  {
    accessorKey: "plantName",
    header: createSortableHeader("Tên xưởng"),
    cell: ({ getValue, row }) => {
      const plantName = getValue();
      return (
        <span className="text-blue-600 hover:underline cursor-pointer">
          {plantName || "---"}
        </span>
      );
    },
  },
  {
    accessorKey: "capacity",
    header: createSortableHeader("Công suất"),
    cell: ({ getValue }) => {
      const capacity = getValue();
      return capacity ? `${capacity}/h` : "---";
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ getValue }) => {
      const status = getValue();
      const statusConfig = {
        active: {
          label: "Hoạt động",
          className: "bg-green-100 text-green-700 border-green-200",
        },
        maintenance: {
          label: "Bảo trì",
          className: "bg-amber-100 text-amber-700 border-amber-200",
        },
        inactive: {
          label: "Ngừng hoạt động",
          className: "bg-red-100 text-red-700 border-red-200",
        },
      };
      const config = statusConfig[status] || statusConfig.active;
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${config.className}`}
        >
          {config.label}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView?.(row.original);
          }}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          title="Xem chi tiết nhanh"
        >
          <EyeIcon className="h-5 w-5 text-blue-600" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(row.original);
          }}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          title="Chỉnh sửa"
        >
          <PencilIcon className="h-5 w-5 text-green-600" />
        </button>
      </div>
    ),
  },
];
