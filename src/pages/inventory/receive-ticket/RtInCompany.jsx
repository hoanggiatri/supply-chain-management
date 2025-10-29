import React, { useEffect, useState } from "react";
import { Container, TableRow, TableCell, Typography, Paper } from "@mui/material";
import DataTable from "@components/content-components/DataTable";
import StatusSummaryCard from "@/components/content-components/StatusSummaryCard";
import { getAllReceiveTicketsInCompany } from "@/services/inventory/ReceiveTicketService";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';

const RtInCompany = () => {
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
        const data = await getAllReceiveTicketsInCompany(companyId, token);
        console.log(data);
        setTickets(data);
      } catch (error) {
        alert(error.response?.data?.message || "Có lỗi khi lấy danh sách phiếu nhập!");
      }
    };

    fetchTickets();
  }, [companyId, token]);


  const filteredTickets = !filterStatus || filterStatus === "Tất cả"
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
    { id: "warehouseCode", label: "Mã kho" },
    { id: "warehouseName", label: "Tên kho" },
    { id: "receiveDate", label: "Ngày nhập kho" },
    { id: "reason", label: "Lý do" },
    { id: "receiveType", label: "Loại nhập kho" },
    { id: "referenceCode", label: "Mã tham chiếu" },
    { id: "createdBy", label: "Người tạo" },
    { id: "createdOn", label: "Ngày tạo" },
    { id: "lastUpdatedOn", label: "Cập nhật" },
    { id: "status", label: "Trạng thái" },
  ];

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          DANH SÁCH PHIẾU NHẬP KHO
        </Typography>

        <StatusSummaryCard
          data={tickets}
          statusLabels={["Tất cả", "Chờ xác nhận", "Chờ nhập kho", "Đã hoàn thành"]}
          getStatus={(ticket) => ticket.status}
          statusColors={{
            "Tất cả": "#000",
            "Chờ xác nhận": theme.palette.secondary.main,
            "Chờ nhập kho": theme.palette.warning.main,
            "Đã hoàn thành": theme.palette.success.main
          }}
          onSelectStatus={(status) => setFilterStatus(status)}
          selectedStatus={filterStatus}
        />

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
              key={ticket.ticketId}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/receive-ticket/${ticket.ticketId}`)}
            >
              <TableCell>{ticket.ticketCode}</TableCell>
              <TableCell>{ticket.warehouseCode}</TableCell>
              <TableCell>{ticket.warehouseName}</TableCell>
              <TableCell>{ticket.receiveDate ? new Date(ticket.receiveDate).toLocaleString() : ""}</TableCell>
              <TableCell>{ticket.reason}</TableCell>
              <TableCell>{ticket.receiveType}</TableCell>
              <TableCell>{ticket.referenceCode}</TableCell>
              <TableCell>{ticket.createdBy}</TableCell>
              <TableCell>{ticket.createdOn ? new Date(ticket.createdOn).toLocaleString() : ""}</TableCell>
              <TableCell>{ticket.lastUpdatedOn ? new Date(ticket.lastUpdatedOn).toLocaleString() : ""}</TableCell>
              <TableCell>{ticket.status}</TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default RtInCompany;
