import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Building2,
    Calendar,
    CheckCircle,
    RefreshCw,
    ShoppingCart,
    XCircle
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ItemList from '../../../../components/items/ItemList';
import { StatusTimeline } from '../../../../components/timeline';
import ConfirmModal from '../../../../components/ui/ConfirmModal';
import {
    useQuotationById,
    useUpdateQuotationStatus,
    useUpdateRfqStatus
} from '../../../../hooks/useApi';

// Quotation Status Config - 3 trạng thái (Uppercase từ API)
const statusConfig = {
  'Đã báo giá': { label: 'Đã báo giá', colorClass: 'mp-badge-da-bao-gia' },
  'Đã chấp nhận': { label: 'Đã chấp nhận', colorClass: 'mp-badge-da-chap-nhan' },
  'Đã từ chối': { label: 'Đã từ chối', colorClass: 'mp-badge-da-tu-choi' },
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
 * Quotation Detail Page (Báo giá từ NCC)
 * Hiển thị chi tiết báo giá với 3 trạng thái
 */
const QuotationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState({ open: false, action: null });

  // API hooks
  const { data: quotation, isLoading, isError, refetch } = useQuotationById(id);
  const updateQuotationStatusMutation = useUpdateQuotationStatus();
  const updateRfqStatusMutation = useUpdateRfqStatus();

  // Map Quotation data
  const quotationData = useMemo(() => {
    if (!quotation) return null;

    const items = (quotation.quotationDetails || []).map((detail, index) => ({
      id: detail.quotationDetailId || index,
      code: detail.itemCode,
      name: detail.itemName,
      customerItemCode: detail.customerItemCode,
      customerItemName: detail.customerItemName,
      quantity: detail.quantity || 0,
      price: detail.itemPrice || 0,
      discount: detail.discount || 0,
      subtotal: (detail.quantity || 0) * (detail.itemPrice || 0) - (detail.discount || 0),
      note: detail.note || ''
    }));

    return {
      id: quotation.quotationId,
      code: quotation.quotationCode,
      status: quotation.status || 'Đã báo giá',
      companyName: quotation.companyName || 'N/A', // NCC gửi báo giá
      companyCode: quotation.companyCode || '',
      rfqId: quotation.rfqId,
      rfqCode: quotation.rfqCode,
      contactPerson: quotation.createdBy || 'N/A',
      createdAt: quotation.createdOn,
      updatedAt: quotation.lastUpdatedOn,
      subTotal: quotation.subTotal || 0,
      taxRate: quotation.taxRate || 0,
      taxAmount: quotation.taxAmount || 0,
      totalAmount: quotation.totalAmount || 0,
      items: items
    };
  }, [quotation]);

  const status = quotationData ? statusConfig[quotationData.status] : null;

  // Action handlers
  const handleAccept = () => {
    setConfirmModal({
      open: true,
      action: 'accept',
      title: 'Chấp nhận báo giá',
      message: 'Bạn có chắc chắn muốn chấp nhận báo giá này?',
      variant: 'success'
    });
  };

  const handleReject = () => {
    setConfirmModal({
      open: true,
      action: 'reject',
      title: 'Từ chối báo giá',
      message: 'Bạn có chắc chắn muốn từ chối báo giá này?',
      variant: 'danger'
    });
  };

  const handleCreatePO = () => {
    navigate(`/marketplace-v2/create-po/${id}`);
  };

  const handleConfirmAction = async () => {
    const statusMap = {
      accept: 'Đã chấp nhận',
      reject: 'Đã từ chối'
    };

    const newStatus = statusMap[confirmModal.action];
    if (newStatus) {
      try {
        // Update Quotation status
        await updateQuotationStatusMutation.mutateAsync({ quotationId: id, status: newStatus });
        
        // Also update RFQ status
        if (quotationData.rfqId) {
          try {
            await updateRfqStatusMutation.mutateAsync({ rfqId: quotationData.rfqId, status: newStatus });
          } catch (rfqError) {
            console.error('Error updating RFQ status:', rfqError);
          }
        }
        
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
  if (isError || !quotationData) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mp-glass-card p-8 text-center">
          <p className="text-red-500 mb-4">Không thể tải thông tin báo giá</p>
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
                {quotationData.code}
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
              {quotationData.companyName} (Nhà cung cấp)
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

          {/* Nút Chấp nhận/Từ chối - chỉ khi status là 'Đã báo giá' */}
          {quotationData.status === 'Đã báo giá' && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAccept}
                className="mp-btn bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <CheckCircle size={18} />
                Chấp nhận
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReject}
                className="mp-btn bg-red-500 hover:bg-red-600 text-white"
              >
                <XCircle size={18} />
                Từ chối
              </motion.button>
            </>
          )}

          {/* Nút Mua hàng - chỉ khi status là 'Đã chấp nhận' */}
          {quotationData.status === 'Đã chấp nhận' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreatePO}
              className="mp-btn bg-blue-500 hover:bg-blue-600 text-white"
            >
              <ShoppingCart size={18} />
              Mua hàng
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Two-column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quotation Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mp-glass-card p-6"
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
              Thông tin báo giá
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Mã báo giá</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{quotationData.code}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Mã RFQ liên quan</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{quotationData.rfqCode}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Nhà cung cấp</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{quotationData.companyName}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Người tạo</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{quotationData.contactPerson}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Ngày tạo</p>
                  <p className="font-medium flex items-center gap-2" style={{ color: 'var(--mp-text-primary)' }}>
                    <Calendar size={16} />
                    {formatDate(quotationData.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Tổng tiền hàng</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {formatCurrency(quotationData.subTotal)}
                  </p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Thuế ({quotationData.taxRate}%)</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {formatCurrency(quotationData.taxAmount)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Tổng cộng</p>
                  <p className="font-semibold text-xl" style={{ color: 'var(--mp-primary-600)' }}>
                    {formatCurrency(quotationData.totalAmount)}
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
              Danh sách sản phẩm ({quotationData.items.length})
            </h2>
            <ItemList items={quotationData.items} showPrice={true} />
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
              Trạng thái báo giá
            </h2>
            <StatusTimeline currentStatus={quotationData.status} type="quotation" />
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
        isLoading={updateQuotationStatusMutation.isPending}
      />
    </div>
  );
};

export default QuotationDetail;
