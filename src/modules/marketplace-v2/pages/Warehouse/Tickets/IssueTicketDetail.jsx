import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpFromLine,
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
import { useIssueTicketById, useUpdateIssueTicketStatus } from '../../../hooks/useApi';

// Manufacturing services
import { getMoById, updateMo } from '@/services/manufacturing/MoService';
import { getAllProcessesInMo, updateProcess } from '@/services/manufacturing/ProcessService';

// Inventory services
import { decreaseOnDemand, decreaseQuantity } from '@/services/inventory/InventoryService';
import { createReceiveTicket } from '@/services/inventory/ReceiveTicketService';
import { getTransferTicketById, updateTransferTicket } from '@/services/inventory/TransferTicketService';

// Sales services
import { createDeliveryOrder } from '@/services/delivery/DoService';
import { getSoById, updateSoStatus } from '@/services/sale/SoService';

/**
 * Issue Ticket Detail Page
 * Shows details of an issue ticket with confirm/issue actions
 * Layout: Timeline on right side, action buttons in header
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
      const employeeName = localStorage.getItem('employeeName');
      
      // Format issueDate to ISO 8601 if it exists, otherwise use null
      let issueDate = null;
      if (ticket.issueDate) {
        issueDate = new Date(ticket.issueDate).toISOString();
      }

      // Send all required fields to match API validation
      const request = {
        companyId: Number(ticket.companyId),
        warehouseId: Number(ticket.warehouseId),
        reason: ticket.reason || '',
        issueType: ticket.issueType || 'Xuất bán hàng',
        referenceCode: ticket.referenceCode || '',
        status: 'Chờ xuất kho',
        issueDate: issueDate,
        createdBy: employeeName || ticket.createdBy || '',
      };

      await updateStatusMutation.mutateAsync({
        ticketId: ticket.ticketId,
        request
      });
      toast.success('Đã xác nhận phiếu xuất kho');
      setConfirmModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error confirming ticket:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xác nhận phiếu');
    }
  };

  const handleIssueStock = async () => {
    const token = localStorage.getItem('token');
    const now = new Date().toISOString();

    try {
      // 1. Cập nhật status phiếu xuất
      const request = {
        companyId: Number(ticket.companyId),
        warehouseId: Number(ticket.warehouseId),
        reason: ticket.reason || '',
        issueType: ticket.issueType || 'Xuất bán hàng',
        referenceCode: ticket.referenceCode || '',
        status: 'Đã hoàn thành',
        issueDate: now,
        createdBy: ticket.createdBy || '',
      };

      await updateStatusMutation.mutateAsync({
        ticketId: ticket.ticketId,
        request
      });

      // 2. Xử lý theo loại xuất kho

      // 2a. Xuất cho Sản xuất (MO)
      if (ticket.issueType === 'Sản xuất' && ticket.referenceId) {
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
              status: 'Đang sản xuất',
            },
            token
          );

          const processes = await getAllProcessesInMo(ticket.referenceId, token);
          const sortedProcesses = processes.sort((a, b) => a.stageDetailOrder - b.stageDetailOrder);
          const process = sortedProcesses[0];

          await updateProcess(
            process.id,
            {
              moId: ticket.referenceId,
              stageDetailId: process.stageDetailId,
              startedOn: now,
              status: 'Đang thực hiện',
            },
            token
          );
        } catch (moError) {
          console.error('Error updating MO:', moError);
          toast.error('Cập nhật MO thất bại!');
        }
      }

      // 2b. Xuất cho Chuyển kho (Transfer Ticket)
      if (ticket.issueType === 'Chuyển kho' && ticket.referenceId) {
        try {
          const tt = await getTransferTicketById(ticket.referenceId, token);

          const transferTicketRequest = {
            companyId: Number(tt.companyId),
            fromWarehouseId: Number(tt.fromWarehouseId),
            toWarehouseId: Number(tt.toWarehouseId),
            reason: tt.reason,
            status: 'Chờ nhập kho',
            createdBy: tt.createdBy,
            transferTicketDetails: (tt.transferTicketDetails || []).map(detail => ({
              itemId: Number(detail.itemId),
              quantity: parseFloat(detail.quantity),
              note: detail.note || '',
            })),
          };

          await updateTransferTicket(ticket.referenceId, transferTicketRequest, token);

          const employeeName = localStorage.getItem('employeeName');
          const receiveTicketRequest = {
            companyId: Number(tt.companyId),
            warehouseId: Number(tt.toWarehouseId),
            reason: 'Xuất kho để chuyển kho',
            receiveType: 'Chuyển kho',
            referenceCode: tt.ticketCode,
            status: 'Chờ xác nhận',
            receiveDate: new Date().toISOString(),
            createdBy: employeeName,
          };

          await createReceiveTicket(receiveTicketRequest, token);
        } catch (ttError) {
          console.error('Error updating Transfer Ticket:', ttError);
          toast.error('Cập nhật phiếu chuyển kho thất bại!');
        }
      }

      // 2c. Xuất cho Bán hàng (SO)
      if (ticket.issueType === 'Bán hàng' && ticket.referenceId) {
        try {
          const so = await getSoById(ticket.referenceId, token);
          await updateSoStatus(so.soId, 'Chờ vận chuyển', token);

          const doRequest = {
            soId: so.soId,
            status: 'Chờ xác nhận',
          };

          await createDeliveryOrder(doRequest, token);
        } catch (soError) {
          console.error('Error updating SO:', soError);
          toast.error('Cập nhật SO thất bại!');
        }
      }

      // 3. Cập nhật tồn kho
      try {
        await Promise.all(
          (ticket.issueTicketDetails || []).map(detail =>
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
        console.error('Error updating inventory:', inventoryError);
        toast.error('Cập nhật tồn kho thất bại!');
      }

      toast.success('Xuất kho thành công!');
      setIssueModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error issuing stock:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xuất kho');
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
              Chi tiết phiếu xuất kho
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
          {canIssue && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIssueModalOpen(true)}
              className="mp-btn"
              style={{ backgroundColor: '#ef4444', color: 'white' }}
            >
              <ArrowUpFromLine size={18} />
              Xuất kho
            </motion.button>
          )}
          {isCompleted && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: '#10b98120' }}>
              <CheckCircle size={18} style={{ color: '#10b981' }} />
              <span className="font-medium" style={{ color: '#10b981' }}>Đã hoàn thành</span>
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
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Kho xuất</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {ticket.warehouseName} ({ticket.warehouseCode})
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
                <Calendar size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Ngày xuất</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {ticket.issueDate ? new Date(ticket.issueDate).toLocaleString('vi-VN') : 'Chưa xuất'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Package size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Số mặt hàng</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {ticket.issueTicketDetails?.length || 0} sản phẩm
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
                  {(ticket.issueTicketDetails || []).map((detail, index) => (
                    <tr 
                      key={detail.itdetailId || index} 
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
                    {ticket.issueTicketDetails?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between w-full max-w-xs pt-2 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
                  <span className="text-lg font-semibold" style={{ color: 'var(--mp-text-primary)' }}>Tổng số lượng:</span>
                  <span className="text-xl font-bold text-blue-500">
                    {(ticket.issueTicketDetails || []).reduce((sum, d) => sum + (d.quantity || 0), 0)}
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
              type="issueTicket"
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
