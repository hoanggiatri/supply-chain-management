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
    order: { icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-100' },
    rfq: { icon: FileText, color: 'text-purple-500', bg: 'bg-purple-100' },
    quotation: { icon: Package, color: 'text-green-500', bg: 'bg-green-100' },
    status: { icon: RefreshCw, color: 'text-amber-500', bg: 'bg-amber-100' },
    completed: { icon: Check, color: 'text-emerald-500', bg: 'bg-emerald-100' },
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
 * Single activity item in the timeline
 */
const ActivityItem = ({ activity, index }) => {
  const { icon: Icon, color, bg } = getActivityIcon(activity.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="relative flex gap-4 pb-6 last:pb-0"
    >
      {/* Timeline Line */}
      <div className="absolute left-5 top-10 bottom-0 w-px bg-gradient-to-b from-gray-200 to-transparent" />

      {/* Icon */}
      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${bg} flex-shrink-0`}>
        <Icon size={18} className={color} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="font-medium text-sm"
          style={{ color: 'var(--mp-text-primary)' }}
        >
          {activity.title}
        </p>
        <p
          className="text-sm mt-0.5 line-clamp-2"
          style={{ color: 'var(--mp-text-secondary)' }}
        >
          {activity.description}
        </p>
        <p
          className="text-xs mt-1"
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
 */
const ActivityTimeline = ({ activities = [], loading = false }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock size={40} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--mp-text-tertiary)' }} />
        <p style={{ color: 'var(--mp-text-tertiary)' }}>Chưa có hoạt động nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {activities.map((activity, index) => (
        <ActivityItem key={activity.id} activity={activity} index={index} />
      ))}
    </div>
  );
};

export default ActivityTimeline;
