import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  FileText,
  RefreshCw
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ItemList from '../../../../components/items/ItemList';
import { StatusTimeline } from '../../../../components/timeline';
import ConfirmModal from '../../../../components/ui/ConfirmModal';
import {
  useQuotationByRfq,
  useRfqById,
  useUpdateRfqStatus
} from '../../../../hooks/useApi';

// RFQ Status Config - 6 trạng thái
const statusConfig = {
  'chưa báo giá': { label: 'Chưa báo giá', colorClass: 'mp-badge-chua-bao-gia' },
  'đã báo giá': { label: 'Đã báo giá', colorClass: 'mp-badge-da-bao-gia' },
  'quá hạn báo giá': { label: 'Quá hạn', colorClass: 'mp-badge-qua-han' },
  'đã chấp nhận': { label: 'Đã chấp nhận', colorClass: 'mp-badge-da-chap-nhan' },
  'đã từ chối': { label: 'Đã từ chối', colorClass: 'mp-badge-da-tu-choi' },
  'đã hủy': { label: 'Đã hủy', colorClass: 'mp-badge-da-huy' },
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * RFQ Detail Page
 * Hiển thị chi tiết yêu cầu báo giá với 6 trạng thái
 */
const RfqDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState({ open: false, action: null });

  // API hooks
  const { data: rfq, isLoading, isError, refetch } = useRfqById(id);
  const { data: linkedQuotation } = useQuotationByRfq(id, { enabled: !!id });
  const updateStatusMutation = useUpdateRfqStatus();

  // Map RFQ data
  const rfqData = useMemo(() => {
    if (!rfq) return null;

    const items = (rfq.rfqDetails || []).map((detail, index) => ({
      id: detail.rfqDetailId || index,
      code: detail.itemCode || detail.supplierItemCode,
      name: detail.itemName || detail.supplierItemName,
      quantity: detail.quantity || 0,
      price: detail.supplierItemPrice || 0,
      subtotal: (detail.quantity || 0) * (detail.supplierItemPrice || 0),
      note: detail.note || ''
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      id: rfq.rfqId,
      code: rfq.rfqCode,
      status: rfq.status?.toLowerCase() || 'chưa báo giá',
      companyName: rfq.requestedCompanyName || 'N/A',
      companyCode: rfq.requestedCompanyCode || '',
      contactPerson: rfq.createdBy || 'N/A',
      createdAt: rfq.createdOn,
      updatedAt: rfq.lastUpdatedOn,
      needByDate: rfq.needByDate,
      items: items,
      totalAmount: totalAmount
    };
  }, [rfq]);

  const status = rfqData ? statusConfig[rfqData.status] : null;

  // Action handlers
  const handleCancel = () => {
    setConfirmModal({
      open: true,
      action: 'cancel',
      title: 'Hủy yêu cầu báo giá',
      message: 'Bạn có chắc chắn muốn hủy yêu cầu báo giá này?',
      variant: 'danger'
    });
  };

  const handleViewQuotation = () => {
    if (linkedQuotation?.quotationId) {
      navigate(`/marketplace-v2/quotation/${linkedQuotation.quotationId}`);
    }
  };

  const handleConfirmAction = async () => {
    if (confirmModal.action === 'cancel') {
      try {
        await updateStatusMutation.mutateAsync({ rfqId: id, status: 'Đã hủy' });
        refetch();
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
    setConfirmModal({ open: false, action: null });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="mp-glass-card p-6 h-48" />
            <div className="mp-glass-card p-6 h-64" />
          </div>
          <div className="mp-glass-card p-6 h-80" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !rfqData) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mp-glass-card p-8 text-center">
          <p className="text-red-500 mb-4">Không thể tải thông tin yêu cầu báo giá</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate(-1)} className="mp-btn mp-btn-secondary">
              Quay lại
            </button>
            <button onClick={() => refetch()} className="mp-btn mp-btn-primary">
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
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
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>
                {rfqData.code}
              </h1>
              {status && (
                <span className={`mp-badge ${status.colorClass}`}>
                  {status.label}
                </span>
              )}
            </div>
            <p
              className="flex items-center gap-2 mt-1 text-sm"
              style={{ color: 'var(--mp-text-secondary)' }}
            >
              <Building2 size={16} />
              {rfqData.companyName}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => refetch()}
            className="mp-btn mp-btn-secondary"
          >
            <RefreshCw size={18} />
          </motion.button>

          {/* Nút Hủy - chỉ khi status là 'chưa báo giá' */}
          {rfqData.status === 'chưa báo giá' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancel}
              className="mp-btn bg-red-500 hover:bg-red-600 text-white"
            >
              Hủy yêu cầu
            </motion.button>
          )}

          {/* Nút Xem báo giá - chỉ khi status là 'đã báo giá' */}
          {rfqData.status === 'đã báo giá' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewQuotation}
              className="mp-btn bg-blue-500 hover:bg-blue-600 text-white"
            >
              <FileText size={18} />
              Xem báo giá
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Two-column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* RFQ Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mp-glass-card p-6"
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
              Thông tin yêu cầu báo giá
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Mã yêu cầu</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{rfqData.code}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Nhà cung cấp</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{rfqData.companyName}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Người tạo</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{rfqData.contactPerson}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Ngày tạo</p>
                  <p className="font-medium flex items-center gap-2" style={{ color: 'var(--mp-text-primary)' }}>
                    <Calendar size={16} />
                    {formatDate(rfqData.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Ngày cần hàng</p>
                  <p className="font-medium flex items-center gap-2" style={{ color: 'var(--mp-text-primary)' }}>
                    <Clock size={16} />
                    {formatDate(rfqData.needByDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="col-span-2 md:col-start-3">
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Tổng giá trị ước tính</p>
                  <p className="font-semibold text-lg" style={{ color: 'var(--mp-primary-600)' }}>
                    {formatCurrency(rfqData.totalAmount)}
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
              Danh sách sản phẩm ({rfqData.items.length})
            </h2>
            <ItemList items={rfqData.items} />
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mp-glass-card p-6"
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
              Trạng thái yêu cầu
            </h2>
            <StatusTimeline currentStatus={rfqData.status} type="rfq" />
          </motion.div>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, action: null })}
        onConfirm={handleConfirmAction}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        isLoading={updateStatusMutation.isPending}
      />
    </div>
  );
};

export default RfqDetail;
