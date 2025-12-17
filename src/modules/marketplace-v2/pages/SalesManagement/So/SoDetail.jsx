import { getDeliveryOrderBySoId } from '@/services/delivery/DoService';
import { getInvoicePdf } from '@/services/sale/InvoiceService';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CreditCard,
  FileText,
  MapPin,
  Package,
  Truck
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { StatusTimeline } from '../../../components/timeline';
import { useSoById } from '../../../hooks/useApi';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

/**
 * Sales Order Detail Page (Sales Department)
 * View details of internal SO and track fulfillment
 */
const SoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deliveryOrder, setDeliveryOrder] = useState(null);
  const [loadingDo, setLoadingDo] = useState(false);

  const token = localStorage.getItem('token');

  // Fetch SO data
  const { data: so, isLoading } = useSoById(id);

  // Fetch Delivery Order when SO is loaded
  useEffect(() => {
    const fetchDeliveryOrder = async () => {
      if (so && so.soId && (so.status === 'Đang vận chuyển' || so.status === 'Đã hoàn thành')) {
        setLoadingDo(true);
        try {
          const doData = await getDeliveryOrderBySoId(so.soId, token);
          setDeliveryOrder(doData);
        } catch (error) {
          console.error('Error fetching delivery order:', error);
          // Delivery order may not exist yet
        } finally {
          setLoadingDo(false);
        }
      }
    };
    fetchDeliveryOrder();
  }, [so, token]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-64" />
        <div className="mp-glass-card p-6 h-64" />
        <div className="mp-glass-card p-6 h-48" />
      </div>
    );
  }

  if (!so) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mp-glass-card p-8 text-center">
          <p className="text-red-500 mb-4">Không tìm thấy đơn bán hàng</p>
          <button onClick={() => navigate(-1)} className="mp-btn mp-btn-secondary">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

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
            Chi tiết đơn bán hàng
          </h1>
          <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
            {so.soCode}
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
                    {so.customerCompanyName || 'Công ty khách hàng'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Mã đơn bán hàng</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {so.soCode || '---'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Ngày tạo</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {new Date(so.createdOn).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Mã đơn mua hàng</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {so.poCode || '---'}
                  </p>
                </div>
              </div>
               <div className="flex items-center gap-3">
                <Package size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Số lượng mục</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {so.salesOrderDetails.length} sản phẩm
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Delivery Info */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.15 }}
             className="mp-glass-card p-6"
           >
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
               Giao hàng & Thanh toán
             </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="flex items-start gap-3">
                   <MapPin size={20} style={{ color: 'var(--mp-text-tertiary)' }} className="mt-1" />
                   <div>
                     <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Địa chỉ giao hàng</p>
                     <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                       {so.deliveryToAddress || 'Chưa cập nhật'}
                     </p>
                   </div>
                 </div>
                 <div className="flex items-start gap-3">
                   <MapPin size={20} style={{ color: 'var(--mp-text-tertiary)' }} className="mt-1" />
                   <div>
                     <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Địa chỉ lấy hàng</p>
                     <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                       {so.deliveryFromAddress || 'Chưa cập nhật'}
                     </p>
                   </div>
                 </div>
                  <div className="flex items-center gap-3">
                   <CreditCard size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                   <div>
                     <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Phương thức thanh toán</p>
                     <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                       {so.paymentMethod || 'Chuyển khoản'}
                     </p>
                   </div>
                 </div>
                  <div className="flex items-center gap-3">
                   <Calendar size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                   <div>
                     <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Ngày giao hàng dự kiến</p>
                     <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                       {so.deliveryDate ? new Date(so.deliveryDate).toLocaleDateString('vi-VN') : 'Sớm nhất có thể'}
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
            
            {/* Items Table - like legacy SoDetail */}
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
                  {(so.salesOrderDetails || []).map((d, index) => (
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
             
            {/* Financial Summary - like legacy */}
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-col items-end space-y-2">
                <div className="flex justify-between w-full max-w-xs">
                  <span style={{ color: 'var(--mp-text-secondary)' }}>Tổng tiền hàng:</span>
                  <span className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {formatCurrency(so.subTotal)}
                  </span>
                </div>
                <div className="flex justify-between w-full max-w-xs">
                  <span style={{ color: 'var(--mp-text-secondary)' }}>Thuế ({so.taxRate || 0}%):</span>
                  <span className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {formatCurrency(so.taxAmount)}
                  </span>
                </div>
                <div className="flex justify-between w-full max-w-xs pt-2 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
                  <span className="text-lg font-semibold" style={{ color: 'var(--mp-text-primary)' }}>Tổng cộng:</span>
                  <span className="text-xl font-bold text-blue-500">
                    {formatCurrency(so.totalAmount)}
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
            {/* Note: Need to make sure StatusTimeline supports 'so' type or map it */}
            <StatusTimeline
              currentStatus={so.status}
              type="so"
            />
          </motion.div>

          {/* Action Buttons based on status - like legacy SoDetail */}
          {(so.status === 'Đang vận chuyển' || so.status === 'Đã hoàn thành') && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="mp-glass-card p-6 space-y-3"
            >
              {so.status === 'Đã hoàn thành' && (
                <button
                  onClick={async () => {
                    try {
                      await getInvoicePdf(so.soId, token);
                    } catch (error) {
                      console.error('Error getting invoice:', error);
                      toast.error('Không thể tải hóa đơn');
                    }
                  }}
                  className="w-full mp-btn mp-btn-secondary justify-center"
                >
                  <FileText size={18} />
                  Xem hóa đơn
                </button>
              )}
              <button
                onClick={() => {
                  if (deliveryOrder && deliveryOrder.doId) {
                    navigate(`/marketplace-v2/warehouse/delivery/${deliveryOrder.doId}`);
                  } else {
                    toast.info('Chưa có thông tin đơn vận chuyển');
                  }
                }}
                className="w-full mp-btn mp-btn-primary justify-center bg-emerald-500 hover:bg-emerald-600"
                disabled={loadingDo}
              >
                <Truck size={18} />
                {loadingDo ? 'Đang tải...' : 'Thông tin vận chuyển'}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoDetail;
