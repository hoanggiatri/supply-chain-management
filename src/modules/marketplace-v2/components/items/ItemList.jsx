import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Package } from 'lucide-react';
import { useState } from 'react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Single expandable item card
 */
const ItemCard = ({ item, index = 0, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="mp-glass-surface overflow-hidden"
    >
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        {/* Image/Placeholder */}
        <div
          className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--mp-bg-secondary)' }}
        >
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <Package size={24} style={{ color: 'var(--mp-text-tertiary)' }} />
          )}
        </div>

        {/* Basic Info */}
        <div className="flex-1 min-w-0">
          <p
            className="font-medium truncate"
            style={{ color: 'var(--mp-text-primary)' }}
          >
            {item.name}
          </p>
          <p
            className="text-sm"
            style={{ color: 'var(--mp-text-secondary)' }}
          >
            {item.sku || item.code}
          </p>
        </div>

        {/* Quantity & Price */}
        <div className="text-right">
          <p
            className="font-semibold"
            style={{ color: 'var(--mp-text-primary)' }}
          >
            {formatCurrency(item.subtotal || item.price * item.quantity)}
          </p>
          <p
            className="text-sm"
            style={{ color: 'var(--mp-text-tertiary)' }}
          >
            {item.quantity} x {formatCurrency(item.price)}
          </p>
        </div>

        {/* Expand Toggle */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
        </motion.div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pb-4 pt-2 border-t grid grid-cols-2 gap-4"
              style={{ borderColor: 'var(--mp-border-light)' }}
            >
              {item.unit && (
                <div>
                  <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--mp-text-tertiary)' }}>
                    Đơn vị
                  </p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {item.unit}
                  </p>
                </div>
              )}
              {item.note && (
                <div className="col-span-2">
                  <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--mp-text-tertiary)' }}>
                    Ghi chú
                  </p>
                  <p style={{ color: 'var(--mp-text-secondary)' }}>
                    {item.note}
                  </p>
                </div>
              )}
              {item.deliveryDate && (
                <div>
                  <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--mp-text-tertiary)' }}>
                    Ngày giao dự kiến
                  </p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {new Date(item.deliveryDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * List of expandable item cards
 */
const ItemList = ({ items = [], loading = false }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="mp-glass-surface p-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <Package size={40} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--mp-text-tertiary)' }} />
        <p style={{ color: 'var(--mp-text-tertiary)' }}>Không có sản phẩm nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <ItemCard key={item.id || index} item={item} index={index} />
      ))}
    </div>
  );
};

export { ItemCard };
export default ItemList;
