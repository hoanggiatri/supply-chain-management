/**
 * StatsGrid Component
 * Displays inventory statistics in a responsive grid layout
 */

import { motion } from 'framer-motion';
import { AlertTriangle, Box, Package, TrendingDown } from 'lucide-react';
import StatCard from './StatCard';

const StatsGrid = ({ stats }) => {
  const statsConfig = [
    {
      icon: Box,
      color: '#6366f1',
      label: 'Tổng tồn kho',
      value: stats.totalStock,
      key: 'totalStock'
    },
    {
      icon: Package,
      color: '#3b82f6',
      label: 'Số mặt hàng',
      value: stats.totalItems,
      key: 'totalItems'
    },
    {
      icon: TrendingDown,
      color: '#f59e0b',
      label: 'Sắp hết hàng',
      value: stats.lowStockItems,
      key: 'lowStockItems',
      highlight: 'warning'
    },
    {
      icon: AlertTriangle,
      color: '#ef4444',
      label: 'Hết hàng',
      value: stats.outOfStock,
      key: 'outOfStock',
      highlight: 'danger'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {statsConfig.map((config, index) => (
        <StatCard
          key={config.key}
          {...config}
          delay={index * 0.05}
        />
      ))}
    </motion.div>
  );
};

export default StatsGrid;
