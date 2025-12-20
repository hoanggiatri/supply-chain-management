import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAnimatedCounter, useInView } from '../../hooks';

/**
 * Dashboard metric card with animated counter and glass morphism
 */
const MetricCard = ({
  icon,
  iconBg = 'bg-blue-500',
  label,
  value,
  trend = 'up',
  trendValue,
  onClick,
  delay = 0,
  loading = false
}) => {
  const navigate = useNavigate();
  const [ref, isInView] = useInView();

  // Parse numeric value for animation only if it's a pure number
  const isNumericValue = typeof value === 'number';
  const numericValue = isNumericValue ? value : 0;
  const animatedValue = useAnimatedCounter(isInView ? numericValue : 0, 1000);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="mp-glass-card p-6 cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        {/* Content */}
        <div className="space-y-2">
          <p
            className="text-sm font-medium"
            style={{ color: 'var(--mp-text-secondary)' }}
          >
            {label}
          </p>
          <motion.p
            className="text-3xl font-bold"
            style={{ color: 'var(--mp-text-primary)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
          >
            {loading 
              ? '...' 
              : isNumericValue 
                ? animatedValue.toLocaleString('vi-VN')
                : value}
          </motion.p>

          {/* Trend */}
          {trendValue && (
            <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-500'
              }`}>
              {trend === 'up' ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>

        {/* Icon */}
        <motion.div
          whileHover={{ rotate: 5, scale: 1.1 }}
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl ${iconBg} shadow-lg`}
          style={{
            boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.1)'
          }}
        >
          {icon}
        </motion.div>
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1))',
        }}
      />
    </motion.div>
  );
};

export default MetricCard;
