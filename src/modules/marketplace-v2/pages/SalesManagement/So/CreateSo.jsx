import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Building2,
    Calendar,
    Check,
    CreditCard,
    MapPin,
    Package,
    X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useCreateSo, usePoById, useUpdatePoStatus } from '../../../hooks/useApi';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

/**
 * Create Sales Order Page (Sales Department)
 * Creates a SO from a confirmed PO
 * Matches legacy CreateSo.jsx logic
 */
const CreateSo = () => {
  const { poId } = useParams();
  const navigate = useNavigate();
  
  const companyId = localStorage.getItem('companyId');
  const employeeName = localStorage.getItem('employeeName');
  const companyAddress = localStorage.getItem('companyAddress');
  const poWarehouseId = localStorage.getItem('poWarehouseId');

  // Fetch PO data
  const { data: po, isLoading } = usePoById(poId);
  const createSoMutation = useCreateSo();
  const updatePoStatusMutation = useUpdatePoStatus();

  // SO state
  const [so, setSo] = useState({
    companyId: '',
    customerCompanyId: '',
    poId: '',
    paymentMethod: '',
    createdBy: '',
    deliveryToAddress: '',
    deliveryFromAddress: '',
    status: 'Chờ xuất kho'
  });

  const [soDetails, setSoDetails] = useState([]);

  // Initialize SO from PO data
  useEffect(() => {
    if (po) {
      setSo({
        companyId: po.supplierCompanyId,
        customerCompanyId: po.companyId,
        poId: po.poId,
        paymentMethod: po.paymentMethod,
        createdBy: employeeName,
        deliveryToAddress: po.deliveryToAddress,
        deliveryFromAddress: companyAddress,
        status: 'Chờ xuất kho'
      });

      const details = (po.purchaseOrderDetails || []).map((d) => ({
        itemId: d.supplierItemId,
        itemCode: d.supplierItemCode,
        itemName: d.supplierItemName,
        quantity: d.quantity,
        itemPrice: d.itemPrice,
        discount: d.discount,
        note: d.note
      }));

      setSoDetails(details);
    }
  }, [po, employeeName, companyAddress]);

  // Calculate totals
  const { subTotal, taxAmount, totalAmount } = useMemo(() => {
    if (!po) return { subTotal: 0, taxAmount: 0, totalAmount: 0 };
    return {
      subTotal: po.subTotal || 0,
      taxAmount: po.taxAmount || 0,
      totalAmount: po.totalAmount || 0
    };
  }, [po]);

  const handleSubmit = async () => {
    try {
      // Create SO request - like legacy
      const request = {
        companyId: Number(so.companyId),
        customerCompanyId: Number(so.customerCompanyId),
        poId: Number(so.poId),
        paymentMethod: so.paymentMethod,
        deliveryToAddress: so.deliveryToAddress,
        deliveryFromAddress: so.deliveryFromAddress,
        createdBy: so.createdBy,
        status: so.status
      };

      await createSoMutation.mutateAsync(request);

      // Update PO status to "Đã xác nhận"
      await updatePoStatusMutation.mutateAsync({
        poId: poId,
        status: 'Đã xác nhận'
      });

      // Success animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      toast.success('Tạo đơn bán hàng thành công!');
      
      // Navigate to customer POs list
      setTimeout(() => {
        navigate('/marketplace-v2/customer-pos');
      }, 1500);

    } catch (error) {
      console.error('Error creating SO:', error);
      toast.error(error.response?.data?.message || 'Không thể tạo đơn bán hàng!');
    }
  };

  const handleCancel = () => {
    navigate(-1);
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

  if (!po) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mp-glass-card p-8 text-center">
          <p className="text-red-500 mb-4">Không tìm thấy đơn hàng</p>
          <button onClick={() => navigate(-1)} className="mp-btn mp-btn-secondary">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
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
              Tạo đơn bán hàng
            </h1>
            <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
              Từ PO: {po.poCode}
            </p>
          </div>
        </div>
      </motion.div>

      {/* General Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mp-glass-card p-6"
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
          Thông tin đơn hàng
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
            <Calendar size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
            <div>
              <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Ngày tạo PO</p>
              <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                {new Date(po.createdOn).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
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
          <div className="flex items-center gap-3">
            <Package size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
            <div>
              <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Số lượng sản phẩm</p>
              <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                {soDetails.length} sản phẩm
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Items Table */}
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
              {soDetails.map((d, index) => (
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
                    {formatCurrency((d.itemPrice || 0) * d.quantity - (d.discount || 0))}
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
                {formatCurrency(subTotal)}
              </span>
            </div>
            <div className="flex justify-between w-full max-w-xs">
              <span style={{ color: 'var(--mp-text-secondary)' }}>Thuế ({po.taxRate || 0}%):</span>
              <span className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                {formatCurrency(taxAmount)}
              </span>
            </div>
            <div className="flex justify-between w-full max-w-xs pt-2 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
              <span className="text-lg font-semibold" style={{ color: 'var(--mp-text-primary)' }}>Tổng cộng:</span>
              <span className="text-xl font-bold text-blue-500">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end gap-3"
      >
        <button
          onClick={handleCancel}
          className="mp-btn mp-btn-secondary"
        >
          <X size={18} />
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          className="mp-btn mp-btn-primary bg-emerald-500 hover:bg-emerald-600"
          disabled={createSoMutation.isPending}
        >
          <Check size={18} />
          {createSoMutation.isPending ? 'Đang tạo...' : 'Tạo đơn bán hàng'}
        </button>
      </motion.div>
    </div>
  );
};

export default CreateSo;
