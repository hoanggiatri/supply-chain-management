import React, { useEffect, useState } from "react";
import { Typography, Card, CardBody, Button } from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import DataTable from "@/components/content-components/DataTable";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import ItForm from "@/components/inventory/ItForm";
import BackButton from "@/components/common/BackButton";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { getButtonProps } from "@/utils/buttonStyles";
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
import toastrService from "@/services/toastrService";

const ItDetail = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null, // 'confirm' or 'issue'
    onConfirm: null,
  });

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
        toastrService.error(
          error.response?.data?.message || "Không thể lấy dữ liệu phiếu xuất."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ticketId, token]);

  const handleConfirm = async () => {
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
      toastrService.success("Xác nhận phiếu xuất kho thành công!");
      setTicket((prev) => ({
        ...prev,
        status: "Chờ xuất kho",
        createdBy: employeeName,
      }));
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi xảy ra khi xác nhận phiếu!"
      );
    }
  };

  const handleIssue = async () => {
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
          // Only send allowed fields, exclude read-only and computed fields
          const toISO8601String = (dateString) => {
            if (!dateString) return null;
            return new Date(dateString).toISOString();
          };

          await updateMo(
            ticket.referenceId,
            {
              itemId: Number(mo.itemId),
              lineId: Number(mo.lineId),
              type: mo.type,
              quantity: mo.quantity,
              estimatedStartTime: toISO8601String(mo.estimatedStartTime),
              estimatedEndTime: toISO8601String(mo.estimatedEndTime),
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
          toastrService.error("Cập nhật MO thất bại!");
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
          toastrService.error("Cập nhật phiếu chuyển kho thất bại!");
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
          toastrService.error("Cập nhật SO thất bại!");
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
        toastrService.error("Cập nhật tồn kho thất bại!");
      }

      toastrService.success("Xuất kho thành công!");
      setTicket((prev) => ({
        ...prev,
        status: "Đã hoàn thành",
        issueDate: now,
      }));
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi xảy ra khi xuất kho!"
      );
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
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              THÔNG TIN PHIẾU XUẤT KHO
            </Typography>
            <BackButton to="/issue-tickets" label="Quay lại danh sách" />
          </div>

          <div className="flex justify-end gap-2 mb-6">
            {ticket.status === "Chờ xác nhận" && (
              <Button
                {...getButtonProps("primary")}
                onClick={() =>
                  setConfirmDialog({
                    open: true,
                    type: "confirm",
                    onConfirm: handleConfirm,
                  })
                }
              >
                Xác nhận
              </Button>
            )}
            {ticket.status === "Chờ xuất kho" && (
              <Button
                {...getButtonProps("warning")}
                onClick={() =>
                  setConfirmDialog({
                    open: true,
                    type: "issue",
                    onConfirm: handleIssue,
                  })
                }
              >
                Xuất kho
              </Button>
            )}
          </div>

          <ItForm ticket={ticket} />

          <Typography variant="h5" className="mt-6 mb-4 font-semibold">
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
            renderRow={(detail, index) => {
              const isLast = index === paginatedDetails.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";
              return (
                <tr key={index}>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.itemCode || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.itemName || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.quantity || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.note || ""}
                    </Typography>
                  </td>
                </tr>
              );
            }}
          />
        </CardBody>
      </Card>

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() =>
          setConfirmDialog({ open: false, type: null, onConfirm: null })
        }
        onConfirm={confirmDialog.onConfirm || (() => {})}
        title="Xác nhận"
        message={
          confirmDialog.type === "confirm"
            ? "Bạn có chắc muốn xác nhận phiếu xuất kho này không?"
            : "Bạn có chắc muốn xuất kho không?"
        }
        confirmText="Xác nhận"
        cancelText="Hủy"
      />
    </div>
  );
};

export default ItDetail;
