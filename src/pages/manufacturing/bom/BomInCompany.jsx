import React, { useEffect, useState } from "react";
import { Container, TableRow, TableCell, Typography, Paper, Box, Button } from "@mui/material";
import DataTable from "@components/content-components/DataTable";
import { getAllBomsInCompany } from "@/services/manufacturing/BomService";
import { useNavigate } from "react-router-dom";

const BomInCompany = () => {
  const [boms, setBoms] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchBoms = async () => {
      try {
        const data = await getAllBomsInCompany(companyId, token);
        setBoms(data);
      } catch (error) {
        alert(error.response?.data?.message || "Có lỗi xảy ra khi lấy danh sách Bom!");
      }
    };

    fetchBoms();
  }, [companyId, token]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(1);
  };

  const columns = [
    { id: "bomCode", label: "Mã BOM" },
    { id: "itemCode", label: "Mã hàng hóa" },
    { id: "itemName", label: "Tên hàng hóa" },
    { id: "description", label: "Mô tả" },
    { id: "status", label: "Trạng thái" },
  ];

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          DANH SÁCH BOM
        </Typography>
        <Box mt={3} mb={3}>
          <Button variant="contained" color="default" onClick={() => navigate("/create-bom")}>
            Thêm mới
          </Button>
        </Box>
        <DataTable
          rows={boms}
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
          renderRow={(bom) => (
            <TableRow
              key={bom.bomId}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/bom/${bom.itemId}`)}
            >
              <TableCell>{bom.bomCode || ""}</TableCell>
              <TableCell>{bom.itemCode || ""}</TableCell>
              <TableCell>{bom.itemName || ""}</TableCell>
              <TableCell>{bom.description || ""}</TableCell>
              <TableCell>{bom.status || ""}</TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default BomInCompany;
