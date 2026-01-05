import BackButton from "@/components/common/BackButton";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import { Button } from "@/components/ui/button";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { increaseQuantity } from "@/services/inventory/InventoryService";
import {
  getReceiveTicketById,
  updateReceiveTicket,
} from "@/services/inventory/ReceiveTicketService";
import {
  getTransferTicketById,
  updateTransferTicket,
} from "@/services/inventory/TransferTicketService";
import { getMoById, updateMo } from "@/services/manufacturing/MoService";
import { updatePoStatus } from "@/services/purchasing/PoService";
import toastrService from "@/services/toastrService";
import { Factory } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const RtDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null, // 'confirm' or 'receive'
    onConfirm: null,
  });
  const [showMoNavigateButton, setShowMoNavigateButton] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTicket = async () => {
      if (!ticketId) return;
      try {
        const data = await getReceiveTicketById(ticketId, token);
        setTicket(data);

        if (
          data.receiveType === "Sản xuất" &&
          data.status === "Đã hoàn thành"
        ) {
          setShowMoNavigateButton(true);
        } else {
          setShowMoNavigateButton(false);
        }
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Không thể lấy dữ liệu phiếu nhập."
        );
      }
    };
    fetchTicket();
  }, [ticketId, token]);

  const handleConfirm = async () => {
    const employeeName = localStorage.getItem("employeeName");

    try {
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
    try {
      const receiveDateISO = new Date().toISOString();

      if (ticket.receiveType === "Sản xuất" && ticket.referenceId) {
        try {
          const mo = await getMoById(ticket.referenceId, token);
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
              status: "Đã hoàn thành",
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
              companyId: Number(transferTicket.companyId),
              fromWarehouseId: Number(transferTicket.fromWarehouseId),
              toWarehouseId: Number(transferTicket.toWarehouseId),
              reason: transferTicket.reason || "",
              createdBy: transferTicket.createdBy || "",
              status: "Đã hoàn thành",
              file: transferTicket.file || "",
              transferTicketDetails: (transferTicket.transferTicketDetails || []).map(detail => ({
                itemId: Number(detail.itemId),
                quantity: Number(detail.quantity),
                note: detail.note || ""
              }))
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
    {
      accessorKey: "itemCode",
      header: createSortableHeader("Mã NVL"),
      cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>
    },
    {
      accessorKey: "itemName",
      header: createSortableHeader("Tên NVL"),
    },
    {
      accessorKey: "quantity",
      header: createSortableHeader("Số lượng"),
      cell: ({ getValue }) => <span className="font-semibold text-blue-600">{getValue()}</span>
    },
    {
      accessorKey: "note",
      header: createSortableHeader("Ghi chú"),
      cell: ({ getValue }) => <span className="text-gray-500 italic">{getValue()}</span>
    },
  ];

  if (!ticket) return <LoadingPaper title="THÔNG TIN PHIẾU NHẬP KHO" />;

  const InfoRow = ({ label, value, className = "" }) => (
    <div className="flex items-start py-3 border-b border-gray-50 last:border-0">
      <span className="text-gray-500 w-40 flex-shrink-0 text-sm font-medium">{label}</span>
      <span className={`text-gray-900 text-sm flex-1 ${className}`}>
        {value || "---"}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span
                className="cursor-pointer hover:text-blue-600"
                onClick={() => navigate("/receive-tickets")}
              >
                Danh sách
              </span>
              <span>/</span>
              <span className="text-gray-900 font-medium">
                Chi tiết phiếu nhập
              </span>
            </div>

            <div className="flex items-center gap-3">
              {ticket.status === "Chờ xác nhận" && (
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() =>
                    setConfirmDialog({
                      open: true,
                      type: "confirm",
                      onConfirm: handleConfirm,
                    })
                  }
                >
                  Xác nhận phiếu
                </Button>
              )}
              {ticket.status === "Chờ nhập kho" && (
                <Button
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={() =>
                    setConfirmDialog({
                      open: true,
                      type: "receive",
                      onConfirm: handleReceive,
                    })
                  }
                >
                  Thực hiện nhập kho
                </Button>
              )}
              {showMoNavigateButton &&
                ticket.receiveType === "Sản xuất" &&
                ticket.referenceId && (
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                    onClick={() => navigate(`/mo/${ticket.referenceId}`)}
                  >
                    <Factory className="w-4 h-4" /> Xem Công lệnh sản xuất
                  </Button>
                )}
              <BackButton to="/receive-tickets" label="Trở lại" />
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col gap-8">
              {/* Info Section */}
              <div className="flex flex-col gap-8">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      {ticket.ticketCode}
                    </h1>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${ticket.status === 'Đã hoàn thành' ? 'bg-green-100 text-green-700' :
                      ticket.status === 'Chờ nhập kho' ? 'bg-orange-100 text-orange-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                      {ticket.status}
                    </div>
                  </div>

                  <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100">
                    <InfoRow label="Mã tham chiếu" value={ticket.referenceCode} className="font-mono text-blue-600" />
                    <InfoRow label="Kho nhập" value={`${ticket.warehouseName} (${ticket.warehouseCode})`} />
                    <InfoRow label="Loại nhập kho" value={ticket.receiveType} />
                    <InfoRow label="Lý do" value={ticket.reason} />
                    <InfoRow label="Người tạo" value={ticket.createdBy} />
                    <InfoRow label="Ngày nhập" value={ticket.receiveDate ? new Date(ticket.receiveDate).toLocaleString() : ""} />
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  Danh sách hàng hóa
                </h2>
                <DataTable
                  columns={columns}
                  data={ticket.receiveTicketDetails || []}
                  emptyMessage="Không có hàng hóa nào trong phiếu này"
                />
              </div>

            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() =>
          setConfirmDialog({ open: false, type: null, onConfirm: null })
        }
        onConfirm={confirmDialog.onConfirm || (() => { })}
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
