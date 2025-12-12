import { motion } from 'framer-motion';
import {
    ArrowLeft,
    ArrowRight,
    Box,
    Calendar,
    CheckCircle,
    Clock,
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

// Transfer Ticket Status Steps
const transferTicketStatusSteps = [
  { key: 'Chờ xác nhận', label: 'Chờ xác nhận', icon: Clock },
  { key: 'Chờ xuất kho', label: 'Chờ xuất kho', icon: Package },
  { key: 'Chờ nhập kho', label: 'Chờ nhập kho', icon: Package },
  { key: 'Đã hoàn thành', label: 'Đã hoàn thành', icon: CheckCircle },
];

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
 */
const TransferTicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // Fetch ticket data
  const { data: ticket, isLoading, refetch } = useTransferTicketById(id);
  const updateMutation = useUpdateTransferTicket();

  const handleConfirmTicket = async () => {
    try {
      await updateMutation.mutateAsync({
        ticketId: ticket.ticketId,
        request: { status: 'Chờ xuất kho' }
      });
      toast.success('Đã xác nhận phiếu chuyển kho');
      setConfirmModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error confirming ticket:', error);
      toast.error('Có lỗi xảy ra khi xác nhận phiếu');
    }
  };

  const handleCancelTicket = async () => {
    try {
      await updateMutation.mutateAsync({
        ticketId: ticket.ticketId,
        request: { status: 'Đã hủy' }
      });
      toast.success('Đã hủy phiếu chuyển kho');
      setCancelModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error cancelling ticket:', error);
      toast.error('Có lỗi xảy ra khi hủy phiếu');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-64" />
        <div className="mp-glass-card p-6 h-64" />
        <div className="mp-glass-card p-6 h-48" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-6xl mx-auto">
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="mp-glass-button p-2 rounded-xl"
        >
          <ArrowLeft size={20} style={{ color: 'var(--mp-text-secondary)' }} />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>
            Chi tiết phiếu chuyển kho
          </h1>
          <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
            {ticket.ticketCode}
          </p>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: '#3b82f620' }}>
          <Package size={20} style={{ color: '#3b82f6' }} />
          <span className="font-medium" style={{ color: '#3b82f6' }}>Chuyển kho</span>
        </div>
      </motion.div>

      {/* Status Timeline */}
      {!isCancelled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mp-glass-card p-6"
        >
          <StatusTimeline
            steps={transferTicketStatusSteps}
            currentStatus={ticket.status}
            type="transferTicket"
          />
        </motion.div>
      )}

      {/* Cancelled Banner */}
      {isCancelled && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mp-glass-card p-6 flex items-center gap-4"
          style={{ backgroundColor: '#fef2f2', borderColor: '#ef4444' }}
        >
          <XCircle size={32} className="text-red-500" />
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
            transition={{ delay: 0.15 }}
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
                <User size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Người tạo</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {ticket.createdBy}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Ngày tạo</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {new Date(ticket.createdOn).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
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
            transition={{ delay: 0.2 }}
            className="mp-glass-card p-6"
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
              Danh sách hàng hóa
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--mp-border-light)' }}>
                    <th className="py-3 px-2 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Mã SP</th>
                    <th className="py-3 px-2 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Tên sản phẩm</th>
                    <th className="py-3 px-2 text-right font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Số lượng</th>
                    <th className="py-3 px-2 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {(ticket.transferTicketDetails || []).map((d, index) => (
                    <tr 
                      key={index} 
                      className="border-b"
                      style={{ borderColor: 'var(--mp-border-light)' }}
                    >
                      <td className="py-3 px-2" style={{ color: 'var(--mp-text-secondary)' }}>{d.itemCode}</td>
                      <td className="py-3 px-2 font-medium" style={{ color: 'var(--mp-text-primary)' }}>{d.itemName}</td>
                      <td className="py-3 px-2 text-right font-semibold" style={{ color: 'var(--mp-text-primary)' }}>{d.quantity}</td>
                      <td className="py-3 px-2" style={{ color: 'var(--mp-text-tertiary)' }}>{d.note || '---'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="mp-glass-card p-6"
          >
            <h3 className="font-semibold mb-3" style={{ color: 'var(--mp-text-primary)' }}>
              Trạng thái
            </h3>
            <span 
              className="inline-block px-4 py-2 rounded-full text-sm font-medium"
              style={{ 
                backgroundColor: `${getStatusColor(ticket.status)}20`,
                color: getStatusColor(ticket.status)
              }}
            >
              {ticket.status}
            </span>
          </motion.div>

          {/* Actions */}
          {(canConfirm || canCancel || canEdit) && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mp-glass-card p-6 space-y-3"
            >
              <h3 className="font-semibold mb-3" style={{ color: 'var(--mp-text-primary)' }}>
                Thao tác
              </h3>
              {canEdit && (
                <button
                  onClick={() => navigate(`/marketplace-v2/warehouse/edit-transfer/${ticket.ticketId}`)}
                  className="w-full mp-btn mp-btn-secondary justify-center"
                >
                  <Box size={18} />
                  Chỉnh sửa
                </button>
              )}
              {canConfirm && (
                <button
                  onClick={() => setConfirmModalOpen(true)}
                  className="w-full mp-btn mp-btn-primary justify-center"
                  style={{ backgroundColor: '#3b82f6' }}
                >
                  <CheckCircle size={18} />
                  Xác nhận phiếu
                </button>
              )}
              {canCancel && (
                <button
                  onClick={() => setCancelModalOpen(true)}
                  className="w-full mp-btn justify-center"
                  style={{ backgroundColor: '#ef4444', color: 'white' }}
                >
                  <XCircle size={18} />
                  Hủy phiếu
                </button>
              )}
            </motion.div>
          )}

          {/* Completed Badge */}
          {ticket.status === 'Đã hoàn thành' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mp-glass-card p-6 text-center"
              style={{ backgroundColor: '#10b98110', borderColor: '#10b981' }}
            >
              <CheckCircle size={48} className="mx-auto mb-2" style={{ color: '#10b981' }} />
              <p className="font-semibold" style={{ color: '#10b981' }}>Đã hoàn thành chuyển kho</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmTicket}
        title="Xác nhận phiếu chuyển kho"
        message="Bạn có chắc chắn muốn xác nhận phiếu chuyển kho này? Sau khi xác nhận, hệ thống sẽ tạo phiếu xuất kho và phiếu nhập kho tương ứng."
        confirmText="Xác nhận"
        variant="primary"
        loading={updateMutation.isPending}
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
