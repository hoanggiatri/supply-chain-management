import { useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown, Search, Inbox, Download } from "lucide-react";
import { exportToExcel } from "../../lib/utils";

export function DataTable({
    columns,
    data,
    onRowClick,
    loading = false,
    emptyMessage = "Không có dữ liệu",
    height,
    renderRow,
    defaultSorting = [],
}) {
    const [sorting, setSorting] = useState(defaultSorting);
    const [columnFilters, setColumnFilters] = useState([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        state: { sorting, columnFilters, pagination, globalFilter },
    });

    const renderStatusCell = (statusValue, customColor = null) => {
        if (!statusValue) return null;
        const colorClass = customColor || getStatusColor(statusValue);
        return (
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${colorClass}`}>
                {statusValue}
            </span>
        );
    };

    const getStatusColor = (status) => {
        const statusLower = String(status).toLowerCase();
        if (statusLower.includes("hoàn thành") || statusLower.includes("completed") ||
            statusLower.includes("đã") || statusLower.includes("success") ||
            statusLower.includes("active") || statusLower.includes("đang hoạt động") ||
            statusLower.includes("approved")) {
            return "bg-[#E6F4EA] text-[#1E7E34]"; // Light Green
        }
        if (statusLower.includes("đang") || statusLower.includes("processing") ||
            statusLower.includes("in progress")) {
            return "bg-[#E8F0FE] text-[#1967D2]"; // Light Blue
        }
        if (statusLower.includes("chờ") || statusLower.includes("pending") ||
            statusLower.includes("waiting") || statusLower.includes("expired")) {
            return "bg-[#FEF7E0] text-[#B06000]"; // Light Yellow/Orange
        }
        if (statusLower.includes("hủy") || statusLower.includes("cancel") ||
            statusLower.includes("failed") || statusLower.includes("inactive") ||
            statusLower.includes("ngừng") || statusLower.includes("suspended")) {
            return "bg-[#FCE8E6] text-[#C5221F]"; // Light Red
        }
        return "bg-gray-100 text-gray-700";
    };

    // Generate page numbers
    const pageCount = table.getPageCount();
    const pageIndex = table.getState().pagination.pageIndex;

    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        for (let i = Math.max(2, pageIndex - delta); i <= Math.min(pageCount - 1, pageIndex + delta + 1); i++) {
            range.push(i);
        }

        if (pageIndex - delta > 2) {
            range.unshift("...");
        }
        if (pageIndex + delta + 1 < pageCount - 1) {
            range.push("...");
        }

        range.unshift(1);
        if (pageCount !== 1) {
            range.push(pageCount);
        }

        return range;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
            {/* Header: Search and Export */}
            <div className="p-5 border-b border-gray-100 bg-white flex justify-between items-center gap-4">
                <div className="w-full max-w-md relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        placeholder="Tìm kiếm..."
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50/50 
                     focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 
                     transition-all duration-200 outline-none placeholder:text-gray-400"
                    />
                </div>
                <button
                    onClick={() => exportToExcel(data, "ExportData")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#F0F1FA] rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-100 transition-all"
                >
                    <Download className="h-4 w-4" />
                    Tải về
                </button>
            </div>

            {/* Table Content */}
            <div className="overflow-auto flex-1" style={height ? { height } : {}}>
                <table className="w-full">
                    <thead className="bg-[#F0F1FA] sticky top-0 z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-5 text-left text-[15px] font-semibold text-gray-900 uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div className="flex items-center gap-2">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white">
                        {loading ? (
                            Array.from({ length: table.getState().pagination.pageSize }).map((_, i) => (
                                <tr key={i} className="border-b border-gray-50 last:border-none">
                                    {columns.map((_, j) => (
                                        <td key={j} className="px-6 py-5">
                                            <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, index) => {
                                if (renderRow) {
                                    return renderRow(
                                        row.original,
                                        index,
                                        table.getState().pagination.pageIndex + 1,
                                        table.getState().pagination.pageSize,
                                        renderStatusCell
                                    );
                                }
                                return (
                                    <tr
                                        key={row.id}
                                        onClick={() => onRowClick?.(row.original)}
                                        className="group even:bg-[#F8F9FC] odd:bg-white hover:bg-indigo-50/30 cursor-pointer transition-colors duration-150 border-none"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="px-6 py-4 text-sm font-normal text-gray-900 whitespace-nowrap">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="p-12 text-center">
                                    <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-400">
                                        <div className="bg-gray-50 p-4 rounded-full mb-4">
                                            <Inbox className="h-10 w-10 opacity-50" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">{emptyMessage}</h3>
                                        {globalFilter && (
                                            <p className="text-sm">Không tìm thấy kết quả cho "{globalFilter}"</p>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer: Pagination & Page Size */}
            {!loading && table.getRowModel().rows?.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 bg-white px-6 py-4 gap-4">

                    {/* Left: Page Size & Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                            <span>Hiển thị</span>
                            <select
                                value={table.getState().pagination.pageSize}
                                onChange={(e) => table.setPageSize(Number(e.target.value))}
                                className="bg-transparent font-medium text-gray-900 focus:outline-none cursor-pointer"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                                <option value={50}>50</option>
                            </select>
                            <span>hàng</span>
                        </div>
                        <span className="hidden sm:inline text-gray-300">|</span>
                        <span className="hidden sm:inline">
                            Tổng <b className="text-gray-900">{table.getFilteredRowModel().rows.length}</b> kết quả
                        </span>
                    </div>

                    {/* Right: Numbered Pagination */}
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-gray-600"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        {getPageNumbers().map((page, idx) => (
                            typeof page === "number" ? (
                                <button
                                    key={idx}
                                    onClick={() => table.setPageIndex(page - 1)}
                                    className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${pageIndex + 1 === page
                                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    {page}
                                </button>
                            ) : (
                                <span key={idx} className="px-1 text-gray-400 text-sm">...</span>
                            )
                        ))}

                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-gray-600"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export function createSortableHeader(label) {
    return ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
            <button
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="flex items-center gap-1.5 transition-colors group whitespace-nowrap"
            >
                <span>{label}</span>
                {isSorted === "asc" ? (
                    <ArrowUp className="h-3.5 w-3.5 text-gray-900" />
                ) : isSorted === "desc" ? (
                    <ArrowDown className="h-3.5 w-3.5 text-gray-900" />
                ) : (
                    <ArrowUpDown className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-all" />
                )}
            </button>
        );
    };
}

export function createStatusBadge(statusColors = {}) {
    const getStatusColor = (status) => {
        if (statusColors[status]) return statusColors[status];

        const statusLower = String(status).toLowerCase();
        if (statusLower.includes("hoàn thành") || statusLower.includes("completed") ||
            statusLower.includes("đã") || statusLower.includes("success") ||
            statusLower.includes("active") || statusLower.includes("đang hoạt động") ||
            statusLower.includes("approved")) {
            return "bg-green-100 text-green-700";
        }
        if (statusLower.includes("đang") || statusLower.includes("processing") ||
            statusLower.includes("in progress")) {
            return "bg-blue-100 text-blue-700";
        }
        if (statusLower.includes("chờ") || statusLower.includes("pending") ||
            statusLower.includes("waiting") || statusLower.includes("expired")) {
            return "bg-orange-100 text-orange-800";
        }
        if (statusLower.includes("hủy") || statusLower.includes("cancel") ||
            statusLower.includes("failed") || statusLower.includes("inactive") ||
            statusLower.includes("ngừng") || statusLower.includes("suspended")) {
            return "bg-red-100 text-red-700";
        }
        return "bg-gray-100 text-gray-700";
    };

    return ({ getValue }) => {
        const status = getValue();
        if (!status) return null;
        const colorClass = getStatusColor(status);
        return (
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${colorClass}`}>
                {status}
            </span>
        );
    };
}
