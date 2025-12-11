import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle,
  FileText,
  RefreshCw
} from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ItemList from '../../../components/items/ItemList';
import { StatusTimeline } from '../../../components/timeline';
import { useRfqById } from '../../../hooks/useApi';
/**
 * Customer RFQ Detail Page (Sales Department)
 * View RFQ details from customer and create quotation
 */
const CustomerRfqDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch RFQ data
  const { data: rfq, isLoading, refetch } = useRfqById(id);

  // Map RFQ data
  const rfqData = useMemo(() => {
    if (!rfq) return null;

    const items = (rfq.rfqDetails || []).map((detail, index) => ({
      id: detail.rfqDetailId || index,
      code: detail.supplierItemCode || detail.item?.itemCode,
      name: detail.supplierItemName || detail.item?.itemName,
      quantity: detail.quantity || 0,
      price: detail.supplierItemPrice || 0,
      subtotal: (detail.quantity || 0) * (detail.supplierItemPrice || 0),
      unit: detail.item?.uom || 'Cái',
      note: detail.note || ''
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      id: rfq.rfqId,
      code: rfq.rfqCode,
      status: rfq.status?.toLowerCase() || 'chưa báo giá',
      companyName: rfq.companyName || 'N/A', // Customer (Buyer)
      contactPerson: rfq.createdBy || 'N/A',
      createdAt: rfq.createdOn,
      updatedAt: rfq.lastUpdatedOn,
      needByDate: rfq.needByDate,
      items: items,
      totalAmount: totalAmount
    };
  }, [rfq]);

  const handleCreateQuotation = () => {
    navigate(`/marketplace-v2/sales/create-quotation/${rfq.rfqId}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  if (isLoading) {
    return (
      <div className="max-w-8xl mx-auto animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="mp-glass-card p-6 h-64" />
            <div className="mp-glass-card p-6 h-48" />
          </div>
          <div className="mp-glass-card p-6 h-32" />
        </div>
      </div>
    );
  }

  if (!rfqData) {
    return (
      <div className="max-w-8xl mx-auto">
        <div className="mp-glass-card p-8 text-center">
          <p className="text-red-500 mb-4">Không tìm thấy yêu cầu báo giá</p>
          <button onClick={() => navigate(-1)} className="mp-btn mp-btn-secondary">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const isPending = rfqData.status === 'chưa báo giá';

  return (
    <div className="max-w-8xl mx-auto space-y-6">
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
            title="Quay lại"
          >
            <ArrowLeft size={20} style={{ color: 'var(--mp-text-secondary)' }} />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>
              {rfqData.code}
            </h1>
            <p className="flex items-center gap-2 mt-1 text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
              <Building2 size={16} />
              {rfqData.companyName} (Khách hàng)
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => refetch()}
            className="mp-btn mp-btn-secondary"
            title="Làm mới"
          >
            <RefreshCw size={18} />
          </motion.button>

          {/* Action Buttons in Header */}
          {isPending && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateQuotation}
              className="mp-btn mp-btn-primary"
            >
              <FileText size={18} />
              Gửi báo giá
            </motion.button>
          )}

          {rfqData.status === 'đã báo giá' && (
             <motion.button
              className="mp-btn mp-btn-secondary"
              disabled
            >
              <CheckCircle size={18} className="text-green-500"/>
              Đã gửi báo giá
            </motion.button>
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
              <div className="space-y-3">
                <div>
                   <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Khách hàng</p>
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
                     {new Date(rfqData.createdAt).toLocaleDateString('vi-VN')}
                   </p>
                </div>
                <div>
                   <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Hạn báo giá</p>
                   <p className="font-medium flex items-center gap-2" style={{ color: 'var(--mp-text-primary)' }}>
                     <Calendar size={16} />
                     {rfqData.needByDate ? new Date(rfqData.needByDate).toLocaleDateString('vi-VN') : 'Không có'}
                   </p>
                </div>
              </div>
            </div>

            {/* Summary in Info Card */}
            <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-start-3 md:col-span-2">
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Tổng giá trị ước tính</p>
                  <p className="font-semibold text-xl" style={{ color: 'var(--mp-primary-600)' }}>
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
              Danh sách hàng hóa ({rfqData.items.length})
            </h2>
            <ItemList items={rfqData.items} showPrice={false} />
          </motion.div>
        </div>

        {/* Right Column: Status */}
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
              currentStatus={rfqData.status}
              type="rfq"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CustomerRfqDetail;
