/**
 * InventoryHeader Component
 * Page header with title, description, and action buttons
 */

import { motion } from 'framer-motion';
import { Plus, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InventoryHeader = ({ onRefresh, isLoading }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>
          Tồn kho
        </h1>
        <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
          Quản lý và theo dõi tồn kho
        </p>
      </div>
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/marketplace-v2/warehouse/inventory/add')}
          className="mp-btn mp-btn-primary"
        >
          <Plus size={18} />
          Thêm hàng
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRefresh}
          className="mp-glass-button p-3 rounded-xl"
          disabled={isLoading}
        >
          <RefreshCw
            size={20}
            className={isLoading ? 'animate-spin' : ''}
            style={{ color: 'var(--mp-text-secondary)' }}
          />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default InventoryHeader;
