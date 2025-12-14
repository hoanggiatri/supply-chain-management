import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  CreditCard,
  MapPin,
  Package,
  Save,
  Warehouse
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import ItemList from '../../../../components/items/ItemList';
import ConfirmModal from '../../../../components/ui/ConfirmModal';
import { useCreatePo, useQuotationById, useWarehousesInCompany } from '../../../../hooks/useApi';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

/**
 * Create PO Page - Tạo đơn mua hàng từ Quotation
 * Flow: Quotation (Đã chấp nhận) -> Tạo PO -> PO (Chờ xác nhận)
 */
const CreatePo = () => {
  const { quotationId } = useParams();
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState({ open: false });

  // User info
  const employeeName = localStorage.getItem('employeeName') || '';
  const companyAddress = localStorage.getItem('companyAddress') || '';
  const companyId = localStorage.getItem('companyId') || '';

  // Form state
  const [formData, setFormData] = useState({
    paymentMethod: 'Ghi công nợ',
    receiveWarehouseId: '',
    deliveryToAddress: companyAddress,
  });
  const [errors, setErrors] = useState({});

  // API hooks
  const { data: quotation, isLoading: isLoadingQuotation } = useQuotationById(quotationId);
  const { data: warehouses = [] } = useWarehousesInCompany();
  const createPoMutation = useCreatePo();

  // Update address when companyAddress changes
  useEffect(() => {
    if (companyAddress) {
      setFormData(prev => ({ ...prev, deliveryToAddress: companyAddress }));
    }
  }, [companyAddress]);

  // Map quotation details to items for display
  const items = useMemo(() => {
    if (!quotation?.quotationDetails) return [];
    return quotation.quotationDetails.map(d => ({
      id: d.quotationDetailId,
      code: d.customerItemCode,
      name: d.customerItemName,
      supplierCode: d.itemCode,
      supplierName: d.itemName,
      quantity: d.quantity || 0,
      price: d.itemPrice || 0,
      discount: d.discount || 0,
      subtotal: (d.quantity || 0) * (d.itemPrice || 0) - (d.discount || 0),
      note: d.note || ''
    }));
  }, [quotation]);

  // Payment methods
  const paymentMethods = [
    'Ghi công nợ',
    'Chuyển khoản',
    'Tiền mặt',
    'Thẻ tín dụng'
  ];

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!formData.receiveWarehouseId) {
      newErrors.receiveWarehouseId = 'Vui lòng chọn kho nhập hàng';
    }
    if (!formData.deliveryToAddress?.trim()) {
      newErrors.deliveryToAddress = 'Địa chỉ giao hàng không được để trống';
    }
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Vui lòng chọn phương thức thanh toán';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validate()) return;

    setConfirmModal({
      open: true,
      title: 'Xác nhận tạo đơn',
      message: 'Bạn có chắc chắn muốn tạo đơn mua hàng này?',
      variant: 'info'
    });
  };
  const handleConfirmCreate = async () => {
    try {
      const request = {
        companyId: Number(companyId),
        supplierCompanyId: Number(quotation.companyId),
        quotationId: Number(quotationId),
        receiveWarehouseId: Number(formData.receiveWarehouseId),
        paymentMethod: formData.paymentMethod,
        deliveryToAddress: formData.deliveryToAddress,
        createdBy: employeeName,
        status: 'Chờ xác nhận'
      };
      
      await createPoMutation.mutateAsync(request);
      // Nếu đến được đây nghĩa là thành công (2xx response)
      toast.success('Tạo đơn mua hàng thành công!');
      navigate('/marketplace-v2/pos');
    } catch (error) {
      console.error('Error creating PO:', error);
      toast.error(error.response?.data?.message || "Tạo đơn mua hàng thất bại. Vui lòng thử lại!");
    }
    setConfirmModal({ open: false });
  };

  // ... rest of component

  // Loading state
  if (isLoadingQuotation) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-64" />
        <div className="mp-glass-card p-6 h-64" />
        <div className="mp-glass-card p-6 h-48" />
      </div>
    );
  }

  // Error state
  if (!quotation) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mp-glass-card p-8 text-center">
          <p className="text-red-500 mb-4">Không thể tải thông tin báo giá</p>
          <button onClick={() => navigate(-1)} className="mp-btn mp-btn-secondary">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
            Tạo đơn mua hàng
          </h1>
          <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
            Từ báo giá: {quotation.quotationCode}
          </p>
        </div>
      </motion.div>

      {/* Quotation Info */}
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
          <div className="flex items-center gap-3">
            <Building2 size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
            <div>
              <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Nhà cung cấp</p>
              <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                {quotation.companyName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Package size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
            <div>
              <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Số lượng sản phẩm</p>
              <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                {items.length} sản phẩm
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mp-glass-card p-6"
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
          Thông tin đơn mua hàng
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kho nhập hàng */}
          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium" style={{ color: 'var(--mp-text-primary)' }}>
              <Warehouse size={16} />
              Kho nhập hàng <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.receiveWarehouseId}
              onChange={(e) => setFormData(prev => ({ ...prev, receiveWarehouseId: e.target.value }))}
              className={`w-full mp-input ${errors.receiveWarehouseId ? 'border-red-500' : ''}`}
            >
              <option value="">Chọn kho nhập hàng</option>
              {warehouses.map(wh => (
                <option key={wh.warehouseId} value={wh.warehouseId}>
                  {wh.warehouseCode} - {wh.warehouseName}
                </option>
              ))}
            </select>
            {errors.receiveWarehouseId && (
              <p className="text-red-500 text-sm mt-1">{errors.receiveWarehouseId}</p>
            )}
          </div>

          {/* Phương thức thanh toán */}
          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium" style={{ color: 'var(--mp-text-primary)' }}>
              <CreditCard size={16} />
              Phương thức thanh toán <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
              className={`w-full mp-input ${errors.paymentMethod ? 'border-red-500' : ''}`}
            >
              {paymentMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>
            )}
          </div>

          {/* Địa chỉ giao hàng */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 mb-2 text-sm font-medium" style={{ color: 'var(--mp-text-primary)' }}>
              <MapPin size={16} />
              Địa chỉ giao hàng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.deliveryToAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, deliveryToAddress: e.target.value }))}
              className={`w-full mp-input ${errors.deliveryToAddress ? 'border-red-500' : ''}`}
              placeholder="Nhập địa chỉ giao hàng"
            />
            {errors.deliveryToAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.deliveryToAddress}</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Items List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mp-glass-card p-6"
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
          Danh sách hàng hóa ({items.length})
        </h2>
        <ItemList items={items} showPrice={true} />

        {/* Summary */}
        <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Tổng tiền hàng</p>
              <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                {formatCurrency(quotation.subTotal)}
              </p>
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Thuế ({quotation.taxRate}%)</p>
              <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                {formatCurrency(quotation.taxAmount)}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Tổng cộng</p>
              <p className="font-semibold text-xl" style={{ color: 'var(--mp-primary-600)' }}>
                {formatCurrency(quotation.totalAmount)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(-1)}
          className="mp-btn mp-btn-secondary"
        >
          Hủy
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="mp-btn mp-btn-primary"
          disabled={createPoMutation.isPending}
        >
          <Save size={18} />
          Tạo đơn mua hàng
        </motion.button>
      </motion.div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false })}
        onConfirm={handleConfirmCreate}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        isLoading={createPoMutation.isPending}
      />
    </div>
  );
};

export default CreatePo;
