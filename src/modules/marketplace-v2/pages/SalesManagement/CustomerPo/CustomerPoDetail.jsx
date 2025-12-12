import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Building2,
    Calendar,
    Check,
    CreditCard,
    FileText,
    MapPin,
    Package
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { StatusTimeline } from '../../../components/timeline';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { usePoById, useUpdatePoStatus } from '../../../hooks/useApi';
// import { formatCurrency } from '../../../../utils/format';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

/**
 * Customer PO Detail Page (Sales Department)
 * View details of PO received from customer
 * Actions: Confirm, Reject, Create SO
 */
const CustomerPoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  // Fetch PO data
  const { data: po, isLoading, refetch } = usePoById(id);
  const updateStatusMutation = useUpdatePoStatus();

  // Navigate to check inventory page - marketplace-v2 version
  const handleConfirmPo = () => {
    navigate(`/marketplace-v2/check-inventory/po/${po.poId}`);
  };

  const handleRejectPo = async () => {
    try {
      await updateStatusMutation.mutateAsync({
        poId: po.poId,
        status: 'Đã hủy'
      });
      toast.success('Đã từ chối đơn hàng');
      setRejectModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error rejecting PO:', error);
      toast.error('Có lỗi xảy ra khi từ chối đơn hàng');
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

  if (!po) {
    return (
      <div className="max-w-8xl mx-auto">
        <div className="mp-glass-card p-8 text-center">
          <p className="text-red-500 mb-4">Không tìm thấy đơn hàng</p>
          <button onClick={() => navigate(-1)} className="mp-btn mp-btn-secondary">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const isPending = po.status === 'Chờ xác nhận';

  return (
    <div className="max-w-8xl mx-auto space-y-6">
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
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>
            Chi tiết đơn mua hàng
          </h1>
          <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
            {po.poCode}
          </p>
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
                <Building2 size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Khách hàng</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {po.companyName || 'Công ty khách hàng'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Mã khách hàng</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {po.companyCode || '---'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Mã đơn mua hàng</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {po.poCode || '---'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Ngày đặt hàng</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {new Date(po.createdOn).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Mã báo giá</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {po.quotationCode || '---'}
                  </p>
                </div>
              </div>
               <div className="flex items-center gap-3">
                <Package size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Số lượng mục</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {po.purchaseOrderDetails?.length} sản phẩm
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Delivery & Payment Info */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.15 }}
             className="mp-glass-card p-6"
           >
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
               Địa chỉ & Thanh toán
             </h2>
              <div className="space-y-4">
                 <div className="flex items-start gap-3">
                   <MapPin size={20} style={{ color: 'var(--mp-text-tertiary)' }} className="mt-1" />
                   <div>
                     <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Địa chỉ giao hàng</p>
                     <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                       {po.deliveryToAddress || 'Chưa cập nhật'}
                     </p>
                   </div>
                 </div>
                  <div className="flex items-center gap-3">
                   <CreditCard size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                   <div>
                     <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Phương thức thanh toán</p>
                     <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                       {po.paymentMethod || 'Chuyển khoản'}
                     </p>
                   </div>
                 </div>
              </div>
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
            
            {/* Items Table - like legacy SupplierPoDetail */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--mp-border-light)' }}>
                    <th className="py-3 px-2 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Mã hàng hóa</th>
                    <th className="py-3 px-2 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Tên hàng hóa</th>
                    <th className="py-3 px-2 text-right font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Số lượng</th>
                    <th className="py-3 px-2 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Ghi chú</th>
                    <th className="py-3 px-2 text-right font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Đơn giá</th>
                    <th className="py-3 px-2 text-right font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Chiết khấu</th>
                    <th className="py-3 px-2 text-right font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {(po.purchaseOrderDetails || []).map((d, index) => (
                    <tr 
                      key={index} 
                      className="border-b"
                      style={{ borderColor: 'var(--mp-border-light)' }}
                    >
                      <td className="py-3 px-2" style={{ color: 'var(--mp-text-secondary)' }}>{d.itemCode}</td>
                      <td className="py-3 px-2 font-medium" style={{ color: 'var(--mp-text-primary)' }}>{d.itemName}</td>
                      <td className="py-3 px-2 text-right" style={{ color: 'var(--mp-text-primary)' }}>{d.quantity}</td>
                      <td className="py-3 px-2" style={{ color: 'var(--mp-text-secondary)' }}>{d.note || '---'}</td>
                      <td className="py-3 px-2 text-right" style={{ color: 'var(--mp-text-primary)' }}>{formatCurrency(d.itemPrice)}</td>
                      <td className="py-3 px-2 text-right" style={{ color: 'var(--mp-text-secondary)' }}>{formatCurrency(d.discount || 0)}</td>
                      <td className="py-3 px-2 text-right font-semibold" style={{ color: 'var(--mp-text-primary)' }}>
                        {formatCurrency(d.itemPrice * d.quantity - (d.discount || 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
             
            {/* Financial Summary - like legacy */}
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-col items-end space-y-2">
                <div className="flex justify-between w-full max-w-xs">
                  <span style={{ color: 'var(--mp-text-secondary)' }}>Tổng tiền hàng:</span>
                  <span className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {formatCurrency(po.subTotal)}
                  </span>
                </div>
                <div className="flex justify-between w-full max-w-xs">
                  <span style={{ color: 'var(--mp-text-secondary)' }}>Thuế ({po.taxRate || 0}%):</span>
                  <span className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {formatCurrency(po.taxAmount)}
                  </span>
                </div>
                <div className="flex justify-between w-full max-w-xs pt-2 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
                  <span className="text-lg font-semibold" style={{ color: 'var(--mp-text-primary)' }}>Tổng cộng:</span>
                  <span className="text-xl font-bold text-blue-500">
                    {formatCurrency(po.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Status & Actions */}
        <div className="space-y-6">
          {/* Status Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mp-glass-card p-6"
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
              Trạng thái
            </h2>
            <StatusTimeline
              currentStatus={po.status}
              type="po"
            />
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="mp-glass-card p-6 space-y-3"
          >
             {isPending && (
                <button
                  onClick={handleConfirmPo}
                  className="w-full mp-btn mp-btn-primary mp-ripple justify-center bg-emerald-500 hover:bg-emerald-600"
                >
                  <Check size={18} />
                  Xác nhận đơn hàng
                </button>
              )}

              {po.status === 'Đã xác nhận' && (
                <button className="w-full mp-btn mp-btn-secondary justify-center" disabled>
                  <Check size={18} className="text-green-500" /> Đã xác nhận
                </button>
              )}
          </motion.div>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmPo}
        title="Xác nhận đơn hàng"
        message="Bạn có chắc chắn muốn xác nhận đơn hàng này? Trạng thái sẽ chuyển sang 'Đang vận chuyển'."
        confirmText="Xác nhận"
        variant="primary"
        loading={updateStatusMutation.isPending}
      />

       {/* Reject Modal */}
       <ConfirmModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleRejectPo}
        title="Từ chối đơn hàng"
        message="Bạn có chắc chắn muốn từ chối đơn hàng này? Hành động này không thể hoàn tác."
        confirmText="Từ chối"
        variant="danger"
        loading={updateStatusMutation.isPending}
      />
    </div>
  );
};

export default CustomerPoDetail;
