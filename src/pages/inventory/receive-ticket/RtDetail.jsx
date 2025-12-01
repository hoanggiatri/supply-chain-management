import React, { useEffect, useState } from "react";
import { Typography, Card, CardBody, Button } from "@material-tailwind/react";
import { useParams, useNavigate } from "react-router-dom";
import DataTable from "@/components/content-components/DataTable";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import RtForm from "@/components/inventory/RtForm";
import BackButton from "@/components/common/BackButton";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { getButtonProps } from "@/utils/buttonStyles";
import {
  getReceiveTicketById,
  updateReceiveTicket,
} from "@/services/inventory/ReceiveTicketService";
import { getMoById, updateMo } from "@/services/manufacturing/MoService";
import { increaseQuantity } from "@/services/inventory/InventoryService";
import {
  getTransferTicketById,
  updateTransferTicket,
} from "@/services/inventory/TransferTicketService";
import { updatePoStatus } from "@/services/purchasing/PoService";
import toastrService from "@/services/toastrService";

const RtDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null, // 'confirm' or 'receive'
    onConfirm: null,
  });
  const [showMoNavigateButton, setShowMoNavigateButton] = useState(false);

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
        setTicket(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Không thể lấy dữ liệu phiếu nhập."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ticketId, token]);

  const handleConfirm = async () => {
    const token = localStorage.getItem("token");
    const employeeName = localStorage.getItem("employeeName");

    try {
      // Only send allowed fields, exclude read-only and computed fields
      await updateReceiveTicket(
        ticket.ticketId,
        {
          companyId: Number(ticket.companyId),
          warehouseId: Number(ticket.warehouseId),
          reason: ticket.reason,
          receiveType: ticket.receiveType,
          referenceCode: ticket.referenceCode,
          status: "Chờ nhập kho",
          receiveDate: ticket.receiveDate,
          createdBy: employeeName,
        },
        token
      );

      toastrService.success("Xác nhận phiếu nhập kho thành công!");
      setTicket((prev) => ({
        ...prev,
        status: "Chờ nhập kho",
        createdBy: employeeName,
      }));
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi xảy ra khi xác nhận phiếu!"
      );
    }
  };

  const handleReceive = async () => {
    const token = localStorage.getItem("token");

    try {
      const receiveDateISO = new Date().toISOString();

      if (ticket.receiveType === "Sản xuất" && ticket.referenceId) {
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
              status: "Đã nhập kho",
            },
            token
          );
          setShowMoNavigateButton(true);
        } catch (moError) {
          toastrService.error("Cập nhật MO thất bại!");
        }
      }

      if (ticket.receiveType === "Chuyển kho" && ticket.referenceId) {
        try {
          const transferTicket = await getTransferTicketById(
            ticket.referenceId,
            token
          );
          await updateTransferTicket(
            ticket.referenceId,
            {
              ...transferTicket,
              status: "Đã hoàn thành",
            },
            token
          );
        } catch (transferError) {
          toastrService.error("Cập nhật phiếu chuyển kho thất bại!");
        }
      }

      if (ticket.receiveType === "Mua hàng" && ticket.referenceId) {
        try {
          await updatePoStatus(ticket.referenceId, "Đã hoàn thành", token);
        } catch (poError) {
          toastrService.error("Cập nhật đơn mua hàng thất bại!");
        }
      }

      try {
        await Promise.all(
          ticket.receiveTicketDetails.map((detail) =>
            increaseQuantity(
              {
                warehouseId: ticket.warehouseId,
                itemId: detail.itemId,
                quantity: detail.quantity,
              },
              token
            )
          )
        );

        // Only send allowed fields, exclude read-only and computed fields
        await updateReceiveTicket(
          ticket.ticketId,
          {
            companyId: Number(ticket.companyId),
            warehouseId: Number(ticket.warehouseId),
            reason: ticket.reason || "",
            receiveType: ticket.receiveType || "",
            referenceCode: ticket.referenceCode || "",
            status: "Đã hoàn thành",
            receiveDate: receiveDateISO,
            createdBy: ticket.createdBy || "",
          },
          token
        );

        toastrService.success("Nhập kho thành công!");
        setTicket((prev) => ({
          ...prev,
          status: "Đã hoàn thành",
          receiveDate: receiveDateISO,
        }));
      } catch (inventoryError) {
        toastrService.error("Cập nhật tồn kho thất bại!");
      }
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi xảy ra khi nhập kho!"
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

  const paginatedDetails =
    ticket?.receiveTicketDetails.slice(
      (page - 1) * rowsPerPage,
      (page - 1) * rowsPerPage + rowsPerPage
    ) || [];

  if (!ticket) return <LoadingPaper title="THÔNG TIN PHIẾU NHẬP KHO" />;

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              THÔNG TIN PHIẾU NHẬP KHO
            </Typography>
            <BackButton to="/receive-tickets" label="Quay lại danh sách" />
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
            {ticket.status === "Chờ nhập kho" && (
              <Button
                {...getButtonProps("warning")}
                onClick={() =>
                  setConfirmDialog({
                    open: true,
                    type: "receive",
                    onConfirm: handleReceive,
                  })
                }
              >
                Nhập kho
              </Button>
            )}
            {showMoNavigateButton && ticket.receiveType === "Sản xuất" && ticket.referenceId && (
              <Button
                {...getButtonProps("success")}
                onClick={() => navigate(`/mo/${ticket.referenceId}`)}
              >
                Quay về công lệnh sản xuất
              </Button>
            )}
          </div>

          <RtForm ticket={ticket} />

          <Typography variant="h5" className="mt-6 mb-4 font-semibold">
            DANH SÁCH HÀNG HÓA NHẬP KHO:
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
            ? "Bạn có chắc muốn xác nhận phiếu nhập kho này không?"
            : "Bạn có chắc muốn nhập kho không?"
        }
        confirmText="Xác nhận"
        cancelText="Hủy"
      />
    </div>
  );
};

export default RtDetail;
