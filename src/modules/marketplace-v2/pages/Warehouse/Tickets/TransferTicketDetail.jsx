import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Box,
  CheckCircle,
  Clock,
  Hash,
  MapPin,
  Package,
  User,
  XCircle
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { StatusTimeline } from '../../../components/timeline';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { useTransferTicketById, useUpdateTransferTicket } from '../../../hooks/useApi';

const getStatusColor = (status) => {
  const colors = {
    'Chờ xác nhận': '#a855f7',
    'Chờ xuất kho': '#3b82f6',
    'Chờ nhập kho': '#f59e0b',
    'Đã hoàn thành': '#10b981',
    'Đã hủy': '#ef4444'
  };
  return colors[status] || '#6b7280';
};

/**
 * Transfer Ticket Detail Page
 * Shows details of a transfer ticket with confirm/cancel actions
 * Layout: Timeline on right side, action buttons in header
 */
const TransferTicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // Fetch ticket data
  const { data: ticket, isLoading, refetch } = useTransferTicketById(id);
  const updateMutation = useUpdateTransferTicket();

  const handleConfirmTicket = () => {
    // Navigate to inventory check page like TtDetail.jsx
    // The inventory check page will handle the actual confirmation after verifying stock
    navigate(`/marketplace-v2/check-inventory/tt/${ticket.ticketId}`);
    setConfirmModalOpen(false);
  };

  const handleCancelTicket = async () => {
    try {
      // Send all required fields to match API validation
      const request = {
        companyId: Number(ticket.companyId),
        fromWarehouseId: Number(ticket.fromWarehouseId),
        toWarehouseId: Number(ticket.toWarehouseId),
        reason: ticket.reason || '',
        status: 'Đã hủy',
        createdBy: ticket.createdBy || '',
        transferTicketDetails: (ticket.transferTicketDetails || []).map(detail => ({
          itemId: detail.itemId,
          quantity: detail.quantity,
          note: detail.note || ''
        }))
      };

      await updateMutation.mutateAsync({
        ticketId: ticket.ticketId,
        request
      });
      toast.success('Đã hủy phiếu chuyển kho');
      setCancelModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error cancelling ticket:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi hủy phiếu');
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
          <p className="text-red-500 mb-4">Không tìm thấy phiếu chuyển kho</p>
          <button onClick={() => navigate(-1)} className="mp-btn mp-btn-secondary">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const canConfirm = ticket.status === 'Chờ xác nhận';
  const canCancel = ticket.status === 'Chờ xác nhận';
  const canEdit = ticket.status === 'Chờ xác nhận';
  const isCancelled = ticket.status === 'Đã hủy';
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
              Chi tiết phiếu chuyển kho
            </h1>
            <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
              {ticket.ticketCode}
            </p>
          </div>
        </div>
        
        {/* Action Buttons in Header */}
        <div className="flex items-center gap-3">
          {canEdit && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/marketplace-v2/warehouse/edit-transfer/${ticket.ticketId}`)}
              className="mp-btn mp-btn-secondary"
            >
              <Box size={18} />
              Chỉnh sửa
            </motion.button>
          )}
          {canConfirm && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setConfirmModalOpen(true)}
              className="mp-btn mp-btn-primary"
              style={{ backgroundColor: '#3b82f6' }}
            >
              <CheckCircle size={18} />
              Xác nhận phiếu
            </motion.button>
          )}
          {canCancel && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCancelModalOpen(true)}
              className="mp-btn"
              style={{ backgroundColor: '#ef4444', color: 'white' }}
            >
              <XCircle size={18} />
              Hủy phiếu
            </motion.button>
          )}
          {isCompleted && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: '#10b98120' }}>
              <CheckCircle size={18} style={{ color: '#10b981' }} />
              <span className="font-medium" style={{ color: '#10b981' }}>Đã hoàn thành</span>
            </div>
          )}
          {isCancelled && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: '#ef444420' }}>
              <XCircle size={18} style={{ color: '#ef4444' }} />
              <span className="font-medium" style={{ color: '#ef4444' }}>Đã hủy</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Cancelled Banner */}
      {isCancelled && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mp-glass-card p-4 flex items-center gap-4"
          style={{ backgroundColor: '#fef2f2', borderColor: '#ef4444' }}
        >
          <XCircle size={24} className="text-red-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-500">Phiếu đã bị hủy</p>
            <p className="text-sm text-red-400">Phiếu này đã bị hủy và không thể thực hiện thao tác nào khác.</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Transfer Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mp-glass-card p-6"
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
              Thông tin chuyển kho
            </h2>
            
            {/* Transfer Flow Visualization */}
            <div className="flex items-center justify-center gap-4 p-6 rounded-xl mb-6" style={{ backgroundColor: 'var(--mp-bg-secondary)' }}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
                  <MapPin size={24} className="text-red-500" />
                </div>
                <p className="font-semibold" style={{ color: 'var(--mp-text-primary)' }}>
                  {ticket.fromWarehouseCode}
                </p>
                <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
                  {ticket.fromWarehouseName}
                </p>
              </div>
              <div className="flex-shrink-0">
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight size={32} style={{ color: 'var(--mp-text-tertiary)' }} />
                </motion.div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                  <MapPin size={24} className="text-green-500" />
                </div>
                <p className="font-semibold" style={{ color: 'var(--mp-text-primary)' }}>
                  {ticket.toWarehouseCode}
                </p>
                <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
                  {ticket.toWarehouseName}
                </p>
              </div>
            </div>

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
                <Package size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Số mặt hàng</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {ticket.transferTicketDetails?.length || 0} sản phẩm
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
                <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Lý do chuyển kho</p>
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
                  {(ticket.transferTicketDetails || []).map((detail, index) => (
                    <tr 
                      key={detail.ttdetailId || index} 
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
                    {ticket.transferTicketDetails?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between w-full max-w-xs pt-2 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
                  <span className="text-lg font-semibold" style={{ color: 'var(--mp-text-primary)' }}>Tổng số lượng:</span>
                  <span className="text-xl font-bold text-blue-500">
                    {(ticket.transferTicketDetails || []).reduce((sum, d) => sum + (d.quantity || 0), 0)}
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
              type="transferTicket"
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
        title="Xác nhận phiếu chuyển kho"
        message="Bạn có chắc chắn muốn xác nhận phiếu chuyển kho này? Hệ thống sẽ chuyển đến trang kiểm kê kho để xác nhận tồn kho thực tế."
        confirmText="Xác nhận"
        variant="primary"
      />

      {/* Cancel Modal */}
      <ConfirmModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelTicket}
        title="Hủy phiếu chuyển kho"
        message="Bạn có chắc chắn muốn hủy phiếu chuyển kho này? Hành động này không thể hoàn tác."
        confirmText="Hủy phiếu"
        variant="danger"
        loading={updateMutation.isPending}
      />
    </div>
  );
};

export default TransferTicketDetail;
