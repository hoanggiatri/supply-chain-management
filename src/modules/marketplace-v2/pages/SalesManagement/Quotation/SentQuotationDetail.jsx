import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CreditCard,
  FileText,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { StatusTimeline } from '../../../components/timeline';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { useQuotationById, useUpdateQuotationStatus } from '../../../hooks/useApi';
// import { formatCurrency } from '../../../../utils/format';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

/**
 * Sent Quotation Detail Page (Sales Department)
 * View details of quotation sent to customer
 */
const SentQuotationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // Fetch Quotation data
  const { data: quotation, isLoading, refetch } = useQuotationById(id);
  const updateStatusMutation = useUpdateQuotationStatus();

  const handleCancelQuotation = async () => {
    try {
      await updateStatusMutation.mutateAsync({
        quotationId: quotation.quotationId,
        status: 'Đã hủy' 
      });
      toast.success('Đã hủy báo giá');
      setCancelModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error cancelling quotation:', error);
      toast.error('Có lỗi xảy ra khi hủy báo giá');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-64" />
        <div className="mp-glass-card p-6 h-64" />
        <div className="mp-glass-card p-6 h-48" />
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mp-glass-card p-8 text-center">
          <p className="text-red-500 mb-4">Không tìm thấy báo giá</p>
          <button onClick={() => navigate(-1)} className="mp-btn mp-btn-secondary">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // Remove unused item mapping
  const isPending = quotation.status === 'Đã báo giá';

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
            Chi tiết báo giá
          </h1>
          <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
            {quotation.quotationCode}
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
                    {quotation.requestCompanyName || 'Công ty khách hàng'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Mã khách hàng</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {quotation.requestCompanyCode || '---'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Mã báo giá</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {quotation.quotationCode || '---'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Mã RFQ</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {quotation.rfqCode || '---'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Ngày tạo</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {new Date(quotation.createdOn).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Người tạo</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {quotation.createdBy || '---'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

           {/* Payment Info */}
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mp-glass-card p-6"
          >
             <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
              Thanh toán & Giao hàng
            </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CreditCard size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                  <div>
                    <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Phương thức</p>
                    <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                      {quotation.paymentMethod || 'Chuyển khoản'}
                    </p>
                  </div>
                </div>
                {/* Delivery time can be added here if available */}
             </div>
          </motion.div>


          {/* Items List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mp-glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--mp-text-primary)' }}>
                Danh sách hàng hóa & Giá
              </h2>
              {quotation.rfqId && (
                <button
                  onClick={() => navigate(`/marketplace-v2/supplier-rfq/${quotation.rfqId}`)}
                  className="mp-btn mp-btn-secondary text-sm py-1"
                >
                  <FileText size={16} />
                  Xem RFQ
                </button>
              )}
            </div>
            
            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--mp-border-light)' }}>
                    <th className="py-3 px-2 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Mã SP</th>
                    <th className="py-3 px-2 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Tên sản phẩm</th>
                    <th className="py-3 px-2 text-right font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>SL</th>
                    <th className="py-3 px-2 text-right font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Đơn giá</th>
                    <th className="py-3 px-2 text-right font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Chiết khấu</th>
                    <th className="py-3 px-2 text-right font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {quotation.quotationDetails?.map((d, index) => (
                    <tr 
                      key={index} 
                      className="border-b"
                      style={{ borderColor: 'var(--mp-border-light)' }}
                    >
                      <td className="py-3 px-2" style={{ color: 'var(--mp-text-secondary)' }}>{d.itemCode}</td>
                      <td className="py-3 px-2 font-medium" style={{ color: 'var(--mp-text-primary)' }}>{d.itemName}</td>
                      <td className="py-3 px-2 text-right" style={{ color: 'var(--mp-text-primary)' }}>{d.quantity}</td>
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
             
            {/* Financial Summary */}
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-col items-end space-y-2">
                <div className="flex justify-between w-full max-w-xs">
                  <span style={{ color: 'var(--mp-text-secondary)' }}>Tổng tiền hàng:</span>
                  <span className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {formatCurrency(quotation.subTotal)}
                  </span>
                </div>
                <div className="flex justify-between w-full max-w-xs">
                  <span style={{ color: 'var(--mp-text-secondary)' }}>Thuế GTGT ({quotation.taxRate || 0}%):</span>
                  <span className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {formatCurrency(quotation.taxAmount)}
                  </span>
                </div>
                <div className="flex justify-between w-full max-w-xs pt-2 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
                  <span className="text-lg font-semibold" style={{ color: 'var(--mp-text-primary)' }}>Tổng cộng:</span>
                  <span className="text-xl font-bold text-blue-500">
                    {formatCurrency(quotation.totalAmount)}
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
              currentStatus={quotation.status}
              type="quotation"
            />
          </motion.div>

          {/* Actions */}
          {isPending && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mp-glass-card p-6 space-y-3"
            >
              <button
                onClick={() => setCancelModalOpen(true)}
                className="w-full mp-btn mp-btn-secondary justify-center text-red-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
              >
                <X size={18} />
                Hủy báo giá
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelQuotation}
        title="Hủy báo giá"
        message="Bạn có chắc chắn muốn hủy báo giá này không? Hành động này không thể hoàn tác."
        confirmText="Hủy báo giá"
        variant="danger"
        loading={updateStatusMutation.isPending}
      />
    </div>
  );
};

export default SentQuotationDetail;
