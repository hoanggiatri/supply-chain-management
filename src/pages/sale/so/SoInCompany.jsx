import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, TableRow, TableCell } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import DataTable from "@/components/content-components/DataTable";
import StatusSummaryCard from "@/components/content-components/StatusSummaryCard";
import { getAllSosInCompany } from "@/services/sale/SoService";

const SoInCompany = () => {
  const [sos, setSos] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdOn");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchSos = async () => {
      try {
        const data = await getAllSosInCompany(companyId, token);
        setSos(data);
      } catch (error) {
        alert(error.response?.data?.message || "Không thể lấy danh sách đơn bán hàng!");
      }
    };
    fetchSos();
  }, [companyId, token]);

  const filteredSos =
    filterStatus === "Tất cả"
      ? sos
      : sos.filter((so) => so.status === filterStatus);

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
    { id: "soCode", label: "Mã đơn bán" },
    { id: "poCode", label: "Mã đơn mua" },
    { id: "customerCompanyCode", label: "Mã khách hàng" },
    { id: "customerCompanyName", label: "Tên khách hàng" },
    { id: "paymentMethod", label: "Phương thức thanh toán" },
    { id: "createdBy", label: "Người tạo" },
    { id: "createdOn", label: "Ngày tạo" },
    { id: "status", label: "Trạng thái" },
  ];

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          DANH SÁCH ĐƠN BÁN HÀNG
        </Typography>

        <StatusSummaryCard
          data={sos}
          statusLabels={["Tất cả", "Chờ xuất kho", "Chờ vận chuyển", "Đang vận chuyển", "Đã hoàn thành"]}
          getStatus={(so) => so.status}
          statusColors={{
            "Tất cả": "#000",
            "Chờ xuất kho": theme.palette.secondary.main,
            "Chờ vận chuyển": theme.palette.warning.main,
            "Đang vận chuyển": theme.palette.primary.main,
            "Đã hoàn thành": theme.palette.success.main
          }}
          onSelectStatus={setFilterStatus}
          selectedStatus={filterStatus}
        />

        <DataTable
          rows={filteredSos}
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
          renderRow={(so) => (
            <TableRow
              key={so.soId}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/so/${so.soId}`)}
            >
              <TableCell>{so.soCode}</TableCell>
              <TableCell>{so.poCode}</TableCell>
              <TableCell>{so.customerCompanyCode}</TableCell>
              <TableCell>{so.customerCompanyName}</TableCell>
              <TableCell>{so.paymentMethod}</TableCell>
              <TableCell>{so.createdBy}</TableCell>
              <TableCell>{so.createdOn ? new Date(so.createdOn).toLocaleString() : ""}</TableCell>
              <TableCell>{so.status}</TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default SoInCompany;
