import { motion } from 'framer-motion';
import {
    Check,
    Clock,
    FileText,
    Package,
    RefreshCw,
    ShoppingCart
} from 'lucide-react';

const getActivityIcon = (type) => {
  const iconMap = {
    purchase: { icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-100' },
    sales: { icon: Package, color: 'text-green-500', bg: 'bg-green-100' },
    order: { icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-100' },
    rfq: { icon: FileText, color: 'text-purple-500', bg: 'bg-purple-100' },
    quotation: { icon: Package, color: 'text-green-500', bg: 'bg-green-100' },
    status: { icon: RefreshCw, color: 'text-amber-500', bg: 'bg-amber-100' },
    completed: { icon: Check, color: 'text-green-500', bg: 'bg-green-100' },
    pending: { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-100' },
  };
  return iconMap[type] || iconMap.order;
};

const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) return 'Vừa xong';
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} ngày trước`;

  return date.toLocaleDateString('vi-VN');
};

/**
 * Single activity item card
 */
const ActivityCard = ({ activity, index, onClick }) => {
  const { icon: Icon, color, bg } = getActivityIcon(activity.type);
  const isClickable = !!onClick;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={() => isClickable && onClick(activity)}
      className={`mp-glass-card p-4 flex gap-4 items-start ${
        isClickable ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''
      }`}
      whileHover={isClickable ? { scale: 1.01, y: -2 } : {}}
      whileTap={isClickable ? { scale: 0.99 } : {}}
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bg} flex-shrink-0`}>
        <Icon size={20} className={color} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="font-semibold text-sm mb-1"
          style={{ color: 'var(--mp-text-primary)' }}
        >
          {activity.title}
        </p>
        <p
          className="text-sm mb-2 line-clamp-2"
          style={{ color: 'var(--mp-text-secondary)' }}
        >
          {activity.description}
        </p>
        <p
          className="text-xs"
          style={{ color: 'var(--mp-text-tertiary)' }}
        >
          {formatTimeAgo(activity.timestamp)}
        </p>
      </div>
    </motion.div>
  );
};

/**
 * Activity timeline component for dashboard
 * @param {Array} activities - List of activities to display
 * @param {boolean} loading - Loading state
 * @param {number} columns - Number of columns (1, 2, or 3)
 * @param {Function} onActivityClick - Callback when activity is clicked
 */
const ActivityTimeline = ({ 
  activities = [], 
  loading = false,
  columns = 1,
  onActivityClick
}) => {
  // Grid class mapping
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }[columns] || 'grid-cols-1';

  if (loading) {
    return (
      <div className={`grid ${gridClass} gap-4`}>
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <div key={i} className="mp-glass-card p-4 flex gap-4 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock size={48} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--mp-text-tertiary)' }} />
        <p className="text-lg" style={{ color: 'var(--mp-text-tertiary)' }}>Chưa có hoạt động nào</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridClass} gap-4`}>
      {activities.map((activity, index) => (
        <ActivityCard 
          key={activity.id} 
          activity={activity} 
          index={index}
          onClick={onActivityClick}
        />
      ))}
    </div>
  );
};

export default ActivityTimeline;
