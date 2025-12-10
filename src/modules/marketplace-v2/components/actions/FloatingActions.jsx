import { AnimatePresence, motion } from 'framer-motion';
import { Check, FileText, MoreVertical, Truck, X } from 'lucide-react';
import { useState } from 'react';

/**
 * Floating action button with tooltip and ripple effect
 */
const FloatingActionButton = ({
  icon: Icon,
  label,
  onClick,
  color = 'blue',
  disabled = false
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const colorMap = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/30',
    green: 'from-green-500 to-green-600 shadow-green-500/30',
    red: 'from-red-500 to-red-600 shadow-red-500/30',
    amber: 'from-amber-500 to-amber-600 shadow-amber-500/30',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/30',
  };

  return (
    <div className="relative">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg whitespace-nowrap text-sm font-medium"
            style={{
              backgroundColor: 'var(--mp-surface)',
              color: 'var(--mp-text-primary)',
              boxShadow: 'var(--mp-shadow-lg)'
            }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={onClick}
        disabled={disabled}
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg mp-ripple bg-gradient-to-br ${colorMap[color]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
      >
        <Icon size={20} />
      </motion.button>
    </div>
  );
};

/**
 * Floating action buttons group
 */
const FloatingActions = ({
  actions = [],
  isExpanded = false,
  onToggle
}) => {
  const [expanded, setExpanded] = useState(isExpanded);

  const defaultActions = [
    { icon: Check, label: 'Xác nhận đơn hàng', color: 'green', action: 'confirm' },
    { icon: Truck, label: 'Cập nhật vận chuyển', color: 'blue', action: 'shipping' },
    { icon: FileText, label: 'Xuất hóa đơn', color: 'purple', action: 'invoice' },
    { icon: X, label: 'Hủy đơn hàng', color: 'red', action: 'cancel' },
  ];

  const displayActions = actions.length > 0 ? actions : defaultActions;

  return (
    <div className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 flex flex-col-reverse items-center gap-3 z-50">
      {/* Action Buttons */}
      <AnimatePresence>
        {expanded && displayActions.map((action, index) => (
          <motion.div
            key={action.action}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ delay: index * 0.05 }}
          >
            <FloatingActionButton
              icon={action.icon}
              label={action.label}
              color={action.color}
              onClick={() => action.onClick?.(action.action)}
              disabled={action.disabled}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setExpanded(!expanded);
          onToggle?.(!expanded);
        }}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl mp-ripple bg-gradient-to-br from-blue-500 to-indigo-600"
      >
        <motion.div
          animate={{ rotate: expanded ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {expanded ? <X size={24} /> : <MoreVertical size={24} />}
        </motion.div>
      </motion.button>
    </div>
  );
};

export { FloatingActionButton };
export default FloatingActions;
