import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Building2,
    Calendar,
    CreditCard,
    FileText,
    Package,
    RefreshCw,
    Truck,
    XCircle
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ItemList from '../../../../components/items/ItemList';
import { StatusTimeline } from '../../../../components/timeline';
import ConfirmModal from '../../../../components/ui/ConfirmModal';
import {
    usePoById,
    useUpdatePoStatus
} from '../../../../hooks/useApi';

// PO Status Config - 6 trạng thái
const statusConfig = {
  'Chờ xác nhận': { label: 'Chờ xác nhận', colorClass: 'mp-badge-chua-bao-gia' },
  'Đã xác nhận': { label: 'Đã xác nhận', colorClass: 'mp-badge-da-bao-gia' },
  'Đang vận chuyển': { label: 'Đang vận chuyển', colorClass: 'mp-badge-da-bao-gia' },
  'Chờ nhập kho': { label: 'Chờ nhập kho', colorClass: 'mp-badge-qua-han' },
  'Đã hoàn thành': { label: 'Đã hoàn thành', colorClass: 'mp-badge-da-chap-nhan' },
  'Đã hủy': { label: 'Đã hủy', colorClass: 'mp-badge-da-huy' },
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
 * PO Detail Page (Chi tiết đơn mua hàng)
 * 6 trạng thái: Chờ xác nhận, Đã xác nhận, Đang vận chuyển, Chờ nhập kho, Đã hoàn thành, Đã hủy
 */
const PoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState({ open: false, action: null });

  // API hooks
  const { data: po, isLoading, isError, refetch } = usePoById(id);
  const updateStatusMutation = useUpdatePoStatus();

  // Map PO data
  const poData = useMemo(() => {
    if (!po) return null;

    const items = (po.purchaseOrderDetails || []).map((detail, index) => ({
      id: detail.purchaseOrderDetailId || index,
      code: detail.itemCode,
      name: detail.itemName,
      quantity: detail.quantity || 0,
      price: detail.itemPrice || 0,
      discount: detail.discount || 0,
      subtotal: (detail.quantity || 0) * (detail.itemPrice || 0) - (detail.discount || 0),
      note: detail.note || ''
    }));

    return {
      id: po.poId,
      code: po.poCode,
      status: po.status || 'Chờ xác nhận',
      supplierCompanyName: po.supplierCompanyName || 'N/A',
      supplierCompanyCode: po.supplierCompanyCode || '',
      quotationCode: po.quotationCode,
      quotationId: po.quotationId,
      paymentMethod: po.paymentMethod || 'N/A',
      deliveryAddress: po.deliveryToAddress || 'N/A',
      createdBy: po.createdBy || 'N/A',
      createdAt: po.createdOn,
      updatedAt: po.lastUpdatedOn,
      subTotal: po.subTotal || 0,
      taxRate: po.taxRate || 0,
      taxAmount: po.taxAmount || 0,
      totalAmount: po.totalAmount || 0,
      items: items
    };
  }, [po]);

  const status = poData ? statusConfig[poData.status] : null;

  // Action handlers
  const handleCancel = () => {
    setConfirmModal({
      open: true,
      action: 'cancel',
      title: 'Hủy đơn mua hàng',
      message: 'Bạn có chắc chắn muốn hủy đơn mua hàng này?',
      variant: 'danger'
    });
  };

  const handleViewDelivery = () => {
    // Navigate to delivery order process
    navigate(`/marketplace-v2/do-process/${id}`);
  };

  const handleViewInvoice = () => {
    // View invoice PDF
    console.log('View invoice for PO:', id);
  };

  const handleConfirmAction = async () => {
    if (confirmModal.action === 'cancel') {
      try {
        await updateStatusMutation.mutateAsync({ poId: id, status: 'Đã hủy' });
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
  if (isError || !poData) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mp-glass-card p-8 text-center">
          <p className="text-red-500 mb-4">Không thể tải thông tin đơn mua hàng</p>
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
                {poData.code}
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
              {poData.supplierCompanyName} (Nhà cung cấp)
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

          {/* Nút Hủy - chỉ khi status là 'Chờ xác nhận' */}
          {poData.status === 'Chờ xác nhận' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancel}
              className="mp-btn bg-red-500 hover:bg-red-600 text-white"
            >
              <XCircle size={18} />
              Hủy đơn
            </motion.button>
          )}

          {/* Nút Thông tin vận chuyển - khi Đang vận chuyển hoặc Chờ nhập kho */}
          {(poData.status === 'Đang vận chuyển' || poData.status === 'Chờ nhập kho') && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewDelivery}
              className="mp-btn bg-green-500 hover:bg-green-600 text-white"
            >
              <Truck size={18} />
              Thông tin vận chuyển
            </motion.button>
          )}

          {/* Nút Xem hóa đơn + Thông tin vận chuyển - khi Đã hoàn thành */}
          {poData.status === 'Đã hoàn thành' && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewInvoice}
                className="mp-btn mp-btn-secondary"
              >
                <FileText size={18} />
                Xem hóa đơn
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewDelivery}
                className="mp-btn bg-green-500 hover:bg-green-600 text-white"
              >
                <Truck size={18} />
                Thông tin vận chuyển
              </motion.button>
            </>
          )}
        </div>
      </motion.div>

      {/* Two-column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* PO Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mp-glass-card p-6"
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
              Thông tin đơn mua hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Mã đơn hàng</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{poData.code}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Mã báo giá liên quan</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{poData.quotationCode || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Nhà cung cấp</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{poData.supplierCompanyName}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Người tạo</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{poData.createdBy}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Ngày tạo</p>
                  <p className="font-medium flex items-center gap-2" style={{ color: 'var(--mp-text-primary)' }}>
                    <Calendar size={16} />
                    {formatDate(poData.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Phương thức thanh toán</p>
                  <p className="font-medium flex items-center gap-2" style={{ color: 'var(--mp-text-primary)' }}>
                    <CreditCard size={16} />
                    {poData.paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Địa chỉ giao hàng</p>
                  <p className="font-medium flex items-center gap-2" style={{ color: 'var(--mp-text-primary)' }}>
                    <Package size={16} />
                    {poData.deliveryAddress}
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
                    {formatCurrency(poData.subTotal)}
                  </p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Thuế ({poData.taxRate}%)</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {formatCurrency(poData.taxAmount)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Tổng cộng</p>
                  <p className="font-semibold text-xl" style={{ color: 'var(--mp-primary-600)' }}>
                    {formatCurrency(poData.totalAmount)}
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
              Danh sách hàng hóa ({poData.items.length})
            </h2>
            <ItemList items={poData.items} showPrice={true} />
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
              Trạng thái đơn hàng
            </h2>
            <StatusTimeline currentStatus={poData.status} type="po" />
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

export default PoDetail;
