import BackButton from "@/components/common/BackButton";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import { Button } from "@/components/ui/button";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import {
  getTransferTicketById,
  updateTransferTicket,
} from "@/services/inventory/TransferTicketService";
import toastrService from "@/services/toastrService";
import { Check, Edit, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TtDetail = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    onConfirm: null,
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTicket = async () => {
      setLoading(true);
      try {
        const data = await getTransferTicketById(ticketId, token);
        setTicket(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Lỗi khi tải phiếu chuyển kho!"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [ticketId, token]);

  const handleEditClick = () => {
    if (ticket.status === "Chờ xác nhận") {
      navigate(`/transfer-ticket/${ticket.ticketId}/edit`);
    } else {
      toastrService.warning(
        "Chỉ phiếu chuyển kho ở trạng thái 'Chờ xác nhận' mới được chỉnh sửa!"
      );
    }
  };

  const handleCancel = async () => {
    try {
      const request = {
        companyId: parseInt(ticket.companyId),
        status: 'Đã hủy',
        reason: ticket.reason,
        fromWarehouseId: parseInt(ticket.fromWarehouseId),
        toWarehouseId: parseInt(ticket.toWarehouseId),
        createdBy: ticket.createdBy,
        transferTicketDetails: (ticket.transferTicketDetails || []).map(d => ({
          itemId: parseInt(d.itemId),
          quantity: parseFloat(d.quantity),
          note: d.note || ''
        }))
      };
      await updateTransferTicket(ticketId, request, token);
      toastrService.success('Đã hủy phiếu chuyển kho!');

      setTicket((prev) => ({
        ...prev,
        status: 'Đã hủy',
      }));
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || 'Có lỗi khi hủy phiếu chuyển kho!'
      );
    }
  };

  const handleConfirm = (type, id) => {
    navigate(`/check-inventory/${type}/${id}`);
  };

  const columns = [
    {
      accessorKey: "itemCode",
      header: createSortableHeader("Mã hàng hóa"),
      cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>
    },
    {
      accessorKey: "itemName",
      header: createSortableHeader("Tên hàng hóa"),
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

  if (loading || !ticket) return <LoadingPaper title="THÔNG TIN PHIẾU CHUYỂN KHO" />;

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
                onClick={() => navigate("/transfer-tickets")}
              >
                Danh sách
              </span>
              <span>/</span>
              <span className="text-gray-900 font-medium">
                Chi tiết phiếu chuyển
              </span>
            </div>

            <div className="flex items-center gap-3">
              {ticket.status === "Chờ xác nhận" && (
                <>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleConfirm("tt", ticket.ticketId)}
                  >
                    Xác nhận phiếu
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-200 text-gray-700 hover:bg-gray-50"
                    onClick={handleEditClick}
                  >
                    Chỉnh sửa
                  </Button>
                  <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() =>
                      setConfirmDialog({
                        open: true,
                        onConfirm: handleCancel,
                      })
                    }
                  >
                    Hủy phiếu
                  </Button>
                </>
              )}
              <BackButton to="/transfer-tickets" label="Trở lại" />
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
                      ticket.status === 'Chờ xác nhận' ? 'bg-purple-100 text-purple-700' :
                        ticket.status === 'Đã hủy' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                      }`}>
                      {ticket.status}
                    </div>
                  </div>

                  <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100">
                    <InfoRow label="Kho xuất" value={`${ticket.fromWarehouseName} (${ticket.fromWarehouseCode})`} />
                    <InfoRow label="Kho nhập" value={`${ticket.toWarehouseName} (${ticket.toWarehouseCode})`} />
                    <InfoRow label="Lý do" value={ticket.reason} />
                    <InfoRow label="Người tạo" value={ticket.createdBy} />
                    <InfoRow label="Ngày tạo" value={ticket.createdOn ? new Date(ticket.createdOn).toLocaleString() : ""} />
                    <InfoRow label="Cập nhật cuối" value={ticket.lastUpdatedOn ? new Date(ticket.lastUpdatedOn).toLocaleString() : ""} />
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
                  data={ticket.transferTicketDetails || []}
                  emptyMessage="Không có hàng hóa nào trong phiếu này"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, onConfirm: null })}
        onConfirm={confirmDialog.onConfirm || (() => { })}
        title="Xác nhận hủy"
        message="Bạn có chắc chắn muốn hủy phiếu chuyển kho này không?"
        confirmText="Xác nhận"
        cancelText="Hủy"
        confirmButtonProps="danger"
      />
    </div>
  );
};

export default TtDetail;
