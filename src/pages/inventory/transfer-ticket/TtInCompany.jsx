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
import { getAllTransferTicketsInCompany } from "@/services/inventory/TransferTicketService";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import toastrService from "@/services/toastrService";

const TransferTicketInCompany = () => {
  const [tickets, setTickets] = useState([]);
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
    const fetchTickets = async () => {
      try {
        const data = await getAllTransferTicketsInCompany(companyId, token);
        setTickets(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi khi lấy danh sách phiếu chuyển kho!"
        );
      }
    };

    fetchTickets();
  }, [companyId, token]);

  const filteredTickets =
    !filterStatus || filterStatus === "Tất cả"
      ? tickets
      : tickets.filter((ticket) => ticket.status === filterStatus);

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
    { id: "ticketCode", label: "Mã phiếu" },
    { id: "fromWarehouseCode", label: "Mã kho xuất" },
    { id: "fromWarehouseName", label: "Tên kho xuất" },
    { id: "toWarehouseCode", label: "Mã kho nhập" },
    { id: "toWarehouseName", label: "Tên kho nhập" },
    { id: "reason", label: "Lý do" },
    { id: "createdBy", label: "Người tạo" },
    { id: "createdOn", label: "Ngày tạo" },
    { id: "lastUpdatedOn", label: "Cập nhật" },
    { id: "status", label: "Trạng thái" },
  ];

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          DANH SÁCH PHIẾU CHUYỂN KHO
        </Typography>
        <StatusSummaryCard
          data={tickets}
          statusLabels={[
            "Tất cả",
            "Chờ xác nhận",
            "Chờ xuất kho",
            "Chờ nhập kho",
            "Đã hoàn thành",
            "Đã hủy",
          ]}
          getStatus={(ticket) => ticket.status}
          statusColors={{
            "Tất cả": "#000",
            "Chờ xác nhận": theme.palette.secondary.main,
            "Chờ xuất kho": theme.palette.info.main,
            "Chờ nhập kho": theme.palette.warning.main,
            "Đã hoàn thành": theme.palette.success.main,
            "Đã hủy": theme.palette.error.main,
          }}
          onSelectStatus={(status) => setFilterStatus(status)}
          selectedStatus={filterStatus}
        />
        <Box mb={3}>
          <Button
            variant="contained"
            color="default"
            onClick={() => navigate("/create-transfer-ticket")}
          >
            Thêm mới
          </Button>
        </Box>
        <DataTable
          rows={filteredTickets}
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
          renderRow={(ticket) => (
            <TableRow
              key={ticket.ticketCode}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/transfer-ticket/${ticket.ticketId}`)}
            >
              <TableCell>{ticket.ticketCode || ""}</TableCell>
              <TableCell>{ticket.fromWarehouseCode || ""}</TableCell>
              <TableCell>{ticket.fromWarehouseName || ""}</TableCell>
              <TableCell>{ticket.toWarehouseCode || ""}</TableCell>
              <TableCell>{ticket.toWarehouseName || ""}</TableCell>
              <TableCell>{ticket.reason || ""}</TableCell>
              <TableCell>{ticket.createdBy || ""}</TableCell>
              <TableCell>
                {ticket.createdOn
                  ? new Date(ticket.createdOn).toLocaleString()
                  : ""}
              </TableCell>
              <TableCell>
                {ticket.lastUpdatedOn
                  ? new Date(ticket.lastUpdatedOn).toLocaleString()
                  : ""}
              </TableCell>
              <TableCell>{ticket.status || ""}</TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default TransferTicketInCompany;
