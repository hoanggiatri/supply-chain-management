import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Building2,
    Calendar,
    Check,
    FileText,
    Loader2,
    Send
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useCreateQuotation, useRfqById, useUpdateRfqStatus } from '../../../hooks/useApi';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

/**
 * Create Quotation Page (Sales Department)
 * Creates a quotation based on an existing RFQ from customer
 * Flow: CustomerRfqDetail -> navigate to this page with rfqId
 */
const CreateQuotation = () => {
  const navigate = useNavigate();
  const { rfqId } = useParams();
  
  const companyId = parseInt(localStorage.getItem('companyId'));
  const employeeName = localStorage.getItem('employeeName');

  // Fetch RFQ data
  const { data: rfq, isLoading: rfqLoading } = useRfqById(rfqId);
  
  // Mutations
  const createQuotationMutation = useCreateQuotation();
  const updateRfqStatusMutation = useUpdateRfqStatus();

  // Quotation State
  const [quotation, setQuotation] = useState({
    companyId,
    requestCompanyId: '',
    rfqId: parseInt(rfqId),
    taxRate: 0,
    subTotal: 0,
    taxAmount: 0,
    totalAmount: 0,
    createdBy: employeeName,
    status: 'Đã báo giá',
  });

  // Quotation Details - editable items with price, quantity, note
  const [quotationDetails, setQuotationDetails] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Map RFQ details to quotation details when RFQ loads
  useEffect(() => {
    if (rfq?.rfqDetails) {
      const details = rfq.rfqDetails.map((d) => ({
        itemId: d.supplierItemId,
        itemCode: d.supplierItemCode || d.item?.itemCode,
        itemName: d.supplierItemName || d.item?.itemName,
        discount: 0,
        quantity: d.quantity,
        note: d.note || '',
        customerItemId: d.itemId,
        itemPrice: d.supplierItemPrice || d.item?.exportPrice || 0,
        unit: d.item?.uom || 'Cái',
      }));
      setQuotationDetails(details);
      // Set request company ID from RFQ
      setQuotation(prev => ({ ...prev, requestCompanyId: rfq.companyId }));
    }
  }, [rfq]);

  // Calculate totals when details or tax rate change
  useEffect(() => {
    const subTotal = quotationDetails.reduce(
      (sum, d) => sum + ((d.itemPrice * d.quantity) - (d.discount || 0)),
      0
    );
    const taxAmount = (subTotal * quotation.taxRate) / 100;
    const totalAmount = subTotal + taxAmount;
    setQuotation((prev) => ({ ...prev, subTotal, taxAmount, totalAmount }));
  }, [quotation.taxRate, quotationDetails]);

  // Handler for tax rate change
  const handleTaxRateChange = (e) => {
    const value = parseFloat(e.target.value);
    setQuotation(prev => ({ 
      ...prev, 
      taxRate: isNaN(value) || value < 0 ? 0 : value 
    }));
  };

  // Handler for item field change (price, quantity, discount, note)
  const handleItemChange = (index, field, value) => {
    setQuotationDetails(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Submit quotation
  const handleSubmit = async () => {
    try {
      const request = {
        ...quotation,
        quotationDetails: quotationDetails.map((d) => ({
          itemId: d.itemId,
          discount: d.discount || 0,
          quantity: d.quantity,
          itemPrice: d.itemPrice,
          note: d.note || '',
          customerItemId: d.customerItemId,
        })),
      };

      await createQuotationMutation.mutateAsync(request);
      
      // Update RFQ status to "Đã báo giá"
      await updateRfqStatusMutation.mutateAsync({
        rfqId: parseInt(rfqId),
        status: 'Đã báo giá'
      });

      setShowSuccess(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      toast.success('Gửi báo giá thành công!');

      setTimeout(() => {
        navigate('/marketplace-v2/sales/customer-rfqs');
      }, 2000);

    } catch (error) {
      console.error('Error creating quotation:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi gửi báo giá!');
    }
  };

  // Items mapped for display in ItemList (read-only view)
  const displayItems = useMemo(() => {
    return quotationDetails.map((d, idx) => ({
      id: idx,
      code: d.itemCode,
      name: d.itemName,
      quantity: d.quantity,
      unit: d.unit,
      price: d.itemPrice,
      total: (d.itemPrice * d.quantity) - (d.discount || 0),
      discount: d.discount,
      note: d.note
    }));
  }, [quotationDetails]);

  // Loading state
  if (rfqLoading) {
    return (
      <div className="max-w-5xl mx-auto animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-64" />
        <div className="mp-glass-card p-6 h-64" />
        <div className="mp-glass-card p-6 h-48" />
      </div>
    );
  }

  // RFQ not found
  if (!rfq) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="mp-glass-card p-8 text-center">
          <p className="text-red-500 mb-4">Không tìm thấy yêu cầu báo giá</p>
          <button onClick={() => navigate(-1)} className="mp-btn mp-btn-secondary">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // Success screen
  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6"
        >
          <Check size={48} className="text-green-500" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--mp-text-primary)' }}>
          Gửi báo giá thành công!
        </h2>
        <p style={{ color: 'var(--mp-text-secondary)' }}>
          Báo giá của bạn đã được gửi đến khách hàng
        </p>
      </motion.div>
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
              Tạo báo giá
            </h1>
            <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
              Cho RFQ: {rfq.rfqCode}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex gap-3">
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
            disabled={createQuotationMutation.isPending}
            className="mp-btn mp-btn-primary"
          >
            {createQuotationMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send size={18} />
            )}
            Gửi báo giá
          </motion.button>
        </div>
      </motion.div>

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Building2 size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
            <div>
              <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Khách hàng</p>
              <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                {rfq.company?.companyName || 'Khách hàng'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FileText size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
            <div>
              <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Mã RFQ</p>
              <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                {rfq.rfqCode}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
            <div>
              <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Ngày yêu cầu</p>
              <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                {new Date(rfq.createdOn).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quotation Items - Editable Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mp-glass-card p-6"
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
          Danh sách hàng hóa báo giá
        </h2>

        {/* Editable Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--mp-border-light)' }}>
                <th className="py-3 px-2 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>STT</th>
                <th className="py-3 px-2 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Mã SP</th>
                <th className="py-3 px-2 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Tên sản phẩm</th>
                <th className="py-3 px-2 text-right font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>SL</th>
                <th className="py-3 px-2 text-right font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Đơn giá</th>
                <th className="py-3 px-2 text-right font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Giảm</th>
                <th className="py-3 px-2 text-right font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Thành tiền</th>
                <th className="py-3 px-2 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {quotationDetails.map((item, index) => (
                <tr 
                  key={index} 
                  className="border-b transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  style={{ borderColor: 'var(--mp-border-light)' }}
                >
                  <td className="py-3 px-2" style={{ color: 'var(--mp-text-secondary)' }}>{index + 1}</td>
                  <td className="py-3 px-2" style={{ color: 'var(--mp-text-primary)' }}>{item.itemCode}</td>
                  <td className="py-3 px-2 font-medium" style={{ color: 'var(--mp-text-primary)' }}>{item.itemName}</td>
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                      className="mp-input w-20 text-right py-1 px-2"
                      min="1"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      value={item.itemPrice}
                      onChange={(e) => handleItemChange(index, 'itemPrice', Math.max(0, parseFloat(e.target.value) || 0))}
                      className="mp-input w-28 text-right py-1 px-2 font-semibold text-blue-600"
                      min="0"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      value={item.discount || 0}
                      onChange={(e) => handleItemChange(index, 'discount', Math.max(0, parseFloat(e.target.value) || 0))}
                      className="mp-input w-24 text-right py-1 px-2"
                      min="0"
                    />
                  </td>
                  <td className="py-3 px-2 text-right font-semibold" style={{ color: 'var(--mp-text-primary)' }}>
                    {formatCurrency((item.itemPrice * item.quantity) - (item.discount || 0))}
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="text"
                      value={item.note || ''}
                      onChange={(e) => handleItemChange(index, 'note', e.target.value)}
                      placeholder="Ghi chú..."
                      className="mp-input w-full py-1 px-2 text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Totals Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mp-glass-card p-6"
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
          Tổng cộng
        </h2>
        
        <div className="flex flex-col items-end space-y-3">
          {/* Subtotal */}
          <div className="flex items-center justify-between w-full max-w-sm">
            <span style={{ color: 'var(--mp-text-secondary)' }}>Tổng tiền hàng:</span>
            <span className="font-semibold" style={{ color: 'var(--mp-text-primary)' }}>
              {formatCurrency(quotation.subTotal)}
            </span>
          </div>

          {/* Tax Rate Input */}
          <div className="flex items-center justify-between w-full max-w-sm">
            <span style={{ color: 'var(--mp-text-secondary)' }}>Thuế GTGT (%):</span>
            <input
              type="number"
              value={quotation.taxRate}
              onChange={handleTaxRateChange}
              className="mp-input w-24 text-right py-1 px-2"
              min="0"
              step="0.5"
            />
          </div>

          {/* Tax Amount */}
          <div className="flex items-center justify-between w-full max-w-sm">
            <span style={{ color: 'var(--mp-text-secondary)' }}>Tiền thuế:</span>
            <span className="font-semibold" style={{ color: 'var(--mp-text-primary)' }}>
              {formatCurrency(quotation.taxAmount)}
            </span>
          </div>

          {/* Divider */}
          <div className="w-full max-w-sm border-t" style={{ borderColor: 'var(--mp-border-light)' }} />

          {/* Total */}
          <div className="flex items-center justify-between w-full max-w-sm">
            <span className="text-lg font-semibold" style={{ color: 'var(--mp-text-primary)' }}>Tổng cộng:</span>
            <span className="text-2xl font-bold text-blue-600">
              {formatCurrency(quotation.totalAmount)}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateQuotation;
