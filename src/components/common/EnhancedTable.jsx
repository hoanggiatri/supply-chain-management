import React, { useState, useMemo } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Input,
  Checkbox,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { SkeletonTable } from "@/components/common/LoadingSkeleton";
import EmptyState from "@/components/common/EmptyState";

/**
 * Enhanced Table Component
 * Features: Sorting, Filtering, Pagination, Selection, Loading State
 */
const EnhancedTable = ({
  columns,
  data,
  loading = false,
  title,
  subtitle,
  actions,
  onRowClick,
  selectable = false,
  selected = [],
  onSelectionChange,
  emptyMessage = "Không có dữ liệu",
  searchPlaceholder = "Tìm kiếm...",
}) => {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter data
  const filteredData = useMemo(() => {
    if (!search) return data;
    const lowercased = search.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(lowercased)
      )
    );
  }, [data, search]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = sortedData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = () => {
    if (selected.length === filteredData.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange([...filteredData]);
    }
  };

  const handleSelectRow = (row) => {
    const isSelected = selected.some((item) => item.id === row.id); // Assuming row has 'id'
    if (isSelected) {
      onSelectionChange(selected.filter((item) => item.id !== row.id));
    } else {
      onSelectionChange([...selected, row]);
    }
  };

  return (
    <Card className="h-full w-full shadow-sm border border-blue-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-blue-gray-50 flex flex-col md:flex-row justify-between gap-4 items-center bg-white rounded-t-xl">
        <div>
          {title && (
            <Typography variant="h5" color="blue-gray" className="font-bold">
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="small" color="gray" className="font-normal mt-1">
              {subtitle}
            </Typography>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="w-full md:w-72">
            <Input
              label="Tìm kiếm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              color="blue"
              className="!border-blue-gray-200 focus:!border-blue-500"
            />
          </div>
          {actions}
        </div>
      </div>

      {/* Content */}
      <CardBody className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-4">
            <SkeletonTable rows={10} columns={columns.length + (selectable ? 1 : 0)} />
          </div>
        ) : filteredData.length === 0 ? (
          <EmptyState
            type={search ? "search" : "noData"}
            title={search ? "Không tìm thấy kết quả" : "Chưa có dữ liệu"}
            description={
              search
                ? `Không tìm thấy kết quả nào khớp với "${search}"`
                : emptyMessage
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {selectable && (
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 w-16">
                      <Checkbox
                        checked={selected.length === filteredData.length && filteredData.length > 0}
                        onChange={handleSelectAll}
                        color="blue"
                        containerProps={{ className: "p-0" }}
                      />
                    </th>
                  )}
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors ${
                        col.sortable !== false ? "cursor-pointer hover:bg-blue-gray-50" : ""
                      }`}
                      onClick={() => col.sortable !== false && handleSort(col.key)}
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="flex items-center justify-between gap-2 font-semibold leading-none opacity-70"
                      >
                        {col.label}
                        {col.sortable !== false && sortConfig.key === col.key && (
                          <ChevronUpDownIcon
                            strokeWidth={2}
                            className={`h-4 w-4 transition-transform ${
                              sortConfig.direction === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => {
                  const isLast = index === paginatedData.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";
                  const isSelected = selectable && selected.some((item) => item.id === row.id);

                  return (
                    <tr
                      key={index}
                      className={`hover:bg-blue-gray-50/50 transition-colors ${
                        isSelected ? "bg-blue-50/30" : ""
                      } ${onRowClick ? "cursor-pointer" : ""}`}
                      onClick={() => onRowClick && onRowClick(row)}
                    >
                      {selectable && (
                        <td className={classes}>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelectRow(row)}
                            onClick={(e) => e.stopPropagation()}
                            color="blue"
                            containerProps={{ className: "p-0" }}
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={col.key} className={classes}>
                          {col.render ? (
                            col.render(row)
                          ) : (
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {row[col.key]}
                            </Typography>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>

      {/* Pagination */}
      {!loading && filteredData.length > 0 && (
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Trang {page} / {totalPages} • Tổng {filteredData.length} kết quả
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="sm"
              color="blue-gray"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Trước
            </Button>
            <Button
              variant="outlined"
              size="sm"
              color="blue-gray"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              Sau
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default EnhancedTable;
