import { Inbox, Search } from "@mui/icons-material";
import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
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

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <TableBody>
      {[...Array(rowsPerPage)].map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          {normalizedColumns.map((column) => (
            <TableCell
              key={column.id}
              sx={{
                px: 2,
                py: 2,
              }}
            >
              <Skeleton animation="wave" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );

  // Empty state component
  const EmptyState = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 300,
        color: "text.secondary",
      }}
    >
      <Inbox sx={{ fontSize: 80, mb: 2, opacity: 0.3 }} />
      <Typography variant="h6" color="text.secondary">
        {emptyMessage}
      </Typography>
      {search && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Không tìm thấy kết quả cho "{search}"
        </Typography>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Search and Filter Controls */}
      <Box display="flex" justifyContent="space-between" mb={2} gap={2}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Số hàng</InputLabel>
          <Select
            value={rowsPerPage}
            onChange={onRowsPerPageChange}
            label="Số hàng"
            size="small"
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>

        <TextField
          variant="outlined"
          label="Tìm kiếm"
          value={search}
          placeholder="Nhập từ khóa tìm kiếm"
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 250 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Table Container with Fixed Height & Sticky Header */}
      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          height: tableHeight,
          maxHeight: tableHeight,
          overflow: "auto",
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          // Custom scrollbar styling
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'background.default',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'divider',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          },
        }}
      >
        {loading ? (
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {normalizedColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{
                      bgcolor: "background.paper",
                      fontWeight: 600,
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                      borderBottom: 2,
                      borderColor: "divider",
                      px: 2,
                      py: 2,
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <LoadingSkeleton />
          </Table>
        ) : paginatedRows.length === 0 ? (
          <EmptyState />
        ) : (
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {normalizedColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    sortDirection={orderBy === column.id ? order : false}
                    sx={{
                      bgcolor: "background.paper",
                      fontWeight: 600,
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                      borderBottom: 2,
                      borderColor: "divider",
                      whiteSpace: "nowrap",
                      px: 2,
                      py: 2,
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row, index) => {
                if (renderRow) {
                  const element = renderRow(row, index, page, rowsPerPage);
                  return React.isValidElement(element)
                    ? React.cloneElement(element, { key: getRowKey(row, index) })
                    : element;
                }
                return (
                  <TableRow
                    key={getRowKey(row, index)}
                    hover
                    sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor: 'action.hover',
                      },
                      '&:hover': {
                        backgroundColor: 'action.selected',
                        cursor: 'pointer',
                      },
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    {normalizedColumns.map((column) => (
                      <TableCell
                        key={column.id}
                        sx={{
                          fontSize: "0.875rem",
                          px: 2,
                          py: 2,
                        }}
                      >
                        {row[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Pagination */}
      {!loading && paginatedRows.length > 0 && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Typography variant="body2" color="text.secondary">
            Hiển thị {(page - 1) * rowsPerPage + 1} -{" "}
            {Math.min(page * rowsPerPage, filteredRows.length)} trong tổng số{" "}
            {filteredRows.length} kết quả
          </Typography>
          <Pagination
            count={filteredTotalPages}
            page={page}
            onChange={onPageChange}
            variant="outlined"
            shape="rounded"
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export default DataTable;
