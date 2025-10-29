import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, TableRow, TableCell, Box, Button } from "@mui/material";
import DataTable from "@components/content-components/DataTable";
import { useNavigate } from "react-router-dom";
import { getAllWarehousesInCompany } from "@/services/general/WarehouseService";

const WarehouseInCompany = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("warehouseName");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchWarehouses = async () => {
      setLoading(true);
      try {
        const result = await getAllWarehousesInCompany(companyId, token);
        setWarehouses(result);
      } catch (error) {
        alert(error.response?.data?.message || "Lỗi khi tải danh sách kho!");
      } finally {
        setLoading(false);
      }
    };

    if (companyId && token) {
      fetchWarehouses();
    }
  }, [companyId, token]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(1);
  };

  const columns = [
    { id: "warehouseCode", label: "Mã kho" },
    { id: "warehouseName", label: "Tên kho" },
    { id: "description", label: "Mô tả" },
    { id: "maxCapacity", label: "Sức chứa tối đa (m³)" },
    { id: "warehouseType", label: "Loại kho" },
    { id: "status", label: "Trạng thái" },
  ];

  return (
    <Container>
      <Paper className="paper-container" elevation={3} >
        <Typography className="page-title" variant="h4" >
          DANH SÁCH KHO HÀNG
        </Typography>

        <Box mt={3} mb={3}>
          <Button variant="contained" color="default" onClick={() => navigate("/create-warehouse")}>
            Thêm mới
          </Button>
        </Box>

        <DataTable
          rows={warehouses}
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
          isLoading={loading}
          renderRow={(warehouse) => (
            <TableRow
              key={warehouse.id}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/warehouse/${warehouse.warehouseId}`)}
            >
              <TableCell>{warehouse.warehouseCode}</TableCell>
              <TableCell>{warehouse.warehouseName}</TableCell>
              <TableCell>{warehouse.description}</TableCell>
              <TableCell>{warehouse.maxCapacity}</TableCell>
              <TableCell>{warehouse.warehouseType}</TableCell>
              <TableCell>{warehouse.status}</TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default WarehouseInCompany;
