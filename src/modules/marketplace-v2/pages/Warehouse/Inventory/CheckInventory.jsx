import * as InventoryService from '@/services/inventory/InventoryService';
import * as IssueTicketService from '@/services/inventory/IssueTicketService';
import dayjs from 'dayjs';
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
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useBomByItemId,
  useIncreaseOnDemand,
  useMoById,
  usePoById,
  useTransferTicketById,
  useUpdateMo,
  useUpdateTransferTicket,
  useWarehousesInCompany
} from '../../../hooks/useApi';

// Helper để lấy auth data
const getAuthData = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    const companyId = localStorage.getItem('companyId') || user?.companyId || user?.company?.id || null;
    const employeeName = localStorage.getItem('employeeName') || user?.employeeName || '';
    return { user, token, companyId, employeeName };
  } catch {
    return { user: null, token: null, companyId: null, employeeName: '' };
  }
};

const statusConfig = {
  'Đủ': { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
  'Không đủ': { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
  'Không có tồn kho': { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: AlertTriangle },
};

/**
 * Check Inventory Page
 * Validates inventory before confirming MO, TT or PO
 * 
 * Logic:
 * - MO (Manufacturing Order): Lấy BOM details, tính quantityNeeded = BOM quantity * MO quantity
 * - TT (Transfer Ticket): Lấy transfer ticket details, quantityNeeded = detail quantity
 * - PO (Purchase Order): Lấy PO details, quantityNeeded = detail quantity
 * 
 * After confirm:
 * - MO: Update MO status -> Create Issue Ticket -> Increase onDemand
 * - TT: Update TT status -> Create Issue Ticket -> Increase onDemand
 * - PO: Only save warehouseId and navigate to create SO
 */
const CheckInventory = () => {
  const navigate = useNavigate();
  const { type, id } = useParams();
  
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
  const [inventoryResults, setInventoryResults] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  // Fetch warehouses
  const { data: warehouses, isLoading: warehousesLoading } = useWarehousesInCompany();
  
  // Fetch data based on type
  const { data: po, isLoading: poLoading } = usePoById(id, { enabled: type === 'po' });
  const { data: mo, isLoading: moLoading } = useMoById(id, { enabled: type === 'mo' });
  const { data: tt, isLoading: ttLoading } = useTransferTicketById(id, { enabled: type === 'tt' });
  
  // Fetch BOM for MO
  const { data: bom, isLoading: bomLoading } = useBomByItemId(mo?.itemId, { 
    enabled: type === 'mo' && !!mo?.itemId 
  });

  // Mutations
  const updateMoMutation = useUpdateMo();
  const updateTtMutation = useUpdateTransferTicket();
  const increaseOnDemandMutation = useIncreaseOnDemand();

  // Items to check based on type
  const itemsToCheck = useMemo(() => {
    if (type === 'po' && po?.purchaseOrderDetails) {
      return po.purchaseOrderDetails.map(d => ({
        itemId: d.supplierItemId,
        itemCode: d.itemCode || d.supplierItemCode,
        itemName: d.itemName || d.supplierItemName,
        quantity: d.quantity
      }));
    }
    
    if (type === 'mo' && bom?.bomDetails && mo) {
      return bom.bomDetails.map(d => ({
        itemId: d.itemId,
        itemCode: d.itemCode,
        itemName: d.itemName,
        quantity: d.quantity * mo.quantity // BOM quantity * MO quantity
      }));
    }
    
    if (type === 'tt' && tt?.transferTicketDetails) {
      return tt.transferTicketDetails.map(d => ({
        itemId: d.itemId,
        itemCode: d.itemCode,
        itemName: d.itemName,
        quantity: d.quantity
      }));
    }
    
    return [];
  }, [type, po, mo, bom, tt]);

  // For TT, auto-select fromWarehouseId
  useMemo(() => {
    if (type === 'tt' && tt?.fromWarehouseId && !selectedWarehouseId) {
      setSelectedWarehouseId(String(tt.fromWarehouseId));
    }
  }, [type, tt, selectedWarehouseId]);

  // Convert date to ISO string
  const toISO8601String = (dateString) => {
    if (!dateString) return null;
    return dayjs(dateString).toISOString();
  };

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

  // Handle confirm
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

      // === MO: Update status, create issue ticket, increase onDemand ===
      if (type === 'mo' && mo) {
        // Update MO status to "Chờ sản xuất"
        await updateMoMutation.mutateAsync({
          moId: id,
          data: {
            itemId: Number(mo.itemId),
            lineId: Number(mo.lineId),
            type: mo.type,
            quantity: mo.quantity,
            estimatedStartTime: toISO8601String(mo.estimatedStartTime),
            estimatedEndTime: toISO8601String(mo.estimatedEndTime),
            status: 'Chờ sản xuất'
          }
        });

        // Create Issue Ticket
        const issueTicketRequest = {
          companyId: parseInt(companyId),
          warehouseId: parseInt(selectedWarehouseId),
          reason: 'Xuất kho để sản xuất',
          issueType: 'Sản xuất',
          referenceCode: mo.moCode,
          status: 'Chờ xác nhận',
          createdBy: employeeName,
          issueDate: new Date().toISOString()
        };
        await IssueTicketService.createIssueTicket(issueTicketRequest, token);

        // Increase onDemand for each item
        await Promise.all(
          inventoryResults.map(r =>
            increaseOnDemandMutation.mutateAsync({
              warehouseId: selectedWarehouseId,
              itemId: r.itemId,
              onDemandQuantity: r.quantityNeeded
            })
          )
        );

        toast.success('Đã xác nhận công lệnh sản xuất!');
        navigate(-1);
      }

      // === TT: Update status, create issue ticket, increase onDemand ===
      if (type === 'tt' && tt) {
        // Update Transfer Ticket status
        await updateTtMutation.mutateAsync({
          ticketId: id,
          request: {
            companyId: parseInt(companyId),
            status: 'Chờ xuất kho',
            reason: tt?.reason,
            fromWarehouseId: parseInt(tt?.fromWarehouseId),
            toWarehouseId: parseInt(tt?.toWarehouseId),
            createdBy: employeeName,
            transferTicketDetails: (tt?.transferTicketDetails || []).map(d => ({
              itemId: parseInt(d.itemId),
              quantity: parseFloat(d.quantity),
              note: d.note
            }))
          }
        });

        // Create Issue Ticket
        const issueTicketRequest = {
          companyId: parseInt(companyId),
          warehouseId: parseInt(selectedWarehouseId),
          reason: 'Xuất kho để chuyển kho',
          issueType: 'Chuyển kho',
          referenceCode: tt.ticketCode,
          status: 'Chờ xác nhận',
          createdBy: employeeName,
          issueDate: new Date().toISOString()
        };
        await IssueTicketService.createIssueTicket(issueTicketRequest, token);

        // Increase onDemand for each item
        await Promise.all(
          inventoryResults.map(r =>
            increaseOnDemandMutation.mutateAsync({
              warehouseId: selectedWarehouseId,
              itemId: r.itemId,
              onDemandQuantity: r.quantityNeeded
            })
          )
        );

        toast.success('Đã xác nhận phiếu chuyển kho!');
        navigate(-1);
      }

      // === PO: Only save warehouse and navigate to create SO ===
      if (type === 'po') {
        localStorage.setItem('poWarehouseId', selectedWarehouseId);
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
  const isLoading = warehousesLoading || poLoading || moLoading || ttLoading || bomLoading;
  const isWarehouseFixed = type === 'tt'; // TT uses fromWarehouseId, cannot change

  // Get title based on type
  const getTitle = () => {
    if (type === 'mo') return `Công lệnh: ${mo?.moCode || id}`;
    if (type === 'tt') return `Phiếu chuyển: ${tt?.ticketCode || id}`;
    if (type === 'po') return `Đơn hàng: ${po?.poCode || id}`;
    return `Mã: ${id}`;
  };

  // Get confirm button label
  const getConfirmLabel = () => {
    if (type === 'mo') return 'Xác nhận MO';
    if (type === 'tt') return 'Xác nhận Chuyển kho';
    if (type === 'po') return 'Xác nhận & Tạo SO';
    return 'Xác nhận';
  };

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
            {getTitle()}
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
              {isWarehouseFixed ? 'Kho xuất (từ phiếu chuyển)' : 'Chọn kho xuất'}
            </label>
            {isWarehouseFixed ? (
              // Show fixed warehouse for TT
              <div className="mp-input w-full" style={{ backgroundColor: 'var(--mp-bg-secondary)' }}>
                {warehouses?.find(w => String(w.warehouseId) === selectedWarehouseId)
                  ? `${warehouses.find(w => String(w.warehouseId) === selectedWarehouseId)?.warehouseCode} - ${warehouses.find(w => String(w.warehouseId) === selectedWarehouseId)?.warehouseName}`
                  : 'Đang tải...'}
              </div>
            ) : (
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
            )}
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
                Đang xử lý...
              </>
            ) : (
              <>
                <Check size={18} />
                {getConfirmLabel()}
              </>
            )}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default CheckInventory;
