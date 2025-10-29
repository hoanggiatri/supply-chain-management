import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, TableRow, TableCell, Button, Box } from "@mui/material";
import { useParams } from "react-router-dom";
import DataTable from "@/components/content-components/DataTable";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import RtForm from "@/components/inventory/RtForm";
import { getReceiveTicketById, updateReceiveTicket } from "@/services/inventory/ReceiveTicketService";
import { getMoById, updateMo } from "@/services/manufacturing/MoService";
import dayjs from "dayjs";
import { increaseQuantity } from "@/services/inventory/InventoryService";
import { getTransferTicketById, updateTransferTicket } from "@/services/inventory/TransferTicketService";
import { updatePoStatus } from "@/services/purchasing/PoService";

const RtDetail = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getReceiveTicketById(ticketId, token);
        console.log(data);
        setTicket(data);
      } catch (error) {
        alert(error.response?.data?.message || "Không thể lấy dữ liệu phiếu nhập.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ticketId, token]);

  const handleConfirm = async () => {
    if (!window.confirm("Bạn có chắc muốn xác nhận phiếu nhập kho này không?")) return;

    const token = localStorage.getItem("token");
    const employeeName = localStorage.getItem("employeeName");

    try {
      await updateReceiveTicket(ticket.ticketId, {
        ...ticket,
        status: "Chờ nhập kho",
        createdBy: employeeName,
      }, token);

      alert("Xác nhận phiếu nhập kho thành công!");
      setTicket((prev) => ({ ...prev, status: "Chờ nhập kho", createdBy: employeeName }));
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra khi xác nhận phiếu!");
    }
  };

  const handleReceive = async () => {
    if (!window.confirm("Bạn có chắc muốn nhập kho không?")) return;

    const token = localStorage.getItem("token");

    try {
      const now = toLocalDateTimeString(new Date().toISOString())

      if (ticket.receiveType === "Sản xuất" && ticket.referenceId) {
        try {
          const mo = await getMoById(ticket.referenceId, token);
          await updateMo(ticket.referenceId, {
            ...mo,
            status: "Đã hoàn thành",
          }, token);
        } catch (moError) {
          alert("Cập nhật MO thất bại!");
        }
      }

      if (ticket.receiveType === "Chuyển kho" && ticket.referenceId) {
        try {
          const transferTicket = await getTransferTicketById(ticket.referenceId, token);
          await updateTransferTicket(ticket.referenceId, {
            ...transferTicket,
            status: "Đã hoàn thành",
          }, token);
        } catch (transferError) {
          alert("Cập nhật phiếu chuyển kho thất bại!");
        }
      }

      if (ticket.receiveType === "Mua hàng" && ticket.referenceId) {
        try {
          await updatePoStatus(ticket.referenceId, "Đã hoàn thành", token);
        } catch (poError) {
          alert("Cập nhật đơn mua hàng thất bại!");
        }
      }
      
      try {
        await Promise.all(
          ticket.receiveTicketDetails.map((detail) =>
            Promise.all([
              increaseQuantity({
                warehouseId: ticket.warehouseId,
                itemId: detail.itemId,
                quantity: detail.quantity
              }, token)
            ])
          )
        );

        await updateReceiveTicket(ticket.ticketId, {
          ...ticket,
          status: "Đã hoàn thành",
          receiveDate: now,
        }, token);
        
        alert("Nhập kho thành công!");
        setTicket((prev) => ({ ...prev, status: "Đã hoàn thành", receiveDate: now }));

      } catch (inventoryError) {
        alert("Cập nhật tồn kho thất bại!");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra khi nhập kho!");
    }
  };

  const toLocalDateTimeString = (localDateTimeString) => {
    if (!localDateTimeString) return null;
    return dayjs(localDateTimeString).format("YYYY-MM-DDTHH:mm:ss");
  };

  const columns = [
    { id: "itemCode", label: "Mã NVL" },
    { id: "itemName", label: "Tên NVL" },
    { id: "quantity", label: "Số lượng" },
    { id: "note", label: "Ghi chú" },
  ];

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

  const paginatedDetails = ticket?.receiveTicketDetails.slice(
    (page - 1) * rowsPerPage,
    (page - 1) * rowsPerPage + rowsPerPage
  ) || [];

  if (!ticket) return <LoadingPaper title="THÔNG TIN PHIẾU NHẬP KHO" />;

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">THÔNG TIN PHIẾU NHẬP KHO</Typography>

        <Box mt={3} mb={3} display="flex" justifyContent="flex-end" gap={2}>
          {ticket.status === "Chờ xác nhận" && (
            <Button variant="contained" color="default" onClick={handleConfirm}>
              Xác nhận
            </Button>
          )}
          {ticket.status === "Chờ nhập kho" && (
            <Button variant="contained" color="warning" onClick={handleReceive}>
              Nhập kho
            </Button>
          )}
        </Box>

        <RtForm ticket={ticket} />

        <Typography variant="h5" mt={3} mb={3}>DANH SÁCH HÀNG HÓA NHẬP KHO:</Typography>

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
      </Paper>
    </Container>
  );
};

export default RtDetail;
