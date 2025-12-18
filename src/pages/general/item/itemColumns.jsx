import { createSortableHeader } from "@/components/ui/data-table";

export const getItemColumns = () => [
    {
        accessorKey: "itemCode",
        header: createSortableHeader("Mã hàng hóa"),
        cell: ({ getValue }) => <span className="font-medium text-blue-600">{getValue() || ""}</span>
    },
    {
        accessorKey: "itemName",
        header: createSortableHeader("Tên hàng hóa"),
        cell: ({ getValue }) => <span className="font-medium">{getValue() || ""}</span>
    },
    {
        accessorKey: "itemType",
        header: createSortableHeader("Loại hàng hóa")
    },
    {
        accessorKey: "uom",
        header: createSortableHeader("Đơn vị tính")
    },
    {
        accessorKey: "technicalSpecifications",
        header: createSortableHeader("Thông số kỹ thuật"),
        cell: ({ getValue }) => (
            <span className="truncate max-w-[200px] block" title={getValue()}>
                {getValue() || "-"}
            </span>
        )
    },
    {
        accessorKey: "importPrice",
        header: createSortableHeader("Giá nhập"),
        cell: ({ getValue }) => {
            const value = getValue();
            return value ? (
                <span className="font-medium text-green-600">{value.toLocaleString()} đ</span>
            ) : (
                <span className="text-gray-400">-</span>
            );
        },
    },
    {
        accessorKey: "exportPrice",
        header: createSortableHeader("Giá xuất"),
        cell: ({ getValue }) => {
            const value = getValue();
            return value ? (
                <span className="font-medium text-orange-600">{value.toLocaleString()} đ</span>
            ) : (
                <span className="text-gray-400">-</span>
            );
        },
    },
    {
        accessorKey: "description",
        header: createSortableHeader("Mô tả"),
        cell: ({ getValue }) => {
            const desc = getValue();
            return desc ? (
                <span className="truncate max-w-[200px] block" title={desc}>
                    {desc}
                </span>
            ) : (
                <span className="text-gray-400">-</span>
            );
        }
    },
    {
        accessorKey: "isSellable",
        header: createSortableHeader("Hàng bán"),
        cell: ({ getValue }) => getValue() ? (
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                Có
            </span>
        ) : (
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                Không
            </span>
        ),
    },
];
