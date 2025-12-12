import * as InventoryService from '@/services/inventory/InventoryService';
import * as IssueTicketService from '@/services/inventory/IssueTicketService';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    ArrowLeft,
    Check,
    CheckCircle,
    Loader2,
    Package,
    Search,
    Warehouse,
    XCircle
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
    useCheckInventory,
    useIncreaseOnDemand,
    usePoById,
    useWarehousesInCompany
} from '../../../hooks/useApi';

const statusConfig = {
  'Đủ': { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
  'Không đủ': { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
  'Không có tồn kho': { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: AlertTriangle },
};

/**
 * Check Inventory Page
 * Validates inventory before confirming PO and creating SO
 * Supports types: mo, tt, po
 */
const CheckInventory = () => {
  const navigate = useNavigate();
  const { type, id } = useParams();
  
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
  const [inventoryResults, setInventoryResults] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  // Fetch data
  const { data: warehouses, isLoading: warehousesLoading } = useWarehousesInCompany();
  const { data: po, isLoading: poLoading } = usePoById(id, { enabled: type === 'po' });
  
  // Mutations
  const checkInventoryMutation = useCheckInventory();
  const increaseOnDemandMutation = useIncreaseOnDemand();

  // Get auth data
  const getAuthData = useCallback(() => {
    return {
      token: localStorage.getItem('token'),
      companyId: parseInt(localStorage.getItem('companyId')),
      employeeName: localStorage.getItem('employeeName')
    };
  }, []);

  // Items to check based on type
  const itemsToCheck = useMemo(() => {
    if (type === 'po' && po?.purchaseOrderDetails) {
      return po.purchaseOrderDetails.map(d => ({
        itemId: d.supplierItemId,
        itemCode: d.itemCode,
        itemName: d.itemName,
        quantity: d.quantity
      }));
    }
    return [];
  }, [type, po]);

  // Handle inventory check
  const handleCheckInventory = async () => {
    if (!selectedWarehouseId) {
      toast.warning('Vui lòng chọn kho xuất!');
      return;
    }

    if (itemsToCheck.length === 0) {
      toast.warning('Không có hàng hóa để kiểm tra!');
      return;
    }

    setIsChecking(true);
    setInventoryResults([]);

    try {
      const { token, companyId } = getAuthData();
      
      const results = await Promise.all(
        itemsToCheck.map(async (item) => {
          try {
            // Get current inventory
            const inventories = await InventoryService.getAllInventory(
              item.itemId,
              selectedWarehouseId,
              companyId,
              token
            );
            
            const available = inventories?.[0]?.quantity - (inventories?.[0]?.onDemandQuantity || 0) || 0;
            
            // Check if enough
            const checkResult = await InventoryService.checkInventory(
              item.itemId,
              selectedWarehouseId,
              item.quantity,
              token
            );

            return {
              ...item,
              quantityNeeded: item.quantity,
              available,
              enough: checkResult
            };
          } catch (error) {
            console.error(`Error checking item ${item.itemId}:`, error);
            return {
              ...item,
              quantityNeeded: item.quantity,
              available: 0,
              enough: 'Không có tồn kho'
            };
          }
        })
      );

      setInventoryResults(results);
      
      const allEnough = results.every(r => r.enough === 'Đủ');
      if (allEnough) {
        toast.success('Tất cả hàng hóa đủ số lượng!');
      } else {
        toast.warning('Có hàng hóa không đủ số lượng!');
      }
    } catch (error) {
      console.error('Error checking inventory:', error);
      toast.error('Lỗi khi kiểm tra tồn kho!');
    } finally {
      setIsChecking(false);
    }
  };

  // Handle confirm - reserve inventory and navigate to create SO
  const handleConfirm = async () => {
    if (inventoryResults.length === 0) {
      toast.warning('Vui lòng kiểm tra tồn kho trước!');
      return;
    }

    const allEnough = inventoryResults.every(r => r.enough === 'Đủ');
    if (!allEnough) {
      toast.error('Không thể xác nhận - có hàng hóa không đủ số lượng!');
      return;
    }

    setIsConfirming(true);

    try {
      const { token, companyId, employeeName } = getAuthData();

      if (type === 'po') {
        // Save selected warehouse for SO creation
        localStorage.setItem('poWarehouseId', selectedWarehouseId);

        // Create issue ticket
        const issueTicketRequest = {
          companyId,
          warehouseId: parseInt(selectedWarehouseId),
          reason: 'Xuất kho để bán hàng',
          issueType: 'Bán hàng',
          referenceCode: po.poCode,
          status: 'Chờ xác nhận',
          createdBy: employeeName,
          issueDate: new Date().toISOString(),
        };

        await IssueTicketService.createIssueTicket(issueTicketRequest, token);

        // Increase onDemand for all items
        await Promise.all(
          inventoryResults.map(r => 
            InventoryService.increaseOnDemand({
              warehouseId: parseInt(selectedWarehouseId),
              itemId: parseInt(r.itemId),
              onDemandQuantity: r.quantityNeeded,
            }, token)
          )
        );

        toast.success('Đã xác nhận tồn kho! Chuyển đến tạo đơn bán hàng...');
        navigate(`/marketplace-v2/create-so/${id}`);
      }
    } catch (error) {
      console.error('Error confirming:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi xác nhận!');
    } finally {
      setIsConfirming(false);
    }
  };

  const allEnough = inventoryResults.length > 0 && inventoryResults.every(r => r.enough === 'Đủ');
  const isLoading = warehousesLoading || poLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="mp-glass-button p-2 rounded-xl"
        >
          <ArrowLeft size={20} style={{ color: 'var(--mp-text-secondary)' }} />
        </motion.button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--mp-text-primary)' }}>
            <Warehouse size={28} />
            Kiểm tra tồn kho
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--mp-text-secondary)' }}>
            {type === 'po' ? `Đơn hàng: ${po?.poCode}` : `Mã: ${id}`}
          </p>
        </div>
      </motion.div>

      {/* Warehouse Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mp-glass-card p-6"
      >
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--mp-text-secondary)' }}>
              <Warehouse size={16} className="inline mr-2" />
              Chọn kho xuất
            </label>
            <select
              value={selectedWarehouseId}
              onChange={(e) => {
                setSelectedWarehouseId(e.target.value);
                setInventoryResults([]);
              }}
              className="mp-input w-full"
            >
              <option value="">-- Chọn kho --</option>
              {(warehouses || []).map(wh => (
                <option key={wh.warehouseId} value={wh.warehouseId}>
                  {wh.warehouseCode} - {wh.warehouseName}
                </option>
              ))}
            </select>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheckInventory}
            disabled={!selectedWarehouseId || isChecking}
            className="mp-btn mp-btn-secondary"
          >
            {isChecking ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang kiểm tra...
              </>
            ) : (
              <>
                <Search size={18} />
                Kiểm tra tồn kho
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Results Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mp-glass-card overflow-hidden"
      >
        <div className="p-4 border-b" style={{ borderColor: 'var(--mp-border-light)' }}>
          <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--mp-text-primary)' }}>
            <Package size={18} />
            Kết quả kiểm tra ({inventoryResults.length} sản phẩm)
          </h3>
        </div>

        {inventoryResults.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto mb-4" style={{ color: 'var(--mp-text-tertiary)' }} />
            <p style={{ color: 'var(--mp-text-tertiary)' }}>
              {selectedWarehouseId ? 'Nhấn "Kiểm tra tồn kho" để xem kết quả' : 'Vui lòng chọn kho xuất'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--mp-bg-secondary)' }}>
                  <th className="py-3 px-4 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Mã hàng hóa</th>
                  <th className="py-3 px-4 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Tên hàng hóa</th>
                  <th className="py-3 px-4 text-right font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Số lượng cần</th>
                  <th className="py-3 px-4 text-right font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Tồn kho sẵn có</th>
                  <th className="py-3 px-4 text-center font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {inventoryResults.map((result, index) => {
                    const StatusIcon = statusConfig[result.enough]?.icon || AlertTriangle;
                    return (
                      <motion.tr
                        key={result.itemId || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        style={{ borderColor: 'var(--mp-border-light)' }}
                      >
                        <td className="py-3 px-4 font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                          {result.itemCode}
                        </td>
                        <td className="py-3 px-4" style={{ color: 'var(--mp-text-secondary)' }}>
                          {result.itemName}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-blue-600">
                          {result.quantityNeeded?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold" style={{ color: result.enough === 'Đủ' ? 'var(--mp-success)' : 'var(--mp-error)' }}>
                          {result.enough === 'Không có tồn kho' ? '-' : result.available?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[result.enough]?.color || 'bg-gray-100 text-gray-700'}`}>
                            <StatusIcon size={14} />
                            {result.enough}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Action Buttons */}
      {inventoryResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="mp-btn mp-btn-secondary"
          >
            Hủy
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirm}
            disabled={!allEnough || isConfirming}
            className={`mp-btn ${allEnough ? 'mp-btn-primary bg-emerald-500 hover:bg-emerald-600' : 'mp-btn-secondary'}`}
          >
            {isConfirming ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang xác nhận...
              </>
            ) : (
              <>
                <Check size={18} />
                Xác nhận & Tạo SO
              </>
            )}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default CheckInventory;
