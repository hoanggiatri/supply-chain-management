import { useEffect, useState } from "react";
import { getIssueForecast, getIssueReport, getMonthlyIssueReport } from "@services/inventory/IssueTicketService";
import { Box, Container, Grid, MenuItem, Paper, TableCell, TableRow, TextField, Typography } from "@mui/material";
import DataTable from "@/components/content-components/DataTable";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import { getAllWarehousesInCompany } from "@/services/general/WarehouseService";
import IssueForecast from "@/components/inventory/IssueForecast";
import dayjs from "dayjs";

const IssueReport = () => {
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const [issueType, setIssueType] = useState("Tất cả");
  const [warehouseId, setWarehouseId] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const getStartOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
  };

  const getEndOfDay = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
  };

  const [startDate, setStartDate] = useState(getStartOfMonth());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllWarehousesInCompany(companyId, token);
      setWarehouses(data);

      const monthly = await getMonthlyIssueReport(companyId, issueType, warehouseId, token);
      const detail = await getIssueReport(
        {
          startTime: toLocalDateTimeString(startDate),
          endTime: toLocalDateTimeString(getEndOfDay(endDate)),
          issueType,
          warehouseId
        },
        companyId,
        token
      );
      const forecast = await getIssueForecast(companyId, issueType, warehouseId, token);

      setMonthlyData(monthly);
      setForecastData(forecast);
      setTableData(detail);
    };

    fetchData();
  }, [issueType, warehouseId, companyId, token, startDate, endDate]);

  const toLocalDateTimeString = (localDateTimeString) => {
    if (!localDateTimeString) return null;
    return dayjs(localDateTimeString).format("YYYY-MM-DDTHH:mm:ss");
  };

  const formatDateLocal = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const columns = [
    { id: "itemCode", label: "Mã hàng hóa" },
    { id: "itemName", label: "Tên hàng hóa" },
    { id: "totalQuantity", label: "Tổng số lượng xuất kho" }
  ];

  const filteredItems = tableData.filter(
    (item) =>
      (item.itemCode?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (item.itemName?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (monthlyData.length === 0 && tableData.length === 0) {
    return <LoadingPaper title="BÁO CÁO XUẤT KHO" />;
  }

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          BÁO CÁO XUẤT KHO
        </Typography>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              label="Từ ngày"
              type="date"
              value={formatDateLocal(startDate)}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              label="Đến ngày"
              type="date"
              value={formatDateLocal(endDate)}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              label="Loại xuất kho"
              fullWidth
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              select
            >
              <MenuItem value="Tất cả">Tất cả</MenuItem>
              <MenuItem value="Sản xuất">Sản xuất</MenuItem>
              <MenuItem value="Bán hàng">Bán hàng</MenuItem>
              <MenuItem value="Chuyển kho">Chuyển kho</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              label="Kho"
              fullWidth
              value={warehouseId}
              onChange={(e) => setWarehouseId(Number(e.target.value))}
              select
            >
              <MenuItem value={0}>Tất cả</MenuItem>
              {warehouses.map((w) => (
                <MenuItem key={w.warehouseId} value={w.warehouseId}>
                  {w.warehouseName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="center">
          <IssueForecast
            data={monthlyData}
            forecastData={forecastData}
            metric="totalQuantity"
            label="Tổng số lượng hàng hóa xuất kho"
            color="#05518B"
          />
        </Box>

        <Box mt={4}>
          <DataTable
            rows={filteredItems}
            columns={columns}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            search={search}
            setSearch={setSearch}
            renderRow={(item) => (
              <TableRow key={item.itemId} hover>
                <TableCell>{item.itemCode}</TableCell>
                <TableCell>{item.itemName}</TableCell>
                <TableCell>{item.totalQuantity}</TableCell>
              </TableRow>
            )}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default IssueReport;
