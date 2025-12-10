import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Building2,
    Calendar,
    Download,
    Package,
    Printer,
    RefreshCw
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FloatingActions from '../../components/actions/FloatingActions';
import ItemList from '../../components/items/ItemList';
import { StatusTimeline } from '../../components/timeline';
import ConfirmModal from '../../components/ui/ConfirmModal';
import {
    usePoById,
    useQuotationById,
    useRfqById,
    useSoById,
    useUpdatePoStatus,
    useUpdateQuotationStatus,
    useUpdateRfqStatus,
    useUpdateSoStatus
} from '../../hooks/useApi';

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

const statusConfig = {
  // English statuses
  draft: { label: 'Nháp', color: 'bg-gray-400' },
  pending: { label: 'Chờ duyệt', color: 'bg-amber-500' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-500' },
  processing: { label: 'Đang xử lý', color: 'bg-indigo-500' },
  shipping: { label: 'Đang giao', color: 'bg-purple-500' },
  completed: { label: 'Hoàn thành', color: 'bg-emerald-500' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-500' },
  // Vietnamese statuses (for RFQ - 6 statuses) - lowercase from API
  'chưa báo giá': { label: 'Chưa báo giá', color: 'bg-amber-500' },
  'đã báo giá': { label: 'Đã báo giá', color: 'bg-blue-500' },
  'quá hạn báo giá': { label: 'Quá hạn', color: 'bg-orange-500' },
  'đã chấp nhận': { label: 'Đã chấp nhận', color: 'bg-emerald-500' },
  'đã từ chối': { label: 'Đã từ chối', color: 'bg-red-500' },
  'đã hủy': { label: 'Đã hủy', color: 'bg-gray-500' },
  // Vietnamese statuses (for Quotation) - Uppercase from API
  'Đã báo giá': { label: 'Đã báo giá', color: 'bg-blue-500' },
  'Đã chấp nhận': { label: 'Đã chấp nhận', color: 'bg-emerald-500' },
  'Đã từ chối': { label: 'Đã từ chối', color: 'bg-red-500' },
  'Đã hủy': { label: 'Đã hủy', color: 'bg-gray-500' },
};

/**
 * Order Detail page - uses real API data
 */
const OrderDetail = ({ type = 'po' }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState({ open: false, action: null });

  // Call ALL hooks unconditionally at top level (React hooks rules)
  const poQuery = usePoById(type === 'po' ? id : null);
  const soQuery = useSoById(type === 'so' ? id : null);
  const rfqQuery = useRfqById(type === 'rfq' ? id : null);
  const quotationQuery = useQuotationById(type === 'quotation' ? id : null);

  // Call ALL mutation hooks unconditionally
  const updatePoStatusMutation = useUpdatePoStatus();
  const updateSoStatusMutation = useUpdateSoStatus();
  const updateRfqStatusMutation = useUpdateRfqStatus();
  const updateQuotationStatusMutation = useUpdateQuotationStatus();

  // Select the appropriate query and mutation based on type
  const getActiveQuery = () => {
    switch (type) {
      case 'rfq': return rfqQuery;
      case 'quotation': return quotationQuery;
      case 'so': return soQuery;
      case 'po':
      default: return poQuery;
    }
  };

  const getActiveMutation = () => {
    switch (type) {
      case 'rfq': return updateRfqStatusMutation;
      case 'quotation': return updateQuotationStatusMutation;
      case 'so': return updateSoStatusMutation;
      case 'po':
      default: return updatePoStatusMutation;
    }
  };

  const { data: order, isLoading, isError, refetch } = getActiveQuery();
  const updateStatusMutation = getActiveMutation();

  // Map order data for display
  const orderData = useMemo(() => {
    if (!order) return null;

    // Handle RFQ specific structure
    const isRfq = type === 'rfq';
    const details = order.rfqDetails || order.quotationDetails || order.poDetails || order.soDetails || order.items || order.lineItems || [];
    
    // Map items from details array
    const items = details.map(item => ({
      id: item.rfqDetailId || item.id,
      name: item.supplierItemName || item.itemName || item.productName || item.name,
      sku: item.supplierItemCode || item.itemCode || item.productCode || item.sku || item.code,
      quantity: item.quantity || 0,
      price: item.supplierItemPrice || item.unitPrice || item.price || 0,
      unit: item.unit || 'Cái',
      subtotal: (item.quantity || 0) * (item.supplierItemPrice || item.unitPrice || item.price || 0),
      note: item.note || item.description || ''
    }));

    // Calculate total from items if not provided
    const totalAmount = order.totalAmount || order.total || items.reduce((sum, item) => sum + item.subtotal, 0);

    // Determine status - preserve case for Vietnamese statuses
    let status = order.status || 'pending';
    // Only convert to lowercase for English statuses
    if (/^[a-zA-Z]+$/.test(status)) {
      status = status.toLowerCase();
    }

    return {
      id: order.rfqId || order.quotationId || order.poId || order.soId || order.id,
      code: order.rfqCode || order.quotationCode || order.poCode || order.soCode || order.code || order.orderCode || `#${order.id}`,
      status: status,
      companyName: isRfq ? order.requestedCompanyName : (order.supplierCompanyName || order.companyName || 'N/A'),
      companyCode: order.requestedCompanyCode || order.companyCode || '',
      companyAddress: order.supplierAddress || order.companyAddress || '',
      contactPerson: order.createdBy || order.contactPerson || order.createdByName || 'N/A',
      contactPhone: order.contactPhone || order.phone || '',
      createdAt: order.createdOn || order.createdAt || order.createdDate,
      updatedAt: order.lastUpdatedOn || order.updatedAt || order.lastModifiedDate,
      expectedDelivery: order.needByDate || order.expectedDelivery || order.deliveryDate,
      notes: order.notes || order.description || '',
      items: items,
      totalAmount: totalAmount,
      statusHistory: order.statusHistory || [],
      rfqId: order.rfqId, // Include rfqId for quotation accept/reject
      rfqCode: order.rfqCode // Include rfqCode for reference
    };
  }, [order, type]);

  const status = orderData ? statusConfig[orderData.status] : null;

  const handleAction = (action) => {
    const actionLabels = {
      confirm: { title: 'Xác nhận đơn hàng', message: 'Bạn có chắc chắn muốn xác nhận đơn hàng này?', variant: 'success' },
      shipping: { title: 'Cập nhật vận chuyển', message: 'Chuyển trạng thái sang "Đang giao hàng"?', variant: 'info' },
      complete: { title: 'Hoàn thành đơn hàng', message: 'Xác nhận đơn hàng đã hoàn thành?', variant: 'success' },
      cancel: { title: 'Hủy yêu cầu', message: 'Bạn có chắc chắn muốn hủy yêu cầu này?', variant: 'danger' },
      accept: { title: 'Chấp nhận báo giá', message: 'Bạn có chắc chắn muốn chấp nhận báo giá này?', variant: 'success' },
      reject: { title: 'Từ chối báo giá', message: 'Bạn có chắc chắn muốn từ chối báo giá này?', variant: 'danger' }
    };

    const config = actionLabels[action] || actionLabels.confirm;
    setConfirmModal({
      open: true,
      action,
      ...config
    });
  };

  const handleConfirmAction = async () => {
    // Map action to status - use Vietnamese for RFQ and Quotation
    const getNewStatus = () => {
      if (type === 'rfq') {
        const rfqStatusMap = {
          cancel: 'Đã hủy'
        };
        return rfqStatusMap[confirmModal.action];
      }

      if (type === 'quotation') {
        const quotationStatusMap = {
          accept: 'Đã chấp nhận',
          reject: 'Đã từ chối'
        };
        return quotationStatusMap[confirmModal.action];
      }
      
      const statusMap = {
        confirm: 'CONFIRMED',
        shipping: 'SHIPPING',
        complete: 'COMPLETED',
        cancel: 'CANCELLED'
      };
      return statusMap[confirmModal.action];
    };

    const newStatus = getNewStatus();
    if (newStatus) {
      try {
        const idKey = type === 'rfq' ? 'rfqId' : type === 'quotation' ? 'quotationId' : type === 'so' ? 'soId' : 'poId';
        await updateStatusMutation.mutateAsync({ [idKey]: id, status: newStatus });
        
        // For Quotation accept/reject, also update the related RFQ status
        if (type === 'quotation' && orderData.rfqId && (confirmModal.action === 'accept' || confirmModal.action === 'reject')) {
          try {
            await updateRfqStatusMutation.mutateAsync({ rfqId: orderData.rfqId, status: newStatus });
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
  if (isError || !orderData) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mp-glass-card p-8 text-center">
          <p className="text-red-500 mb-4">Không thể tải thông tin đơn hàng</p>
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
              <h1
                className="text-2xl lg:text-3xl font-bold"
                style={{ color: 'var(--mp-text-primary)' }}
              >
                {orderData.code}
              </h1>
              <span className={`mp-badge text-white ${status?.color}`}>
                {status?.label}
              </span>
            </div>
            <p
              className="mt-1 flex items-center gap-2"
              style={{ color: 'var(--mp-text-secondary)' }}
            >
              <Building2 size={16} />
              {orderData.companyName}
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
          
          {/* PDF and Print buttons - hide for RFQ and Quotation */}
          {type !== 'rfq' && type !== 'quotation' && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mp-btn mp-btn-secondary"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Xuất PDF</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mp-btn mp-btn-secondary"
              >
                <Printer size={18} />
                <span className="hidden sm:inline">In</span>
              </motion.button>
            </>
          )}

          {/* Cancel button - only for RFQ with status 'chưa báo giá' */}
          {type === 'rfq' && orderData.status === 'chưa báo giá' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setConfirmModal({ open: true, action: 'cancel' })}
              className="mp-btn bg-red-500 hover:bg-red-600 text-white"
            >
              Hủy yêu cầu
            </motion.button>
          )}

          {/* Accept/Reject buttons - only for Quotation from NCC with status 'Đã báo giá' */}
          {type === 'quotation' && orderData.status === 'Đã báo giá' && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setConfirmModal({ open: true, action: 'accept' })}
                className="mp-btn bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                Chấp nhận
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setConfirmModal({ open: true, action: 'reject' })}
                className="mp-btn bg-red-500 hover:bg-red-600 text-white"
              >
                Từ chối
              </motion.button>
            </>
          )}

          {/* 'Mua hàng' button - only for Quotation with status 'Đã chấp nhận' */}
          {type === 'quotation' && orderData.status === 'Đã chấp nhận' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/marketplace-v2/create-po/${id}`)}
              className="mp-btn bg-blue-500 hover:bg-blue-600 text-white"
            >
              Mua hàng
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Two-column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 70% */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mp-glass-card p-6"
          >
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: 'var(--mp-text-primary)' }}
            >
              Thông tin đơn hàng
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>
                  Người liên hệ
                </p>
                <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                  {orderData.contactPerson}
                </p>
                {orderData.contactPhone && (
                  <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
                    {orderData.contactPhone}
                  </p>
                )}
              </div>
              {orderData.companyAddress && (
                <div>
                  <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>
                    Địa chỉ
                  </p>
                  <p style={{ color: 'var(--mp-text-secondary)' }}>
                    {orderData.companyAddress}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>
                  Ngày tạo
                </p>
                <p className="flex items-center gap-2" style={{ color: 'var(--mp-text-primary)' }}>
                  <Calendar size={16} />
                  {formatDate(orderData.createdAt)}
                </p>
              </div>
              {orderData.expectedDelivery && (
                <div>
                  <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>
                    Ngày giao dự kiến
                  </p>
                  <p className="flex items-center gap-2 font-medium" style={{ color: 'var(--mp-primary-600)' }}>
                    <Package size={16} />
                    {formatDate(orderData.expectedDelivery)}
                  </p>
                </div>
              )}
            </div>
            {orderData.notes && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>
                  Ghi chú
                </p>
                <p style={{ color: 'var(--mp-text-secondary)' }}>
                  {orderData.notes}
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
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-lg font-semibold"
                style={{ color: 'var(--mp-text-primary)' }}
              >
                Danh sách sản phẩm
              </h2>
              <span
                className="text-sm"
                style={{ color: 'var(--mp-text-tertiary)' }}
              >
                {orderData.items.length} sản phẩm
              </span>
            </div>
            <ItemList items={orderData.items} />

            {/* Total */}
            <div className="mt-6 pt-4 border-t flex justify-between items-center" style={{ borderColor: 'var(--mp-border-light)' }}>
              <span
                className="text-lg font-medium"
                style={{ color: 'var(--mp-text-secondary)' }}
              >
                Tổng cộng
              </span>
              <span
                className="text-2xl font-bold"
                style={{ color: 'var(--mp-text-primary)' }}
              >
                {formatCurrency(orderData.totalAmount)}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Sidebar - 30% */}
        <div className="space-y-6">
          {/* Status Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mp-glass-card p-6"
          >
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: 'var(--mp-text-primary)' }}
            >
              {type === 'rfq' ? 'Trạng thái yêu cầu' : 'Trạng thái đơn hàng'}
            </h2>
            <StatusTimeline
              currentStatus={orderData.status}
              statusHistory={orderData.statusHistory}
              isCancelled={orderData.status === 'cancelled' || orderData.status === 'đã hủy'}
              type={type}
            />
          </motion.div>
        </div>
      </div>

      {/* Floating Actions */}
      <FloatingActions
        actions={[
          { icon: Package, label: 'Xác nhận', color: 'green', action: 'confirm', onClick: handleAction },
          { icon: Package, label: 'Đang giao', color: 'blue', action: 'shipping', onClick: handleAction },
        ]}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, action: null })}
        onConfirm={handleConfirmAction}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        loading={updateStatusMutation.isPending}
      />
    </div>
  );
};

export default OrderDetail;
