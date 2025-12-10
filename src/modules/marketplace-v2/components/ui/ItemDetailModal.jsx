import { AnimatePresence, motion } from 'framer-motion';
import {
    Box,
    FileText,
    Package,
    Tag,
    X
} from 'lucide-react';
import { useEffect } from 'react';

/**
 * Modal to display item/product details
 * Used in SupplierDetail page when clicking on a product card
 */
const ItemDetailModal = ({ item, isOpen, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal Container - centered */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="w-full max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              style={{ backgroundColor: 'var(--mp-bg-primary)' }}
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header */}
            <div 
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: 'var(--mp-border-light)' }}
            >
              <h2 
                className="text-lg font-semibold"
                style={{ color: 'var(--mp-text-primary)' }}
              >
                Chi tiết sản phẩm
              </h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={20} style={{ color: 'var(--mp-text-secondary)' }} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product Image */}
                <div className="md:w-1/2">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--mp-bg-secondary)' }}
                      >
                        <Package size={64} style={{ color: 'var(--mp-text-tertiary)' }} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="md:w-1/2 space-y-4">
                  {/* Name */}
                  <div>
                    <h3
                      className="text-xl font-bold"
                      style={{ color: 'var(--mp-text-primary)' }}
                    >
                      {item.name}
                    </h3>
                    <p
                      className="text-sm mt-1"
                      style={{ color: 'var(--mp-text-tertiary)' }}
                    >
                      Mã: {item.code}
                    </p>
                  </div>

                  {/* Type Badge */}
                  <div className="flex items-center gap-2">
                    <Tag size={16} style={{ color: 'var(--mp-primary-600)' }} />
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: 'var(--mp-primary-50)', 
                        color: 'var(--mp-primary-600)' 
                      }}
                    >
                      {item.type}
                    </span>
                  </div>

                  {/* Price */}
                  <div 
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: 'var(--mp-bg-secondary)' }}
                  >
                    <p 
                      className="text-sm"
                      style={{ color: 'var(--mp-text-secondary)' }}
                    >
                      Giá bán
                    </p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span 
                        className="text-3xl font-bold"
                        style={{ color: 'var(--mp-primary-600)' }}
                      >
                        {(item.price || 0).toLocaleString('vi-VN')}
                      </span>
                      <span 
                        className="text-lg"
                        style={{ color: 'var(--mp-text-secondary)' }}
                      >
                        đ / {item.unit}
                      </span>
                    </div>
                  </div>

                  {/* Specifications */}
                  {item.specs && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Box size={16} style={{ color: 'var(--mp-text-tertiary)' }} />
                        <span 
                          className="text-sm font-medium"
                          style={{ color: 'var(--mp-text-secondary)' }}
                        >
                          Thông số kỹ thuật
                        </span>
                      </div>
                      <p style={{ color: 'var(--mp-text-primary)' }}>
                        {item.specs}
                      </p>
                    </div>
                  )}

                  {/* Description */}
                  {item.description && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FileText size={16} style={{ color: 'var(--mp-text-tertiary)' }} />
                        <span 
                          className="text-sm font-medium"
                          style={{ color: 'var(--mp-text-secondary)' }}
                        >
                          Mô tả
                        </span>
                      </div>
                      <p style={{ color: 'var(--mp-text-primary)' }}>
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div 
              className="p-4 border-t flex gap-3 justify-end"
              style={{ borderColor: 'var(--mp-border-light)' }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="mp-btn mp-btn-secondary"
              >
                Đóng
              </motion.button>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ItemDetailModal;
