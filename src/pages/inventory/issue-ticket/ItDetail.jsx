import BackButton from "@/components/common/BackButton";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import { Button } from "@/components/ui/button";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { createDeliveryOrder } from "@/services/delivery/DoService";
import {
  decreaseOnDemand,
  decreaseQuantity,
} from "@/services/inventory/InventoryService";
import {
  getIssueTicketById,
  updateIssueTicketStatus,
} from "@/services/inventory/IssueTicketService";
import { createReceiveTicket } from "@/services/inventory/ReceiveTicketService";
import {
  getTransferTicketById,
  updateTransferTicket,
} from "@/services/inventory/TransferTicketService";
import { getMoById, updateMo } from "@/services/manufacturing/MoService";
import {
  getAllProcessesInMo,
  updateProcess,
} from "@/services/manufacturing/ProcessService";
import { getSoById, updateSoStatus } from "@/services/sale/SoService";
import toastrService from "@/services/toastrService";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ItDetail = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null, // 'confirm' or 'issue'
    onConfirm: null,
  });
  const navigate = useNavigate();

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
      let issueDate = null;
      if (ticket.issueDate) {
        issueDate = new Date(ticket.issueDate).toISOString();
      }

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
    const now = new Date().toISOString();
    try {
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

  if (!ticket) return <LoadingPaper title="THÔNG TIN PHIẾU XUẤT KHO" />;

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
                onClick={() => navigate("/issue-tickets")}
              >
                Danh sách
              </span>
              <span>/</span>
              <span className="text-gray-900 font-medium">
                Chi tiết phiếu xuất
              </span>
            </div>

            <div className="flex items-center gap-3">
              {ticket.status === "Chờ xác nhận" && (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
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
              {ticket.status === "Chờ xuất kho" && (
                <Button
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={() =>
                    setConfirmDialog({
                      open: true,
                      type: "issue",
                      onConfirm: handleIssue,
                    })
                  }
                >
                  Thực hiện xuất kho
                </Button>
              )}
              <BackButton to="/issue-tickets" label="Trở lại" />
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
                      ticket.status === 'Chờ xuất kho' ? 'bg-orange-100 text-orange-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                      {ticket.status}
                    </div>
                  </div>

                  <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100">
                    <InfoRow label="Mã tham chiếu" value={ticket.referenceCode} className="font-mono text-blue-600" />
                    <InfoRow label="Kho xuất" value={`${ticket.warehouseName} (${ticket.warehouseCode})`} />
                    <InfoRow label="Loại xuất kho" value={ticket.issueType} />
                    <InfoRow label="Lý do" value={ticket.reason} />
                    <InfoRow label="Người tạo" value={ticket.createdBy} />
                    <InfoRow label="Ngày xuất" value={ticket.issueDate ? new Date(ticket.issueDate).toLocaleString() : ""} />
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
                  data={ticket.issueTicketDetails || []}
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
