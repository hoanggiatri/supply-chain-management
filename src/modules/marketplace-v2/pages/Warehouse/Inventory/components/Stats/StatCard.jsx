/**
 * StatCard Component
 * Individual stat card with icon, label, and animated value
 */

import { motion } from 'framer-motion';
import { formatNumber } from '../../utils/formatters';

const StatCard = ({ icon: Icon, color, label, value, delay = 0, highlight }) => {
  // Determine text color based on highlight type
  const getValueColor = () => {
    if (highlight === 'warning') return 'text-amber-500';
    if (highlight === 'danger') return 'text-red-500';
    return '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mp-glass-card p-4 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon size={18} style={{ color }} />
        <span 
          className="text-sm" 
          style={{ color: 'var(--mp-text-tertiary)' }}
        >
          {label}
        </span>
      </div>
      <motion.p
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.1, type: 'spring', stiffness: 200 }}
        className={`text-2xl font-bold ${getValueColor()}`}
        style={!highlight ? { color: 'var(--mp-text-primary)' } : {}}
      >
        {formatNumber(value)}
      </motion.p>
    </motion.div>
  );
};

export default StatCard;
