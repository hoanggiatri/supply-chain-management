import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, TableRow, TableCell } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import DataTable from "@/components/content-components/DataTable";
import StatusSummaryCard from "@/components/content-components/StatusSummaryCard";
import { getAllDeliveryOrdersInCompany } from "@/services/delivery/DoService";

const DoInCompany = () => {
  const [dos, setDos] = useState([]);
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
    const fetchDos = async () => {
      try {
        const data = await getAllDeliveryOrdersInCompany(companyId, token);
        setDos(data);
      } catch (error) {
        alert(error.response?.data?.message || "Không thể lấy danh sách đơn vận chuyển!");
      }
    };
    fetchDos();
  }, [companyId, token]);

  const filteredDos =
    filterStatus === "Tất cả"
      ? dos
      : dos.filter((ord) => ord.status === filterStatus);

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
    { id: "doCode", label: "Mã đơn vận chuyển" },
    { id: "soCode", label: "Mã đơn bán" },
    { id: "createdBy", label: "Người tạo" },
    { id: "createdOn", label: "Ngày tạo" },
    { id: "lastUpdatedOn", label: "Cập nhật gần nhất" },
    { id: "status", label: "Trạng thái" },
  ];

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          DANH SÁCH ĐƠN VẬN CHUYỂN
        </Typography>

        <StatusSummaryCard
          data={dos}
          statusLabels={["Tất cả", "Chờ xác nhận", "Chờ lấy hàng", "Đang vận chuyển", "Đã hoàn thành"]}
          getStatus={(ord) => ord.status}
          statusColors={{
            "Tất cả": "#000",
            "Chờ xác nhận": theme.palette.secondary.main,
            "Chờ lấy hàng": theme.palette.warning.main,
            "Đang vận chuyển": theme.palette.primary.main,
            "Đã hoàn thành": theme.palette.success.main,
          }}
          onSelectStatus={setFilterStatus}
          selectedStatus={filterStatus}
        />

        <DataTable
          rows={filteredDos}
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
          renderRow={(ord) => (
            <TableRow
              key={ord.doId}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/do/${ord.doId}`)}
            >
              <TableCell>{ord.doCode}</TableCell>
              <TableCell>{ord.soCode}</TableCell>
              <TableCell>{ord.createdBy}</TableCell>
              <TableCell>{ord.createdOn ? new Date(ord.createdOn).toLocaleString() : ""}</TableCell>
              <TableCell>{ord.lastUpdatedOn ? new Date(ord.lastUpdatedOn).toLocaleString() : ""}</TableCell>
              <TableCell>{ord.status}</TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default DoInCompany;
