import { motion } from 'framer-motion';
import {
    Building2,
    Calendar,
    ChevronRight,
    Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const statusConfig = {
  // English statuses
  draft: { label: 'Nháp', colorClass: 'mp-badge-da-huy' },
  pending: { label: 'Chờ duyệt', colorClass: 'mp-badge-chua-bao-gia' },
  confirmed: { label: 'Đã xác nhận', colorClass: 'mp-badge-da-bao-gia' },
  processing: { label: 'Đang xử lý', colorClass: 'mp-badge-da-bao-gia' },
  shipping: { label: 'Đang giao', colorClass: 'mp-badge-da-bao-gia' },
  completed: { label: 'Hoàn thành', colorClass: 'mp-badge-da-chap-nhan' },
  cancelled: { label: 'Đã hủy', colorClass: 'mp-badge-da-huy' },
  // Vietnamese statuses (for RFQ - lowercase from API)
  'chưa báo giá': { label: 'Chưa báo giá', colorClass: 'mp-badge-chua-bao-gia' },
  'đã báo giá': { label: 'Đã báo giá', colorClass: 'mp-badge-da-bao-gia' },
  'quá hạn báo giá': { label: 'Quá hạn', colorClass: 'mp-badge-qua-han' },
  'đã chấp nhận': { label: 'Đã chấp nhận', colorClass: 'mp-badge-da-chap-nhan' },
  'đã từ chối': { label: 'Đã từ chối', colorClass: 'mp-badge-da-tu-choi' },
  'đã hủy': { label: 'Đã hủy', colorClass: 'mp-badge-da-huy' },
  // Vietnamese statuses (for Quotation - Uppercase from API)
  'Đã báo giá': { label: 'Đã báo giá', colorClass: 'mp-badge-da-bao-gia' },
  'Đã chấp nhận': { label: 'Đã chấp nhận', colorClass: 'mp-badge-da-chap-nhan' },
  'Đã từ chối': { label: 'Đã từ chối', colorClass: 'mp-badge-da-tu-choi' },
  'Đã hủy': { label: 'Đã hủy', colorClass: 'mp-badge-da-huy' },
  // Vietnamese statuses (for PO - from API)
  'Chờ xác nhận': { label: 'Chờ xác nhận', colorClass: 'mp-badge-chua-bao-gia' },
  'Đã xác nhận': { label: 'Đã xác nhận', colorClass: 'mp-badge-da-bao-gia' },
  'Đang vận chuyển': { label: 'Đang vận chuyển', colorClass: 'mp-badge-da-bao-gia' },
  'Chờ nhập kho': { label: 'Chờ nhập kho', colorClass: 'mp-badge-qua-han' },
  'Đã hoàn thành': { label: 'Đã hoàn thành', colorClass: 'mp-badge-da-chap-nhan' },
  // Vietnamese statuses (for SO - from API)
  'Chờ xuất kho': { label: 'Chờ xuất kho', colorClass: 'mp-badge-qua-han' },
  'Chờ vận chuyển': { label: 'Chờ vận chuyển', colorClass: 'mp-badge-chua-bao-gia' },
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Order card component with glass morphism and status glow effects
 */
const OrderCard = ({
  order,
  onClick,
  variant = 'grid', // 'grid' | 'kanban'
  index = 0
}) => {
  const navigate = useNavigate();
  const status = statusConfig[order.status] || statusConfig.pending;

  const handleClick = () => {
    if (onClick) {
      onClick(order);
    } else {
      navigate(`/marketplace-v2/order/${order.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ 
        y: -6,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className={`mp-card-elegant p-5 cursor-pointer group relative overflow-hidden ${variant === 'kanban' ? 'mb-3' : ''}`}
    >
      {/* Animated gradient border on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.1) 100%)',
          zIndex: -1
        }}
      />

      {/* Subtle gradient highlight on hover */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-all duration-500 bg-blue-400"
        style={{ transform: 'translate(40%, -40%)' }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <motion.p
            className="font-bold text-lg"
            style={{ color: 'var(--mp-text-primary)' }}
            whileHover={{ x: 2 }}
          >
            {order.code}
          </motion.p>
          <div className="flex items-center gap-2 mt-1">
            <motion.div whileHover={{ scale: 1.2, rotate: 5 }}>
              <Building2 size={14} style={{ color: 'var(--mp-text-tertiary)' }} />
            </motion.div>
            <span
              className="text-sm truncate max-w-40"
              style={{ color: 'var(--mp-text-secondary)' }}
            >
              {order.companyName}
            </span>
          </div>
        </div>

        {/* Status Badge - Using CSS classes for dark/light mode */}
        <motion.span 
          className={`mp-badge ${status.colorClass}`}
          whileHover={{ scale: 1.05, y: -2 }}
        >
          {status.label}
        </motion.span>
      </div>

      {/* Info Row */}
      <div className="flex items-center gap-4 mb-3 text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
        <motion.div 
          className="flex items-center gap-1"
          whileHover={{ scale: 1.05, color: 'var(--mp-primary-600)' }}
        >
          <Package size={14} />
          <span>{order.itemCount} sản phẩm</span>
        </motion.div>
        <motion.div 
          className="flex items-center gap-1"
          whileHover={{ scale: 1.05, color: 'var(--mp-primary-600)' }}
        >
          <Calendar size={14} />
          <span>{formatDate(order.createdAt)}</span>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
        <p
          className="font-semibold"
          style={{ color: 'var(--mp-text-primary)' }}
        >
          {formatCurrency(order.totalAmount)}
        </p>
        <motion.div
          initial={{ x: 0 }}
          whileHover={{ x: 4 }}
          className="flex items-center gap-1 text-sm font-medium"
          style={{ color: 'var(--mp-primary-600)' }}
        >
          Chi tiết
          <ChevronRight size={16} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrderCard;
