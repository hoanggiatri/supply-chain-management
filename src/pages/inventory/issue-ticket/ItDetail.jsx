import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TableRow,
  TableCell,
  Button,
  Box,
} from "@mui/material";
import { useParams } from "react-router-dom";
import DataTable from "@/components/content-components/DataTable";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import ItForm from "@/components/inventory/ItForm";
import {
  getIssueTicketById,
  updateIssueTicketStatus,
} from "@/services/inventory/IssueTicketService";
import { getMoById, updateMo } from "@/services/manufacturing/MoService";
import {
  decreaseOnDemand,
  decreaseQuantity,
} from "@/services/inventory/InventoryService";
import {
  getAllProcessesInMo,
  updateProcess,
} from "@/services/manufacturing/ProcessService";
import {
  getTransferTicketById,
  updateTransferTicket,
} from "@/services/inventory/TransferTicketService";
import { createReceiveTicket } from "@/services/inventory/ReceiveTicketService";
import { getSoById, updateSoStatus } from "@/services/sale/SoService";
import { createDeliveryOrder } from "@/services/delivery/DoService";

const ItDetail = () => {
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
        const data = await getIssueTicketById(ticketId, token);
        setTicket(data);
      } catch (error) {
        alert(
          error.response?.data?.message || "Không thể lấy dữ liệu phiếu xuất."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ticketId, token]);

  const handleConfirm = async () => {
    if (!window.confirm("Bạn có chắc muốn xác nhận phiếu xuất kho này không?"))
      return;

    const employeeName = localStorage.getItem("employeeName");
    try {
      // Format issueDate to ISO 8601 if it exists, otherwise use null
      let issueDate = null;
      if (ticket.issueDate) {
        // If issueDate exists, ensure it's in ISO 8601 format
        issueDate = new Date(ticket.issueDate).toISOString();
      }

      // Only send allowed fields, exclude read-only and computed fields
      const request = {
        companyId: Number(ticket.companyId),
        warehouseId: Number(ticket.warehouseId),
        reason: ticket.reason,
        issueType: ticket.issueType,
        referenceCode: ticket.referenceCode,
        status: "Chờ xuất kho",
        issueDate: issueDate,
        createdBy: employeeName,
      };
      await updateIssueTicketStatus(ticket.ticketId, request, token);
      alert("Xác nhận phiếu xuất kho thành công!");
      setTicket((prev) => ({
        ...prev,
        status: "Chờ xuất kho",
        createdBy: employeeName,
      }));
    } catch (error) {
      alert(
        error.response?.data?.message || "Có lỗi xảy ra khi xác nhận phiếu!"
      );
    }
  };

  const handleIssue = async () => {
    if (!window.confirm("Bạn có chắc muốn xuất kho không?")) return;

    // Use ISO 8601 format for issueDate - ensure it's always a valid string
    const now = new Date().toISOString();
    try {
      // Only send allowed fields, exclude read-only and computed fields
      const request = {
        companyId: Number(ticket.companyId),
        warehouseId: Number(ticket.warehouseId),
        reason: ticket.reason,
        issueType: ticket.issueType,
        referenceCode: ticket.referenceCode,
        status: "Đã hoàn thành",
        issueDate: now,
        createdBy: ticket.createdBy,
      };
      await updateIssueTicketStatus(ticket.ticketId, request, token);

      if (ticket.issueType === "Sản xuất" && ticket.referenceId) {
        try {
          const mo = await getMoById(ticket.referenceId, token);
          await updateMo(
            ticket.referenceId,
            {
              ...mo,
              status: "Đang sản xuất",
            },
            token
          );

          const processes = await getAllProcessesInMo(
            ticket.referenceId,
            token
          );
          const sortedProcesses = processes.sort(
            (a, b) => a.stageDetailOrder - b.stageDetailOrder
          );

          const process = sortedProcesses[0];

          await updateProcess(
            process.id,
            {
              moId: ticket.referenceId,
              stageDetailId: process.stageDetailId,
              startedOn: now,
              status: "Đang thực hiện",
            },
            token
          );
        } catch (moError) {
          alert("Cập nhật MO thất bại!");
        }
      }

      if (ticket.issueType === "Chuyển kho" && ticket.referenceId) {
        try {
          const tt = await getTransferTicketById(ticket.referenceId, token);

          // Only send allowed fields, exclude read-only and computed fields
          const transferTicketRequest = {
            companyId: Number(tt.companyId),
            fromWarehouseId: Number(tt.fromWarehouseId),
            toWarehouseId: Number(tt.toWarehouseId),
            reason: tt.reason,
            status: "Chờ nhập kho",
            createdBy: tt.createdBy,
            transferTicketDetails: (tt.transferTicketDetails || []).map(
              (detail) => ({
                itemId: Number(detail.itemId),
                quantity: parseFloat(detail.quantity),
                note: detail.note || "",
              })
            ),
          };

          await updateTransferTicket(
            ticket.referenceId,
            transferTicketRequest,
            token
          );

          const employeeName = localStorage.getItem("employeeName");
          const receiveTicketRequest = {
            companyId: Number(tt.companyId),
            warehouseId: Number(tt.toWarehouseId),
            reason: "Xuất kho để chuyển kho",
            receiveType: "Chuyển kho",
            referenceCode: tt.ticketCode,
            status: "Chờ xác nhận",
            receiveDate: new Date().toISOString(),
            createdBy: employeeName,
          };

          await createReceiveTicket(receiveTicketRequest, token);
        } catch (ttError) {
          alert("Cập nhật phiếu chuyển kho thất bại!");
        }
      }

      if (ticket.issueType === "Bán hàng" && ticket.referenceId) {
        try {
          const so = await getSoById(ticket.referenceId, token);
          await updateSoStatus(so.soId, "Chờ vận chuyển", token);

          const doRequest = {
            soId: so.soId,
            status: "Chờ xác nhận",
          };

          await createDeliveryOrder(doRequest, token);
        } catch (soError) {
          alert("Cập nhật SO thất bại!");
        }
      }

      try {
        await Promise.all(
          ticket.issueTicketDetails.map((detail) =>
            Promise.all([
              decreaseQuantity(
                {
                  warehouseId: ticket.warehouseId,
                  itemId: detail.itemId,
                  quantity: detail.quantity,
                },
                token
              ),
              decreaseOnDemand(
                {
                  warehouseId: ticket.warehouseId,
                  itemId: detail.itemId,
                  onDemandQuantity: detail.quantity,
                },
                token
              ),
            ])
          )
        );
      } catch (inventoryError) {
        alert("Cập nhật tồn kho thất bại!");
      }

      alert("Xuất kho thành công!");
      setTicket((prev) => ({
        ...prev,
        status: "Đã hoàn thành",
        issueDate: now,
      }));
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra khi xuất kho!");
    }
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

  if (!ticket) return <LoadingPaper title="THÔNG TIN PHIẾU XUẤT KHO" />;

  const paginatedDetails =
    ticket.issueTicketDetails?.slice(
      (page - 1) * rowsPerPage,
      (page - 1) * rowsPerPage + rowsPerPage
    ) || [];

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          THÔNG TIN PHIẾU XUẤT KHO
        </Typography>

        <Box mt={3} mb={3} display="flex" justifyContent="flex-end" gap={2}>
          {ticket.status === "Chờ xác nhận" && (
            <Button variant="contained" color="default" onClick={handleConfirm}>
              Xác nhận
            </Button>
          )}
          {ticket.status === "Chờ xuất kho" && (
            <Button variant="contained" color="warning" onClick={handleIssue}>
              Xuất kho
            </Button>
          )}
        </Box>

        <ItForm ticket={ticket} />

        <Typography variant="h5" mt={3} mb={3}>
          DANH SÁCH HÀNG HÓA XUẤT KHO:
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
      </Paper>
    </Container>
  );
};

export default ItDetail;
