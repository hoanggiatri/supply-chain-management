import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Edit, MapPin, Plus, Search, Warehouse } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../hooks';
import { useWarehousesInCompany } from '../../../hooks/useApi';

const WarehouseCard = ({ warehouse, onEdit }) => {
  return (
    <motion.div
      layout
      className="mp-glass-card p-5 group hover:border-blue-500/30 transition-all flex flex-col min-h-[280px]"
      whileHover={{ y: -4 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex-shrink-0">
            <Warehouse size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 
              className="font-semibold text-lg truncate" 
              style={{ color: 'var(--mp-text-primary)' }}
              title={warehouse.warehouseName}
            >
              {warehouse.warehouseName}
            </h3>
            <p className="text-sm font-medium" style={{ color: 'var(--mp-text-secondary)' }}>
              {warehouse.warehouseCode}
            </p>
          </div>
        </div>
        <span 
          className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ml-2 ${
            warehouse.status === 'Hoạt động' ? 'bg-green-100 text-green-700' :
            warehouse.status === 'Bảo trì' ? 'bg-amber-100 text-amber-700' :
            'bg-gray-100 text-gray-700'
          }`}
        >
          {warehouse.status}
        </span>
      </div>

      <div className="space-y-3 mb-5 flex-1">
        <div className="flex items-start gap-2 text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
          <MapPin size={16} className="mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{warehouse.address || 'Chưa cập nhật địa chỉ'}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-2 rounded-lg bg-gray-50 dark:bg-white/5">
             <span className="text-xs block" style={{ color: 'var(--mp-text-tertiary)' }}>Loại kho</span>
             <span className="text-sm font-medium truncate block" style={{ color: 'var(--mp-text-secondary)' }} title={warehouse.warehouseType}>{warehouse.warehouseType}</span>
          </div>
          <div className="p-2 rounded-lg bg-gray-50 dark:bg-white/5">
             <span className="text-xs block" style={{ color: 'var(--mp-text-tertiary)' }}>Sức chứa</span>
             <span className="text-sm font-medium" style={{ color: 'var(--mp-text-secondary)' }}>{warehouse.maxCapacity?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <motion.button
        onClick={() => onEdit(warehouse.warehouseId)}
        className="w-full py-2 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-white/5 mt-auto"
        style={{ color: 'var(--mp-text-secondary)' }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Edit size={16} />
        Chỉnh sửa
      </motion.button>
    </motion.div>
  );
};

const WarehouseList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: warehouses = [], isLoading } = useWarehousesInCompany();

  const filteredWarehouses = useMemo(() => {
    if (!debouncedSearch) return warehouses;
    const query = debouncedSearch.toLowerCase();
    return warehouses.filter(w => 
      w.warehouseName?.toLowerCase().includes(query) ||
      w.warehouseCode?.toLowerCase().includes(query) ||
      w.address?.toLowerCase().includes(query)
    );
  }, [warehouses, debouncedSearch]);

  const handleEdit = (id) => {
    navigate(`/marketplace-v2/warehouse/management/edit/${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>
            Quản lý Kho hàng
          </h1>
          <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
            Danh sách các kho hàng trong hệ thống
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/marketplace-v2/warehouse/management/create')}
          className="mp-btn mp-btn-primary self-start md:self-auto"
        >
          <Plus size={18} />
          Thêm kho mới
        </motion.button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative max-w-md"
      >
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--mp-text-tertiary)' }} />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, mã, địa chỉ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mp-input pl-10 w-full"
        />
      </motion.div>

      {/* List */}
      <AnimatePresence mode="popLayout">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="mp-glass-card h-64 animate-pulse bg-gray-100 dark:bg-white/5" />
            ))}
          </div>
        ) : filteredWarehouses.length > 0 ? (
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredWarehouses.map(warehouse => (
              <WarehouseCard 
                key={warehouse.warehouseId} 
                warehouse={warehouse} 
                onEdit={handleEdit} 
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
             <Building2 size={48} className="mx-auto mb-4 opacity-30" />
             <p className="text-gray-500">Không tìm thấy kho hàng nào</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WarehouseList;
