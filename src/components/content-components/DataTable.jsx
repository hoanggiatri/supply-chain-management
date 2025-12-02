import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { InboxIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Input,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import React from "react";

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
  // Optional: custom status renderer function (statusValue, row) => ReactNode
  // If provided, this will override the default Chip rendering
  renderStatus = null,
}) => {
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
      statusLower.includes("success") ||
      statusLower.includes("active") ||
      statusLower.includes("đang hoạt động") ||
      statusLower.includes("đang sử dụng")
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
      statusLower.includes("failed") ||
      statusLower.includes("inactive") ||
      statusLower.includes("ngừng") ||
      statusLower.includes("closed") ||
      statusLower.includes("đã đóng")
    ) {
      return "red";
    }
    return "blue-gray";
  };

  // Render cell content - check if it's status column and render as Chip
  const renderCellContent = (row, column) => {
    const value = row[column.id];

    // If this is the status column, render as Chip or custom renderer
    if (column.id === statusColumn && value) {
      // Use custom renderer if provided
      if (renderStatus && typeof renderStatus === "function") {
        return renderStatus(value, row);
      }
      // Default Chip rendering
      const chipColor = getStatusColor(value);
      return (
        <div className="w-max">
          <Chip
            variant="ghost"
            size="sm"
            value={value}
            color={chipColor}
            className="font-medium"
          />
        </div>
      );
    }

    return value;
  };

  // Helper function to render status cell as Chip (for use in renderRow)
  // Can be called from parent component: renderStatusCell(statusValue, customColor)
  const renderStatusCell = (statusValue, customColor = null) => {
    if (!statusValue) return null;
    const chipColor = customColor || getStatusColor(statusValue);
    return (
      <div className="w-max">
        <Chip
          variant="ghost"
          size="sm"
          value={statusValue}
          color={chipColor}
          className="font-medium"
        />
      </div>
    );
  };

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <tbody>
      {[...new Array(rowsPerPage)].map((_, index) => {
        const isLast = index === rowsPerPage - 1;
        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
        return (
          <tr key={`skeleton-${index}`}>
            {normalizedColumns.map((column) => (
              <td key={column.id} className={classes}>
                <div className="h-4 bg-blue-gray-200 rounded animate-pulse"></div>
              </td>
            ))}
          </tr>
        );
      })}
    </tbody>
  );

  // Empty state component
  const EmptyState = () => (
    <tbody>
      <tr>
        <td colSpan={normalizedColumns.length} className="p-8">
          <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500">
            <InboxIcon className="h-20 w-20 mb-4 opacity-30" />
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-2 font-normal"
            >
              {emptyMessage}
            </Typography>
            {search && (
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-70"
              >
                Không tìm thấy kết quả cho "{search}"
              </Typography>
            )}
          </div>
        </td>
      </tr>
    </tbody>
  );

  return (
    <Card className="h-full w-full shadow-lg">
      {/* Header with Search and Filter Controls */}
      <div className="py-6 border-b border-blue-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-40">
            <Select
              value={String(rowsPerPage)}
              onChange={(val) =>
                onRowsPerPageChange({ target: { value: Number(val) } })
              }
              label="Số hàng"
              color="blue"
              containerProps={{
                className: "min-w-[120px]",
              }}
            >
              <Option value="10">10</Option>
              <Option value="20">20</Option>
              <Option value="30">30</Option>
              <Option value="50">50</Option>
            </Select>
          </div>

          <div className="w-full sm:w-72">
            <Input
              label="Tìm kiếm"
              value={search}
              placeholder="Nhập từ khóa tìm kiếm"
              onChange={(e) => setSearch(e.target.value)}
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              color="blue"
              containerProps={{
                className: "min-w-[200px]",
              }}
            />
          </div>
        </div>
      </div>

      <CardBody className="overflow-auto px-0 py-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {normalizedColumns.map((column, index) => (
                <th
                  key={column.id}
                  className={`border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors ${column.sortable !== false
                      ? "cursor-pointer hover:bg-blue-gray-50"
                      : ""
                    }`}
                  onClick={
                    column.sortable !== false ? handleSort(column.id) : undefined
                  }
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                  >
                    {column.label}{" "}
                    {column.sortable !== false &&
                      index !== normalizedColumns.length - 1 && (
                        <ChevronUpDownIcon
                          strokeWidth={2}
                          className="h-4 w-4"
                        />
                      )}
                  </Typography>
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
                const isLast = index === paginatedRows.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

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
                  <tr key={getRowKey(row, index)}>
                    {normalizedColumns.map((column) => (
                      <td key={column.id} className={classes}>
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
      </CardBody>

      {/* Pagination */}
      {!loading && paginatedRows.length > 0 && (
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Trang {page} / {filteredTotalPages} (Tổng: {filteredRows.length} kết
            quả)
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => onPageChange(null, page - 1)}
              disabled={page === 1}
            >
              Trước
            </Button>
            <Button
              variant="outlined"
              size="sm"
              onClick={() => onPageChange(null, page + 1)}
              disabled={page >= filteredTotalPages}
            >
              Sau
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default DataTable;
