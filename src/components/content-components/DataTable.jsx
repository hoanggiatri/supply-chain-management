import React from "react";
import {
  Typography,
  Input,
  Button,
  Select,
  Option,
  Chip,
  Card,
  CardBody,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { InboxIcon } from "@heroicons/react/24/solid";

const DataTable = ({
  rows,
  columns,
  order,
  orderBy,
  onRequestSort,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  search,
  setSearch,
  renderRow,
  height, // Optional: custom height (e.g., "500px", "calc(100vh - 200px)")
  emptyMessage = "Không có dữ liệu",
  loading = false, // Loading state
  statusColumn = "status", // Column ID for status (will render as Chip)
  statusColors = {}, // Optional: custom colors for status values
}) => {
  // Default height if not provided
  const tableHeight = height || "calc(100vh - 350px)";

  const handleSort = (property) => () => {
    onRequestSort(property);
  };

  const stableSort = (array, comparator) => {
    const safeArray = Array.isArray(array) ? array : [];
    const stabilized = safeArray.map((el, index) => [el, index]);
    stabilized.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilized.map((el) => el[0]);
  };

  const getComparator = (order, orderBy) =>
    order === "desc"
      ? (a, b) =>
          b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0
      : (a, b) =>
          a[orderBy] < b[orderBy] ? -1 : a[orderBy] > b[orderBy] ? 1 : 0;

  const filterRows = (rows, search) => {
    if (!Array.isArray(rows)) return [];
    if (!search) return rows;
    const lowercasedSearch = search.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(lowercasedSearch)
      )
    );
  };

  const normalizedRows = Array.isArray(rows) ? rows : [];
  const normalizedColumns = Array.isArray(columns) ? columns : [];

  const filteredRows = filterRows(normalizedRows, search);
  const sortedRows = stableSort(filteredRows, getComparator(order, orderBy));
  const paginatedRows = sortedRows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const filteredTotalPages = Math.ceil(filteredRows.length / rowsPerPage);

  const getRowKey = (row, index) => {
    if (row && (row.id || row._id || row.uuid || row.key))
      return row.id || row._id || row.uuid || row.key;
    return `${page}-${index}`;
  };

  // Get status chip color
  const getStatusColor = (statusValue) => {
    if (statusColors[statusValue]) {
      return statusColors[statusValue];
    }
    // Default colors based on common status values
    const statusLower = String(statusValue).toLowerCase();
    if (
      statusLower.includes("hoàn thành") ||
      statusLower.includes("completed") ||
      statusLower.includes("đã") ||
      statusLower.includes("success")
    ) {
      return "green";
    }
    if (
      statusLower.includes("đang") ||
      statusLower.includes("processing") ||
      statusLower.includes("in progress")
    ) {
      return "blue";
    }
    if (
      statusLower.includes("chờ") ||
      statusLower.includes("pending") ||
      statusLower.includes("waiting")
    ) {
      return "amber";
    }
    if (
      statusLower.includes("hủy") ||
      statusLower.includes("cancel") ||
      statusLower.includes("failed")
    ) {
      return "red";
    }
    return "gray";
  };

  // Render cell content - check if it's status column and render as Chip
  const renderCellContent = (row, column) => {
    const value = row[column.id];

    // If this is the status column, render as Chip
    if (column.id === statusColumn && value) {
      const chipColor = getStatusColor(value);
      return (
        <Chip
          value={value}
          color={chipColor}
          size="sm"
          className="font-medium"
        />
      );
    }

    return value;
  };

  // Helper function to render status cell as Chip (for use in renderRow)
  const renderStatusCell = (statusValue) => {
    if (!statusValue) return null;
    const chipColor = getStatusColor(statusValue);
    return (
      <Chip
        value={statusValue}
        color={chipColor}
        size="sm"
        className="font-medium"
      />
    );
  };

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <tbody>
      {[...new Array(rowsPerPage)].map((_, index) => (
        <tr key={`skeleton-${index}`} className="border-b border-blue-gray-100">
          {normalizedColumns.map((column) => (
            <td key={column.id} className="p-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  // Empty state component
  const EmptyState = () => (
    <tbody>
      <tr>
        <td colSpan={normalizedColumns.length} className="p-8">
          <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500">
            <InboxIcon className="h-20 w-20 mb-4 opacity-30" />
            <Typography variant="h6" color="gray" className="mb-2">
              {emptyMessage}
            </Typography>
            {search && (
              <Typography variant="small" color="gray">
                Không tìm thấy kết quả cho "{search}"
              </Typography>
            )}
          </div>
        </td>
      </tr>
    </tbody>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Search and Filter Controls */}
      <div className="flex justify-between items-center mb-4 gap-4">
        <div className="w-32">
          <Select
            value={String(rowsPerPage)}
            onChange={(val) =>
              onRowsPerPageChange({ target: { value: Number(val) } })
            }
            label="Số hàng"
            className="!min-w-[120px]"
          >
            <Option value="10">10</Option>
            <Option value="20">20</Option>
            <Option value="30">30</Option>
            <Option value="50">50</Option>
          </Select>
        </div>

        <div className="w-64">
          <Input
            label="Tìm kiếm"
            value={search}
            placeholder="Nhập từ khóa tìm kiếm"
            onChange={(e) => setSearch(e.target.value)}
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            className="!min-w-[250px]"
          />
        </div>
      </div>

      {/* Table Container with Fixed Height & Sticky Header */}
      <Card className="shadow-md border border-blue-gray-100">
        <CardBody className="p-0">
          <div
            className="overflow-auto rounded-lg"
            style={{
              height: tableHeight,
              maxHeight: tableHeight,
            }}
          >
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr className="sticky top-0 z-10 bg-white border-b-2 border-blue-gray-100">
                  {normalizedColumns.map((column) => (
                    <th
                      key={column.id}
                      className="bg-white p-4 border-b border-blue-gray-100 cursor-pointer hover:bg-blue-gray-50 transition-colors"
                      onClick={handleSort(column.id)}
                    >
                      <div className="flex items-center gap-2">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold leading-none"
                        >
                          {column.label}
                        </Typography>
                        {orderBy === column.id && (
                          <span className="text-blue-gray-400">
                            {order === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              {loading ? (
                <LoadingSkeleton />
              ) : paginatedRows.length === 0 ? (
                <EmptyState />
              ) : (
                <tbody>
                  {paginatedRows.map((row, index) => {
                    if (renderRow) {
                      // Pass renderStatusCell helper to renderRow function
                      const element = renderRow(
                        row,
                        index,
                        page,
                        rowsPerPage,
                        renderStatusCell
                      );
                      // If renderRow returns a React element, clone it with key
                      if (React.isValidElement(element)) {
                        return React.cloneElement(element, {
                          key: getRowKey(row, index),
                        });
                      }
                      // If it's already a valid JSX element, return as is
                      return element;
                    }
                    return (
                      <tr
                        key={getRowKey(row, index)}
                        className="border-b border-blue-gray-100 hover:bg-blue-gray-50 transition-colors cursor-pointer"
                      >
                        {normalizedColumns.map((column) => (
                          <td key={column.id} className="p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {renderCellContent(row, column)}
                            </Typography>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              )}
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Pagination */}
      {!loading && paginatedRows.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <Typography variant="small" color="gray" className="font-normal">
            Hiển thị {(page - 1) * rowsPerPage + 1} -{" "}
            {Math.min(page * rowsPerPage, filteredRows.length)} trong tổng số{" "}
            {filteredRows.length} kết quả
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => onPageChange(null, 1)}
              disabled={page === 1}
            >
              Đầu
            </Button>
            <Button
              variant="outlined"
              size="sm"
              onClick={() => onPageChange(null, page - 1)}
              disabled={page === 1}
            >
              Trước
            </Button>
            <Typography
              variant="small"
              color="gray"
              className="flex items-center px-2"
            >
              Trang {page} / {filteredTotalPages}
            </Typography>
            <Button
              variant="outlined"
              size="sm"
              onClick={() => onPageChange(null, page + 1)}
              disabled={page >= filteredTotalPages}
            >
              Sau
            </Button>
            <Button
              variant="outlined"
              size="sm"
              onClick={() => onPageChange(null, filteredTotalPages)}
              disabled={page >= filteredTotalPages}
            >
              Cuối
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
