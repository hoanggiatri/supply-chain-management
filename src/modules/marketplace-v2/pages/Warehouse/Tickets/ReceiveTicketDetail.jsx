import { motion } from 'framer-motion';
import {
    ArrowDownToLine,
    ArrowLeft,
    Box,
    Calendar,
    CheckCircle,
    Clock,
    FileText,
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

// Receive Ticket Status Steps
const receiveTicketStatusSteps = [
  { key: 'Chờ xác nhận', label: 'Chờ xác nhận', icon: Clock },
  { key: 'Chờ nhập kho', label: 'Chờ nhập kho', icon: Package },
  { key: 'Đã hoàn thành', label: 'Đã hoàn thành', icon: CheckCircle },
];

/**
 * Receive Ticket Detail Page
 * Shows details of a receive ticket with confirm/receive actions
 */
const ReceiveTicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);

  // Fetch ticket data
  const { data: ticket, isLoading, refetch } = useReceiveTicketById(id);
  const updateMutation = useUpdateReceiveTicket();

  const handleConfirmTicket = async () => {
    try {
      await updateMutation.mutateAsync({
        ticketId: ticket.ticketId,
        request: { status: 'Chờ nhập kho' }
      });
      toast.success('Đã xác nhận phiếu nhập kho');
      setConfirmModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error confirming ticket:', error);
      toast.error('Có lỗi xảy ra khi xác nhận phiếu');
    }
  };

  const handleReceiveStock = async () => {
    try {
      await updateMutation.mutateAsync({
        ticketId: ticket.ticketId,
        request: { status: 'Đã hoàn thành' }
      });
      toast.success('Đã nhập kho thành công');
      setReceiveModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error receiving stock:', error);
      toast.error('Có lỗi xảy ra khi nhập kho');
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
            Chi tiết phiếu nhập kho
          </h1>
          <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
            {ticket.ticketCode}
          </p>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: '#22c55e20' }}>
          <ArrowDownToLine size={20} style={{ color: '#22c55e' }} />
          <span className="font-medium" style={{ color: '#22c55e' }}>Nhập kho</span>
        </div>
      </motion.div>

      {/* Status Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mp-glass-card p-6"
      >
        <StatusTimeline
          steps={receiveTicketStatusSteps}
          currentStatus={ticket.status}
          type="receiveTicket"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mp-glass-card p-6"
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
              Thông tin chung
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Calendar size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Ngày nhập</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {ticket.receiveDate ? new Date(ticket.receiveDate).toLocaleString('vi-VN') : 'Chưa nhập'}
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
                    <th className="py-3 px-2 text-right font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>SL yêu cầu</th>
                    <th className="py-3 px-2 text-right font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>SL thực nhập</th>
                    <th className="py-3 px-2 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {(ticket.receiveTicketDetails || []).map((d, index) => (
                    <tr 
                      key={index} 
                      className="border-b"
                      style={{ borderColor: 'var(--mp-border-light)' }}
                    >
                      <td className="py-3 px-2" style={{ color: 'var(--mp-text-secondary)' }}>{d.itemCode}</td>
                      <td className="py-3 px-2 font-medium" style={{ color: 'var(--mp-text-primary)' }}>{d.itemName}</td>
                      <td className="py-3 px-2 text-right" style={{ color: 'var(--mp-text-primary)' }}>{d.quantityRequest}</td>
                      <td className="py-3 px-2 text-right font-semibold" style={{ color: 'var(--mp-text-primary)' }}>{d.quantityActual || '--'}</td>
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
                backgroundColor: ticket.status === 'Đã hoàn thành' ? '#10b98120' : ticket.status === 'Chờ nhập kho' ? '#f59e0b20' : '#a855f720',
                color: ticket.status === 'Đã hoàn thành' ? '#10b981' : ticket.status === 'Chờ nhập kho' ? '#f59e0b' : '#a855f7'
              }}
            >
              {ticket.status}
            </span>
          </motion.div>

          {/* Actions */}
          {(canConfirm || canReceive) && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mp-glass-card p-6 space-y-3"
            >
              <h3 className="font-semibold mb-3" style={{ color: 'var(--mp-text-primary)' }}>
                Thao tác
              </h3>
              {canConfirm && (
                <button
                  onClick={() => setConfirmModalOpen(true)}
                  className="w-full mp-btn mp-btn-primary justify-center"
                  style={{ backgroundColor: '#a855f7' }}
                >
                  <CheckCircle size={18} />
                  Xác nhận phiếu
                </button>
              )}
              {canReceive && (
                <button
                  onClick={() => setReceiveModalOpen(true)}
                  className="w-full mp-btn justify-center"
                  style={{ backgroundColor: '#22c55e', color: 'white' }}
                >
                  <ArrowDownToLine size={18} />
                  Nhập kho
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
              <p className="font-semibold" style={{ color: '#10b981' }}>Đã hoàn thành nhập kho</p>
            </motion.div>
          )}
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
