/**
 * InventoryTable Component
 * Enhanced table view with sorting and edit functionality
 */

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Package } from 'lucide-react';
import TableRow from './TableRow';

const InventoryTable = ({
  data,
  sortConfig,
  onSort,
  onEdit,
}) => {
  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  if (!data || data.length === 0) {
    return (
      <div className="mp-glass-card p-12 text-center">
        <Package size={48} className="mx-auto mb-4 opacity-30" />
        <p style={{ color: 'var(--mp-text-tertiary)' }}>Không tìm thấy sản phẩm nào</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="mp-glass-card overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr
              className="border-b"
              style={{
                borderColor: 'var(--mp-border-light)',
                backgroundColor: 'var(--mp-bg-secondary)',
              }}
            >
              <th
                className="py-3 px-4 text-left font-medium cursor-pointer select-none"
                style={{ color: 'var(--mp-text-tertiary)' }}
                onClick={() => onSort('itemCode')}
              >
                <div className="flex items-center gap-1">
                  Mã SP <SortIcon columnKey="itemCode" />
                </div>
              </th>
              <th
                className="py-3 px-4 text-left font-medium cursor-pointer select-none"
                style={{ color: 'var(--mp-text-tertiary)' }}
                onClick={() => onSort('itemName')}
              >
                <div className="flex items-center gap-1">
                  Tên sản phẩm <SortIcon columnKey="itemName" />
                </div>
              </th>
              <th
                className="py-3 px-4 text-left font-medium cursor-pointer select-none"
                style={{ color: 'var(--mp-text-tertiary)' }}
                onClick={() => onSort('warehouseCode')}
              >
                <div className="flex items-center gap-1">
                  Mã kho <SortIcon columnKey="warehouseCode" />
                </div>
              </th>
              <th
                className="py-3 px-4 text-left font-medium"
                style={{ color: 'var(--mp-text-tertiary)' }}
              >
                Tên kho
              </th>
              <th
                className="py-3 px-4 text-right font-medium cursor-pointer select-none"
                style={{ color: 'var(--mp-text-tertiary)' }}
                onClick={() => onSort('quantity')}
              >
                <div className="flex items-center justify-end gap-1">
                  Tồn kho <SortIcon columnKey="quantity" />
                </div>
              </th>
              <th
                className="py-3 px-4 text-right font-medium"
                style={{ color: 'var(--mp-text-tertiary)' }}
              >
                Cần dùng
              </th>
              <th
                className="py-3 px-4 text-center font-medium"
                style={{ color: 'var(--mp-text-tertiary)' }}
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {data.map((item, index) => (
                <TableRow
                  key={`${item.itemCode}-${item.warehouseCode}-${item.inventoryId}`}
                  item={item}
                  index={index}
                  onEdit={onEdit}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      <div
        className="p-4 border-t text-sm"
        style={{ borderColor: 'var(--mp-border-light)', color: 'var(--mp-text-tertiary)' }}
      >
        Hiển thị {data.length} bản ghi
      </div>
    </motion.div>
  );
};

export default InventoryTable;
