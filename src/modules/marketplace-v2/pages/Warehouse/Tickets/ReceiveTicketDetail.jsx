import { increaseQuantity } from '@/services/inventory/InventoryService';
import { getTransferTicketById, updateTransferTicket } from '@/services/inventory/TransferTicketService';
import { getMoById, updateMo } from '@/services/manufacturing/MoService';
import { updatePoStatus } from '@/services/purchasing/PoService';
import { motion } from 'framer-motion';
import {
    ArrowDownToLine,
    ArrowLeft,
    Box,
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    Hash,
    MapPin,
    Package,
    User
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { StatusTimeline } from '../../../components/timeline';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { useReceiveTicketById, useUpdateReceiveTicket } from '../../../hooks/useApi';

/**
 * Receive Ticket Detail Page
 * Shows details of a receive ticket with confirm/receive actions
 * Layout: Timeline on right side, action buttons in header
 */
const ReceiveTicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [showMoNavigateButton, setShowMoNavigateButton] = useState(false);

  // Fetch ticket data
  const { data: ticket, isLoading, refetch } = useReceiveTicketById(id);
  const updateMutation = useUpdateReceiveTicket();

  const handleConfirmTicket = async () => {
    try {
      const employeeName = localStorage.getItem('employeeName');
      
      // Format receiveDate to ISO 8601 if it exists
      let receiveDate = null;
      if (ticket.receiveDate) {
        receiveDate = new Date(ticket.receiveDate).toISOString();
      }

      // Send all required fields to match API validation
      const request = {
        companyId: Number(ticket.companyId),
        warehouseId: Number(ticket.warehouseId),
        reason: ticket.reason || '',
        receiveType: ticket.receiveType || 'Nhập mua hàng',
        referenceCode: ticket.referenceCode || '',
        status: 'Chờ nhập kho',
        receiveDate: receiveDate,
        createdBy: employeeName || ticket.createdBy || '',
      };

      await updateMutation.mutateAsync({
        ticketId: ticket.ticketId,
        request
      });
      toast.success('Đã xác nhận phiếu nhập kho');
      setConfirmModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error confirming ticket:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xác nhận phiếu');
    }
  };

  const handleReceiveStock = async () => {
    try {
      const token = localStorage.getItem('token');
      const receiveDateISO = new Date().toISOString();

      // Handle different receive types
      if (ticket.receiveType === 'Sản xuất' && ticket.referenceId) {
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
              status: 'Đã nhập kho',
            },
            token
          );
          setShowMoNavigateButton(true);
        } catch (moError) {
          console.error('Error updating MO:', moError);
          toast.error('Cập nhật MO thất bại!');
        }
      }

      if (ticket.receiveType === 'Chuyển kho' && ticket.referenceId) {
        try {
          const transferTicket = await getTransferTicketById(ticket.referenceId, token);
          await updateTransferTicket(
            ticket.referenceId,
            {
              companyId: Number(transferTicket.companyId),
              fromWarehouseId: Number(transferTicket.fromWarehouseId),
              toWarehouseId: Number(transferTicket.toWarehouseId),
              reason: transferTicket.reason || '',
              createdBy: transferTicket.createdBy || '',
              status: 'Đã hoàn thành',
              file: transferTicket.file || '',
              transferTicketDetails: (transferTicket.transferTicketDetails || []).map(detail => ({
                itemId: Number(detail.itemId),
                quantity: Number(detail.quantity),
                note: detail.note || ''
              }))
            },
            token
          );
        } catch (transferError) {
          console.error('Error updating transfer ticket:', transferError);
          toast.error('Cập nhật phiếu chuyển kho thất bại!');
        }
      }

      if (ticket.receiveType === 'Mua hàng' && ticket.referenceId) {
        try {
          await updatePoStatus(ticket.referenceId, 'Đã hoàn thành', token);
        } catch (poError) {
          console.error('Error updating PO status:', poError);
          toast.error('Cập nhật đơn mua hàng thất bại!');
        }
      }

      // Increase inventory quantity for all items
      try {
        await Promise.all(
          (ticket.receiveTicketDetails || []).map((detail) =>
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
      } catch (inventoryError) {
        console.error('Error updating inventory:', inventoryError);
        toast.error('Cập nhật tồn kho thất bại!');
        return;
      }

      // Update receive ticket status
      const request = {
        companyId: Number(ticket.companyId),
        warehouseId: Number(ticket.warehouseId),
        reason: ticket.reason || '',
        receiveType: ticket.receiveType || '',
        referenceCode: ticket.referenceCode || '',
        status: 'Đã hoàn thành',
        receiveDate: receiveDateISO,
        createdBy: ticket.createdBy || '',
      };

      await updateMutation.mutateAsync({
        ticketId: ticket.ticketId,
        request
      });
      toast.success('Nhập kho thành công!');
      setReceiveModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error receiving stock:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi nhập kho');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-8xl mx-auto animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-64" />
        <div className="mp-glass-card p-6 h-64" />
        <div className="mp-glass-card p-6 h-48" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-8xl mx-auto">
        <div className="mp-glass-card p-8 text-center">
          <p className="text-red-500 mb-4">Không tìm thấy phiếu nhập kho</p>
          <button onClick={() => navigate(-1)} className="mp-btn mp-btn-secondary">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const canConfirm = ticket.status === 'Chờ xác nhận';
  const canReceive = ticket.status === 'Chờ nhập kho';
  const isCompleted = ticket.status === 'Đã hoàn thành';

  return (
    <div className="max-w-8xl mx-auto space-y-6">
      {/* Header with Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="mp-glass-button p-2 rounded-xl"
          >
            <ArrowLeft size={20} style={{ color: 'var(--mp-text-secondary)' }} />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>
              Chi tiết phiếu nhập kho
            </h1>
            <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
              {ticket.ticketCode}
            </p>
          </div>
        </div>
        
        {/* Action Buttons in Header */}
        <div className="flex items-center gap-3">
          {canConfirm && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setConfirmModalOpen(true)}
              className="mp-btn mp-btn-primary"
              style={{ backgroundColor: '#a855f7' }}
            >
              <CheckCircle size={18} />
              Xác nhận phiếu
            </motion.button>
          )}
          {canReceive && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setReceiveModalOpen(true)}
              className="mp-btn"
              style={{ backgroundColor: '#22c55e', color: 'white' }}
            >
              <ArrowDownToLine size={18} />
              Nhập kho
            </motion.button>
          )}
          {isCompleted && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: '#10b98120' }}>
                <CheckCircle size={18} style={{ color: '#10b981' }} />
                <span className="font-medium" style={{ color: '#10b981' }}>Đã hoàn thành</span>
              </div>
              {showMoNavigateButton && ticket.referenceId && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/marketplace-v2/manufacturing/mo/${ticket.referenceId}`)}
                  className="mp-btn mp-btn-secondary"
                >
                  Xem lệnh sản xuất
                </motion.button>
              )}
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mp-glass-card p-6"
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
              Thông tin chung
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Hash size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Mã phiếu</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {ticket.ticketCode}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Kho nhập</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {ticket.warehouseName} ({ticket.warehouseCode})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Box size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Loại nhập kho</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {ticket.receiveType || 'Nhập mua hàng'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Mã tham chiếu</p>
                  <p className="font-medium text-blue-500">
                    {ticket.referenceCode || '---'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Ngày nhập</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {ticket.receiveDate ? new Date(ticket.receiveDate).toLocaleString('vi-VN') : 'Chưa nhập'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Package size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Số mặt hàng</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {ticket.receiveTicketDetails?.length || 0} sản phẩm
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Người tạo</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {ticket.createdBy || '---'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Ngày tạo</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {ticket.createdOn ? new Date(ticket.createdOn).toLocaleString('vi-VN') : '---'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Reason Section */}
            {ticket.reason && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
                <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Lý do nhập kho</p>
                <p className="font-medium mt-1" style={{ color: 'var(--mp-text-primary)' }}>
                  {ticket.reason}
                </p>
              </div>
            )}
          </motion.div>

          {/* Items List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mp-glass-card p-6"
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
              Danh sách hàng hóa
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--mp-border-light)' }}>
                    <th className="py-3 px-2 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Mã hàng hóa</th>
                    <th className="py-3 px-2 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Tên hàng hóa</th>
                    <th className="py-3 px-2 text-right font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Số lượng</th>
                    <th className="py-3 px-2 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {(ticket.receiveTicketDetails || []).map((detail, index) => (
                    <tr 
                      key={detail.rtdetailId || index} 
                      className="border-b"
                      style={{ borderColor: 'var(--mp-border-light)' }}
                    >
                      <td className="py-3 px-2" style={{ color: 'var(--mp-text-secondary)' }}>{detail.itemCode}</td>
                      <td className="py-3 px-2 font-medium" style={{ color: 'var(--mp-text-primary)' }}>{detail.itemName}</td>
                      <td className="py-3 px-2 text-right font-semibold" style={{ color: 'var(--mp-text-primary)' }}>{detail.quantity}</td>
                      <td className="py-3 px-2" style={{ color: 'var(--mp-text-tertiary)' }}>{detail.note || '---'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-col items-end space-y-2">
                <div className="flex justify-between w-full max-w-xs">
                  <span style={{ color: 'var(--mp-text-secondary)' }}>Tổng số mặt hàng:</span>
                  <span className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {ticket.receiveTicketDetails?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between w-full max-w-xs pt-2 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
                  <span className="text-lg font-semibold" style={{ color: 'var(--mp-text-primary)' }}>Tổng số lượng:</span>
                  <span className="text-xl font-bold text-green-500">
                    {(ticket.receiveTicketDetails || []).reduce((sum, d) => sum + (d.quantity || 0), 0)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Status Timeline */}
        <div className="space-y-6">
          {/* Status Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mp-glass-card p-6"
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
              Trạng thái
            </h2>
            <StatusTimeline
              currentStatus={ticket.status}
              type="receiveTicket"
            />
          </motion.div>

          {/* Last Updated Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="mp-glass-card p-6"
          >
            <h3 className="font-semibold mb-3" style={{ color: 'var(--mp-text-primary)' }}>
              Thông tin cập nhật
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Cập nhật lần cuối</p>
                <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                  {ticket.lastUpdatedOn ? new Date(ticket.lastUpdatedOn).toLocaleString('vi-VN') : '---'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmTicket}
        title="Xác nhận phiếu nhập kho"
        message="Bạn có chắc chắn muốn xác nhận phiếu nhập kho này? Sau khi xác nhận, phiếu sẽ chuyển sang trạng thái 'Chờ nhập kho'."
        confirmText="Xác nhận"
        variant="primary"
        loading={updateMutation.isPending}
      />

      {/* Receive Modal */}
      <ConfirmModal
        isOpen={receiveModalOpen}
        onClose={() => setReceiveModalOpen(false)}
        onConfirm={handleReceiveStock}
        title="Nhập kho"
        message="Bạn có chắc chắn muốn thực hiện nhập kho? Hành động này sẽ cập nhật số lượng tồn kho."
        confirmText="Nhập kho"
        variant="primary"
        loading={updateMutation.isPending}
      />
    </div>
  );
};

export default ReceiveTicketDetail;
