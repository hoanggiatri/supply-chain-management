import { motion } from 'framer-motion';
import {
    ArrowLeft,
    ArrowUpFromLine,
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
import { useIssueTicketById, useUpdateIssueTicketStatus } from '../../../hooks/useApi';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

// Issue Ticket Status Steps
const issueTicketStatusSteps = [
  { key: 'Chờ xác nhận', label: 'Chờ xác nhận', icon: Clock },
  { key: 'Chờ xuất kho', label: 'Chờ xuất kho', icon: Package },
  { key: 'Đã hoàn thành', label: 'Đã hoàn thành', icon: CheckCircle },
];

/**
 * Issue Ticket Detail Page
 * Shows details of an issue ticket with confirm/issue actions
 */
const IssueTicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [issueModalOpen, setIssueModalOpen] = useState(false);

  // Fetch ticket data
  const { data: ticket, isLoading, refetch } = useIssueTicketById(id);
  const updateStatusMutation = useUpdateIssueTicketStatus();

  const handleConfirmTicket = async () => {
    try {
      await updateStatusMutation.mutateAsync({
        ticketId: ticket.ticketId,
        request: { status: 'Chờ xuất kho' }
      });
      toast.success('Đã xác nhận phiếu xuất kho');
      setConfirmModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error confirming ticket:', error);
      toast.error('Có lỗi xảy ra khi xác nhận phiếu');
    }
  };

  const handleIssueStock = async () => {
    try {
      await updateStatusMutation.mutateAsync({
        ticketId: ticket.ticketId,
        request: { status: 'Đã hoàn thành' }
      });
      toast.success('Đã xuất kho thành công');
      setIssueModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error issuing stock:', error);
      toast.error('Có lỗi xảy ra khi xuất kho');
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
          <p className="text-red-500 mb-4">Không tìm thấy phiếu xuất kho</p>
          <button onClick={() => navigate(-1)} className="mp-btn mp-btn-secondary">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const canConfirm = ticket.status === 'Chờ xác nhận';
  const canIssue = ticket.status === 'Chờ xuất kho';

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
            Chi tiết phiếu xuất kho
          </h1>
          <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
            {ticket.ticketCode}
          </p>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: '#ef444420' }}>
          <ArrowUpFromLine size={20} style={{ color: '#ef4444' }} />
          <span className="font-medium" style={{ color: '#ef4444' }}>Xuất kho</span>
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
          steps={issueTicketStatusSteps}
          currentStatus={ticket.status}
          type="issueTicket"
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
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Kho xuất</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {ticket.warehouseName} ({ticket.warehouseCode})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Ngày xuất</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {ticket.issueDate ? new Date(ticket.issueDate).toLocaleString('vi-VN') : 'Chưa xuất'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Box size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Loại xuất kho</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {ticket.issueType || 'Xuất bán hàng'}
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
                <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Lý do xuất kho</p>
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
                    <th className="py-3 px-2 text-right font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>SL thực xuất</th>
                    <th className="py-3 px-2 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {(ticket.issueTicketDetails || []).map((d, index) => (
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
                backgroundColor: ticket.status === 'Đã hoàn thành' ? '#10b98120' : ticket.status === 'Chờ xuất kho' ? '#f59e0b20' : '#a855f720',
                color: ticket.status === 'Đã hoàn thành' ? '#10b981' : ticket.status === 'Chờ xuất kho' ? '#f59e0b' : '#a855f7'
              }}
            >
              {ticket.status}
            </span>
          </motion.div>

          {/* Actions */}
          {(canConfirm || canIssue) && (
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
              {canIssue && (
                <button
                  onClick={() => setIssueModalOpen(true)}
                  className="w-full mp-btn justify-center"
                  style={{ backgroundColor: '#ef4444', color: 'white' }}
                >
                  <ArrowUpFromLine size={18} />
                  Xuất kho
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
              <p className="font-semibold" style={{ color: '#10b981' }}>Đã hoàn thành xuất kho</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmTicket}
        title="Xác nhận phiếu xuất kho"
        message="Bạn có chắc chắn muốn xác nhận phiếu xuất kho này? Sau khi xác nhận, phiếu sẽ chuyển sang trạng thái 'Chờ xuất kho'."
        confirmText="Xác nhận"
        variant="primary"
        loading={updateStatusMutation.isPending}
      />

      {/* Issue Modal */}
      <ConfirmModal
        isOpen={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        onConfirm={handleIssueStock}
        title="Xuất kho"
        message="Bạn có chắc chắn muốn thực hiện xuất kho? Hành động này sẽ cập nhật số lượng tồn kho."
        confirmText="Xuất kho"
        variant="danger"
        loading={updateStatusMutation.isPending}
      />
    </div>
  );
};

export default IssueTicketDetail;
