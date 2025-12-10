import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

const iconMap = {
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-100' },
  success: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-100' },
  danger: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-100' },
};

/**
 * Confirmation modal with slide-up animation
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'warning', // 'warning' | 'success' | 'info' | 'danger'
  loading = false
}) => {
  const { icon: Icon, color, bg } = iconMap[variant] || iconMap.warning;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 flex items-center justify-center p-4 mp-glass-modal-backdrop"
          style={{ zIndex: 'var(--mp-z-modal)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="mp-glass-modal w-full max-w-md p-6"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              style={{ color: 'var(--mp-text-tertiary)' }}
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
                className={`w-16 h-16 rounded-full flex items-center justify-center ${bg}`}
              >
                <Icon size={32} className={color} />
              </motion.div>
            </div>

            {/* Title */}
            <h3
              className="text-xl font-semibold text-center mb-2"
              style={{ color: 'var(--mp-text-primary)' }}
            >
              {title}
            </h3>

            {/* Message */}
            <p
              className="text-center mb-6"
              style={{ color: 'var(--mp-text-secondary)' }}
            >
              {message}
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                disabled={loading}
                className="flex-1 mp-btn mp-btn-secondary"
              >
                {cancelText}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 mp-btn mp-ripple ${variant === 'danger'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'mp-btn-primary'
                  }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang xử lý...
                  </span>
                ) : confirmText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
