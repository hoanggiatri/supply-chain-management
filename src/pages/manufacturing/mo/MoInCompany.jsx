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
import StatusSummaryCard from "@/components/content-components/StatusSummaryCard";
import { getAllMosInCompany } from "@/services/manufacturing/MoService";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import toastrService from "@/services/toastrService";

const MoInCompany = () => {
  const [mos, setMos] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdOn");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const theme = useTheme();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchMos = async () => {
      try {
        const data = await getAllMosInCompany(companyId, token);
        setMos(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Có lỗi khi lấy danh sách công lệnh!"
        );
      }
    };

    fetchMos();
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

  const filteredMos =
    !filterStatus || filterStatus === "Tất cả"
      ? mos
      : mos.filter((mo) => mo.status === filterStatus);

  const columns = [
    { id: "moCode", label: "Mã MO" },
    { id: "itemCode", label: "Mã hàng hóa" },
    { id: "lineCode", label: "Mã chuyền" },
    { id: "type", label: "Loại" },
    { id: "quantity", label: "Số lượng" },
    { id: "estimatedStartTime", label: "Ngày bắt đầu" },
    { id: "estimatedEndTime", label: "Ngày kết thúc" },
    { id: "createdBy", label: "Người tạo" },
    { id: "createdOn", label: "Ngày tạo" },
    { id: "lastUpdatedOn", label: "Cập nhật" },
    { id: "status", label: "Trạng thái" },
  ];

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          DANH SÁCH CÔNG LỆNH SẢN XUẤT
        </Typography>
        <StatusSummaryCard
          data={mos}
          statusLabels={[
            "Tất cả",
            "Chờ xác nhận",
            "Chờ sản xuất",
            "Đang sản xuất",
            "Chờ nhập kho",
            "Đã hoàn thành",
            "Đã hủy",
          ]}
          getStatus={(mo) => mo.status}
          statusColors={{
            "Tất cả": "#000",
            "Chờ xác nhận": theme.palette.secondary.main,
            "Chờ sản xuất": theme.palette.info.main,
            "Đang sản xuất": theme.palette.primary.main,
            "Chờ nhập kho": theme.palette.warning.main,
            "Đã hoàn thành": theme.palette.success.main,
            "Đã hủy": theme.palette.error.main,
          }}
          onSelectStatus={(status) => setFilterStatus(status)}
          selectedStatus={filterStatus}
        />

        <Box mt={3} mb={3}>
          <Button
            variant="contained"
            color="default"
            onClick={() => navigate("/create-mo")}
          >
            Thêm mới
          </Button>
        </Box>

        <DataTable
          rows={filteredMos}
          columns={columns}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          page={page}
          height="calc(100vh - 450px)"
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          search={search}
          setSearch={setSearch}
          renderRow={(mo) => (
            <TableRow
              key={mo.moId}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/mo/${mo.moId}`)}
            >
              <TableCell>{mo.moCode || ""}</TableCell>
              <TableCell>{mo.itemCode || ""}</TableCell>
              <TableCell>{mo.lineCode || ""}</TableCell>
              <TableCell>{mo.type || ""}</TableCell>
              <TableCell>{mo.quantity}</TableCell>
              <TableCell>
                {mo.estimatedStartTime
                  ? new Date(mo.estimatedStartTime).toLocaleString()
                  : ""}
              </TableCell>
              <TableCell>
                {mo.estimatedEndTime
                  ? new Date(mo.estimatedEndTime).toLocaleString()
                  : ""}
              </TableCell>
              <TableCell>{mo.createdBy || ""}</TableCell>
              <TableCell>
                {mo.createdOn ? new Date(mo.createdOn).toLocaleString() : ""}
              </TableCell>
              <TableCell>
                {mo.lastUpdatedOn
                  ? new Date(mo.lastUpdatedOn).toLocaleString()
                  : ""}
              </TableCell>
              <TableCell>{mo.status || ""}</TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default MoInCompany;
