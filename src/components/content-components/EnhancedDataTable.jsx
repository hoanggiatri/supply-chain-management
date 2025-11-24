import React, { useState } from "react";
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
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  Inbox,
  Search,
  FileDownload,
  ViewColumn,
  Refresh,
} from "@mui/icons-material";
import * as XLSX from "xlsx";

const EnhancedDataTable = ({
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
  height,
  emptyMessage = "Không có dữ liệu",
  loading = false,
  onRefresh,
  exportFileName = "data",
}) => {
  const [anchorElColumns, setAnchorElColumns] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState(() =>
    columns.reduce((acc, col) => ({ ...acc, [col.id]: true }), {})
  );

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
  const displayColumns = normalizedColumns.filter((col) => visibleColumns[col.id]);

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

  // Export to Excel
  const handleExport = () => {
    const exportData = sortedRows.map((row) => {
      const exportRow = {};
      displayColumns.forEach((col) => {
        exportRow[col.label] = row[col.id];
      });
      return exportRow;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `${exportFileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Column visibility menu
  const handleColumnsMenuOpen = (event) => {
    setAnchorElColumns(event.currentTarget);
  };

  const handleColumnsMenuClose = () => {
    setAnchorElColumns(null);
  };

  const handleColumnToggle = (columnId) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <TableBody>
      {[...Array(rowsPerPage)].map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          {displayColumns.map((column) => (
            <TableCell key={column.id} sx={{ px: 2, py: 2 }}>
              <Skeleton animation="wave" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );

  // Empty state
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
      {/* Toolbar */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2.5, 
          mb: 2, 
          border: 1, 
          borderColor: 'divider',
          borderRadius: 3,
          bgcolor: 'background.paper',
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.03) 0%, rgba(21, 101, 192, 0.03) 100%)',
        }}
      >
        <Box display="flex" justifyContent="space-between" gap={2} flexWrap="wrap">
          <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel>Số hàng</InputLabel>
              <Select
                value={rowsPerPage}
                onChange={onRowsPerPageChange}
                label="Số hàng"
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>

            <Tooltip title="Làm mới dữ liệu">
              <IconButton 
                onClick={onRefresh} 
                color="primary"
                disabled={loading}
                size="small"
                sx={{
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(180deg)',
                  }
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>

            <Chip 
              label={`${filteredRows.length} kết quả`} 
              color="primary" 
              variant="filled"
              size="small"
              icon={<Box component="span" sx={{ fontSize: '1.2rem' }}>📊</Box>}
              sx={{ 
                fontWeight: 700,
                px: 1.5,
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
              }}
            />
          </Box>

          <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
            <TextField
              variant="outlined"
              label="Tìm kiếm"
              value={search}
              placeholder="Nhập từ khóa..."
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ 
                minWidth: 250,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'action.hover',
                  '&:hover': {
                    bgcolor: 'action.selected',
                  },
                  '&.Mui-focused': {
                    bgcolor: 'background.paper',
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <Tooltip title="Ẩn/hiện cột">
              <IconButton 
                onClick={handleColumnsMenuOpen} 
                color="primary"
                size="small"
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <ViewColumn fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Xuất Excel">
              <IconButton 
                onClick={handleExport} 
                color="success"
                disabled={filteredRows.length === 0}
                size="small"
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'success.main',
                  },
                }}
              >
                <FileDownload fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Column Visibility Menu */}
      <Menu
        anchorEl={anchorElColumns}
        open={Boolean(anchorElColumns)}
        onClose={handleColumnsMenuClose}
        PaperProps={{
          sx: { maxHeight: 400, width: 250 }
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Hiển thị cột
          </Typography>
        </Box>
        {normalizedColumns.map((column) => (
          <MenuItem key={column.id} onClick={() => handleColumnToggle(column.id)}>
            <ListItemIcon>
              <Checkbox
                checked={visibleColumns[column.id]}
                size="small"
              />
            </ListItemIcon>
            <ListItemText primary={column.label} />
          </MenuItem>
        ))}
      </Menu>

      {/* Table Container */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          height: tableHeight,
          maxHeight: tableHeight,
          overflow: "auto",
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          bgcolor: 'background.paper',
          '&::-webkit-scrollbar': {
            width: '12px',
            height: '12px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'action.hover',
            borderRadius: '6px',
            margin: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'action.selected',
            borderRadius: '6px',
            border: '3px solid',
            borderColor: 'background.paper',
            '&:hover': {
              backgroundColor: 'primary.main',
              borderColor: 'background.paper',
            },
          },
          '&::-webkit-scrollbar-corner': {
            backgroundColor: 'transparent',
          },
        }}
      >
        {loading ? (
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {displayColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{
                      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      color: "#FFFFFF",
                      fontWeight: 700,
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                      borderBottom: 3,
                      borderColor: "#1565c0",
                      px: 3,
                      py: 2.5,
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
                {displayColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    sortDirection={orderBy === column.id ? order : false}
                    sx={{
                      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      color: "#FFFFFF",
                      fontWeight: 700,
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                      borderBottom: 3,
                      borderColor: "#1565c0",
                      whiteSpace: "nowrap",
                      px: 3,
                      py: 2.5,
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={handleSort(column.id)}
                      sx={{
                        color: 'inherit !important',
                        '&:hover': {
                          color: 'inherit !important',
                        },
                        '& .MuiTableSortLabel-icon': {
                          color: 'inherit !important',
                        },
                      }}
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
                  const element = renderRow(row, index, page, rowsPerPage, displayColumns);
                  return React.isValidElement(element)
                    ? React.cloneElement(element, { key: getRowKey(row, index) })
                    : element;
                }
                return (
                  <TableRow
                    key={getRowKey(row, index)}
                    hover
                    sx={{
                      '&:nth-of-type(even)': {
                        background: 'linear-gradient(90deg, rgba(25, 118, 210, 0.02) 0%, rgba(21, 101, 192, 0.02) 100%)',
                      },
                      '&:hover': {
                        background: 'linear-gradient(90deg, rgba(25, 118, 210, 0.08) 0%, rgba(21, 101, 192, 0.08) 100%) !important',
                        cursor: 'pointer',
                        transform: 'translateX(2px)',
                        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
                      },
                      transition: 'all 0.2s ease',
                      borderLeft: '3px solid transparent',
                      '&:hover': {
                        borderLeftColor: 'primary.main',
                      },
                    }}
                  >
                    {displayColumns.map((column) => (
                      <TableCell
                        key={column.id}
                        sx={{
                          fontSize: "0.875rem",
                          px: 3,
                          py: 2.5,
                          borderBottom: 1,
                          borderColor: 'divider',
                          fontWeight: 500,
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
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mt: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.03) 0%, rgba(21, 101, 192, 0.03) 100%)',
          }}
        >
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
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
            sx={{
              '& .MuiPaginationItem-root': {
                fontWeight: 600,
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                },
              },
            }}
          />
        </Paper>
      )}
    </Box>
  );
};

export default EnhancedDataTable;
