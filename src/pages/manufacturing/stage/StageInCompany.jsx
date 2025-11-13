import React, { useEffect, useState } from "react";
import {
  Container,
  TableRow,
  TableCell,
  Typography,
  Paper,
  Box,
  Button,
} from "@mui/material";
import DataTable from "@components/content-components/DataTable";
import { getAllStagesInCompany } from "@/services/manufacturing/StageService";
import { useNavigate } from "react-router-dom";
import toastrService from "@/services/toastrService";

const StageInCompany = () => {
  const [stages, setStages] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("stageCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const data = await getAllStagesInCompany(companyId, token);
        setStages(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy danh sách Stage!"
        );
      }
    };

    fetchStages();
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
    { id: "stageCode", label: "Mã Stage" },
    { id: "itemCode", label: "Mã hàng hóa" },
    { id: "itemName", label: "Tên hàng hóa" },
    { id: "description", label: "Mô tả" },
    { id: "status", label: "Trạng thái" },
  ];

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          DANH SÁCH QUY TRÌNH SẢN XUẤT
        </Typography>
        <Box mt={3} mb={3}>
          <Button
            variant="contained"
            color="default"
            onClick={() => navigate("/create-stage")}
          >
            Thêm mới
          </Button>
        </Box>
        <DataTable
          rows={stages}
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
          renderRow={(stage) => (
            <TableRow
              key={stage.stageId}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/stage/${stage.itemId}`)}
            >
              <TableCell>{stage.stageCode || ""}</TableCell>
              <TableCell>{stage.itemCode || ""}</TableCell>
              <TableCell>{stage.itemName || ""}</TableCell>
              <TableCell>{stage.description || ""}</TableCell>
              <TableCell>{stage.status || ""}</TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default StageInCompany;
