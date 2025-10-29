import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, TableRow, TableCell, Box, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import DataTable from "@/components/content-components/DataTable";
import TtForm from "@/components/inventory/TtForm";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import { getTransferTicketById, updateTransferTicket } from "@/services/inventory/TransferTicketService";

const TtDetail = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchTicket = async () => {
      setLoading(true);
      try {
        const data = await getTransferTicketById(ticketId, token);
        setTicket(data);
        setDetails(Array.isArray(data.transferTicketDetails) ? data.transferTicketDetails : []);
      } catch (error) {
        alert(error.response?.data?.message || "Lỗi khi tải phiếu chuyển kho!");
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [ticketId, token]);

  const readOnlyFields = {
    ticketCode: true,
    reason: true,
    fromWarehouseCode: true,
    toWarehouseCode: true,
    fromWarehouseName: true,
    toWarehouseName: true,
    status: true,
  };

  const columns = [
    { id: "itemCode", label: "Mã hàng hóa" },
    { id: "itemName", label: "Tên hàng hóa" },
    { id: "quantity", label: "Số lượng" },
    { id: "note", label: "Ghi chú" },
  ];

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

  const filteredDetails = Array.isArray(details)
    ? details.sort((a, b) => {
      if (orderBy) {
        if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
        if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
      }
      return 0;
    })
    : [];

  const paginatedDetails = filteredDetails.slice(
    (page - 1) * rowsPerPage,
    (page - 1) * rowsPerPage + rowsPerPage
  );

  const handleEditClick = () => {
    if (ticket.status === "Chờ xác nhận") {
      navigate(`/transfer-ticket/${ticket.ticketId}/edit`);
    } else {
      alert("Chỉ phiếu chuyển kho ở trạng thái 'Chờ xác nhận' mới được chỉnh sửa!");
    }
  };

  const handleCancel = async () => {
    const confirmCancel = window.confirm("Bạn có chắc chắn muốn hủy phiếu chuyển kho này không?");
    if (!confirmCancel) return;

    try {
      const request = {
        ...ticket,
        status: "Đã hủy"
      };
      await updateTransferTicket(ticketId, request, token);
      alert("Đã hủy phiếu chuyển kho!");

      setTicket((prev) => ({
        ...prev,
        status: "Đã hủy",
      }));
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi khi hủy phiếu chuyển kho!");
    }
  };

  const handleConfirm = (type, id) => {
    navigate(`/check-inventory/${type}/${id}`);
  };

  if (!ticket) {
    return <LoadingPaper title="THÔNG TIN PHIẾU CHUYỂN KHO" />;
  }

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          THÔNG TIN PHIẾU CHUYỂN KHO
        </Typography>

        {ticket.status === "Chờ xác nhận" && (
          <Box mt={3} mb={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" color="default" onClick={() => handleConfirm("tt", ticket.ticketId)}>
              Xác nhận
            </Button>
            <Button variant="contained" color="error" onClick={handleCancel}>
              Hủy
            </Button>
          </Box>
        )}

        <TtForm ticket={ticket} onChange={() => { }} errors={{}} readOnlyFields={readOnlyFields} setTicket={setTicket} />

        <Typography variant="h5" mt={3} mb={3}>
          DANH SÁCH HÀNG HÓA CHUYỂN KHO:
        </Typography>

        <DataTable
          rows={paginatedDetails}
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
          renderRow={(detail, index) => (
            <TableRow key={index}>
              <TableCell>{detail.itemCode}</TableCell>
              <TableCell>{detail.itemName}</TableCell>
              <TableCell>{detail.quantity}</TableCell>
              <TableCell>{detail.note}</TableCell>
            </TableRow>
          )}
        />

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="default" onClick={handleEditClick}>
            Sửa
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TtDetail;
