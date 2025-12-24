import * as ProductService from '@/services/general/ProductService';
import * as ReceiveTicketService from '@/services/inventory/ReceiveTicketService';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Edit,
  Factory,
  Loader2,
  Package,
  QrCode,
  RefreshCw,
  Settings,
  Truck,
  Warehouse,
  X,
  XCircle
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useCompleteMo,
  useMoById,
  useProcessesInMo,
  useUpdateMo,
  useUpdateProcess,
  useWarehousesInCompany
} from '../../../hooks/useApi';

// Status configuration
const statusConfig = {
  'Chờ xác nhận': { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
  'Chờ sản xuất': { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Clock },
  'Đang sản xuất': { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: Factory },
  'Chờ nhập kho': { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: Warehouse },
  'Đã nhập kho': { color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400', icon: Package },
  'Đã hoàn thành': { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
  'Đã hủy': { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
};

// Process status configuration
const processStatusConfig = {
  'Chưa bắt đầu': { color: 'bg-gray-100 text-gray-600', dotColor: 'bg-gray-400' },
  'Đang thực hiện': { color: 'bg-blue-100 text-blue-700', dotColor: 'bg-blue-500' },
  'Đã hoàn thành': { color: 'bg-green-100 text-green-700', dotColor: 'bg-green-500' },
};

/**
 * MO Detail Page
 * Displays manufacturing order details with process timeline and workflow actions
 */
const MoDetail = () => {
  const navigate = useNavigate();
  const { moId } = useParams();
  
  // Modal states
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completedQuantity, setCompletedQuantity] = useState(0);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
  const [hasRequestedReceive, setHasRequestedReceive] = useState(false);
  const [receiveTicketId, setReceiveTicketId] = useState(null);

  // Fetch data
  const { data: mo, isLoading: moLoading, refetch: refetchMo } = useMoById(moId);
  const { data: processesData, isLoading: processesLoading, refetch: refetchProcesses } = useProcessesInMo(moId);
  const { data: warehouses } = useWarehousesInCompany();
  
  // Mutations
  const updateMoMutation = useUpdateMo();
  const updateProcessMutation = useUpdateProcess();
  const completeMoMutation = useCompleteMo();

  // Get auth data
  const getAuthData = useCallback(() => ({
    token: localStorage.getItem('token'),
    companyId: parseInt(localStorage.getItem('companyId')),
    employeeName: localStorage.getItem('employeeName')
  }), []);

  // Sort processes by order
  const processes = useMemo(() => {
    if (!processesData) return [];
    return [...processesData].sort((a, b) => a.stageDetailOrder - b.stageDetailOrder);
  }, [processesData]);

  // Check for existing receive ticket
  useEffect(() => {
    const checkExistingReceiveTicket = async () => {
      if (!mo || mo.status !== 'Chờ nhập kho') return;

      try {
        const { token, companyId } = getAuthData();
        const allTickets = await ReceiveTicketService.getAllReceiveTicketsInCompany(companyId, token);
        const existingTicket = allTickets.find(
          t => t.receiveType === 'Sản xuất' && 
               t.referenceCode === mo.moCode &&
               (t.status === 'Chờ xác nhận' || t.status === 'Chờ nhập kho')
        );
        
        if (existingTicket) {
          setHasRequestedReceive(true);
          setReceiveTicketId(existingTicket.ticketId);
        }
      } catch (error) {
        console.error('Error checking receive ticket:', error);
      }
    };

    checkExistingReceiveTicket();
  }, [mo, moId, getAuthData]);

  // Format date helper
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return dayjs(date).format('DD/MM/YYYY HH:mm');
  };

  const toISO8601String = (dateString) => {
    if (!dateString) return null;
    return dayjs(dateString).toISOString();
  };

  // Handle confirm MO (go to inventory check)
  const handleConfirmMo = () => {
    navigate(`/marketplace-v2/check-inventory/mo/${moId}`);
  };

  // Handle cancel MO
  const handleCancelMo = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy công lệnh này không?')) return;

    try {
      await updateMoMutation.mutateAsync({
        moId,
        data: {
          itemId: Number(mo.itemId),
          lineId: Number(mo.lineId),
          type: mo.type,
          quantity: mo.quantity,
          estimatedStartTime: toISO8601String(mo.estimatedStartTime),
          estimatedEndTime: toISO8601String(mo.estimatedEndTime),
          status: 'Đã hủy'
        }
      });
      toast.success('Đã hủy công lệnh!');
      refetchMo();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi hủy công lệnh!');
    }
  };

  // Handle complete process
  const handleCompleteProcess = async (currentProcess) => {
    const now = dayjs().format('YYYY-MM-DDTHH:mm:ss');
    const moIdNum = Number(moId);

    try {
      const startedOn = currentProcess.startedOn || now;
      const isFirstProcess = currentProcess.stageDetailOrder === 1;
      const isStartingFirstProcess = !currentProcess.startedOn && isFirstProcess;

      // If starting first process and MO is "Chờ sản xuất", update to "Đang sản xuất"
      if (isStartingFirstProcess && mo.status === 'Chờ sản xuất') {
        await updateMoMutation.mutateAsync({
          moId: moIdNum,
          data: {
            itemId: Number(mo.itemId),
            lineId: Number(mo.lineId),
            type: mo.type,
            quantity: mo.quantity,
            estimatedStartTime: toISO8601String(mo.estimatedStartTime),
            estimatedEndTime: toISO8601String(mo.estimatedEndTime),
            status: 'Đang sản xuất'
          }
        });
      }

      // Complete current process
      await updateProcessMutation.mutateAsync({
        processId: currentProcess.id,
        data: {
          moId: moIdNum,
          stageDetailId: currentProcess.stageDetailId,
          startedOn,
          finishedOn: now,
          status: 'Đã hoàn thành'
        }
      });

      // Find next process
      const currentIndex = processes.findIndex(p => p.id === currentProcess.id);
      const nextProcess = processes[currentIndex + 1];

      if (nextProcess) {
        // Start next process
        await updateProcessMutation.mutateAsync({
          processId: nextProcess.id,
          data: {
            moId: moIdNum,
            stageDetailId: nextProcess.stageDetailId,
            startedOn: now,
            status: 'Đang thực hiện'
          }
        });
      } else {
        // All processes completed, update MO to "Chờ nhập kho"
        await updateMoMutation.mutateAsync({
          moId: moIdNum,
          data: {
            itemId: Number(mo.itemId),
            lineId: Number(mo.lineId),
            type: mo.type,
            quantity: mo.quantity,
            estimatedStartTime: toISO8601String(mo.estimatedStartTime),
            estimatedEndTime: toISO8601String(mo.estimatedEndTime),
            status: 'Chờ nhập kho'
          }
        });
      }

      toast.success('Cập nhật công đoạn thành công!');
      refetchMo();
      refetchProcesses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật công đoạn!');
    }
  };

  // Handle create receive ticket
  const handleCreateReceiveTicket = async () => {
    if (!selectedWarehouseId) {
      toast.warning('Vui lòng chọn kho nhập!');
      return;
    }

    try {
      const { token, companyId, employeeName } = getAuthData();
      const request = {
        companyId,
        warehouseId: Number(selectedWarehouseId),
        reason: 'Nhập kho sau sản xuất',
        receiveType: 'Sản xuất',
        referenceCode: mo.moCode,
        status: 'Chờ xác nhận',
        receiveDate: new Date().toISOString(),
        createdBy: employeeName
      };

      const result = await ReceiveTicketService.createReceiveTicket(request, token);
      toast.success('Yêu cầu nhập kho thành công!');
      setHasRequestedReceive(true);
      setReceiveTicketId(result.ticketId);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi tạo phiếu nhập kho!');
    }
  };

  // Handle complete MO
  const handleCompleteMo = async () => {
    if (!completedQuantity || completedQuantity <= 0) {
      toast.error('Số lượng hoàn thành phải lớn hơn 0!');
      return;
    }

    try {
      await completeMoMutation.mutateAsync({ moId, completedQuantity });
      toast.success(`Hoàn thành công lệnh! Đã tạo ${completedQuantity} sản phẩm.`);
      setShowCompleteModal(false);
      refetchMo();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi hoàn thành công lệnh!');
    }
  };

  // Handle download QR codes
  const handleDownloadQR = async () => {
    try {
      const { token } = getAuthData();
      await ProductService.downloadQRPDF(moId, token);
      toast.success('Đang tải file QR codes...');
    } catch (error) {
      toast.error('Lỗi khi tải QR codes!');
    }
  };

  // Loading state
  if (moLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!mo) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="mp-glass-card p-8 text-center">
          <p className="text-red-500 mb-4">Không tìm thấy công lệnh sản xuất</p>
          <button onClick={() => navigate(-1)} className="mp-btn mp-btn-secondary">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const StatusIcon = statusConfig[mo.status]?.icon || Clock;
  const canEdit = mo.status === 'Chờ xác nhận';
  const canCancel = mo.status === 'Chờ xác nhận';
  const canConfirm = mo.status === 'Chờ xác nhận';
  const canComplete = mo.status === 'Đã nhập kho';
  const showProcessTimeline = ['Chờ sản xuất', 'Đang sản xuất'].includes(mo.status);
  const showReceiveSection = mo.status === 'Chờ nhập kho';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
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
              <Factory size={28} />
              {mo.moCode}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[mo.status]?.color || 'bg-gray-100'}`}>
                <StatusIcon size={14} />
                {mo.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { refetchMo(); refetchProcesses(); }}
            className="mp-btn mp-btn-secondary"
          >
            <RefreshCw size={18} />
          </motion.button>

          {canEdit && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/marketplace-v2/mo/${moId}/edit`)}
              className="mp-btn mp-btn-secondary"
            >
              <Edit size={18} />
              Chỉnh sửa
            </motion.button>
          )}

          {canCancel && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCancelMo}
              disabled={updateMoMutation.isPending}
              className="mp-btn mp-btn-secondary text-red-600 hover:bg-red-50"
            >
              <X size={18} />
              Hủy
            </motion.button>
          )}

          {canConfirm && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirmMo}
              className="mp-btn mp-btn-primary"
            >
              <Check size={18} />
              Xác nhận
            </motion.button>
          )}

          {mo.status === 'Đã hoàn thành' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadQR}
              className="mp-btn mp-btn-secondary"
            >
              <QrCode size={18} />
              Tải QR codes
            </motion.button>
          )}

          {canComplete && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCompleteModal(true)}
              className="mp-btn mp-btn-primary bg-emerald-500 hover:bg-emerald-600"
            >
              <CheckCircle size={18} />
              Hoàn thành
            </motion.button>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mp-glass-card p-6"
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
              Thông tin chung
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Package size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Sản phẩm</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {mo.itemCode} - {mo.itemName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Settings size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Dây chuyền</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {mo.lineName || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Package size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Số lượng</p>
                  <p className="font-medium text-blue-600">
                    {mo.completedQuantity?.toLocaleString() || 0} / {mo.quantity?.toLocaleString()} hoàn thành
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Factory size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Loại</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {mo.type || 'Sản xuất'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Ngày bắt đầu dự kiến</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {formatDate(mo.estimatedStartTime)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Ngày kết thúc dự kiến</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {formatDate(mo.estimatedEndTime)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Process Timeline */}
          {showProcessTimeline && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mp-glass-card p-6"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--mp-text-primary)' }}>
                <Clock size={20} />
                Tiến trình sản xuất
              </h2>

              {processesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
              ) : processes.length === 0 ? (
                <p className="text-center py-8" style={{ color: 'var(--mp-text-tertiary)' }}>
                  Chưa có công đoạn nào
                </p>
              ) : (
                <div className="space-y-4">
                  {processes.map((process, index) => {
                    const isActive = process.status === 'Đang thực hiện';
                    const isDone = process.status === 'Đã hoàn thành';
                    const config = processStatusConfig[process.status] || processStatusConfig['Chưa bắt đầu'];
                    
                    return (
                      <motion.div
                        key={process.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`relative flex items-center gap-4 p-4 rounded-xl border ${isActive ? 'border-blue-300 bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                      >
                        {/* Timeline dot */}
                        <div className={`w-4 h-4 rounded-full ${config.dotColor} ${isActive ? 'animate-pulse' : ''}`} />
                        
                        {/* Process info */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                              {index + 1}. {process.stageDetailName || `Công đoạn ${index + 1}`}
                            </p>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
                              {process.status}
                            </span>
                          </div>
                          {(process.startedOn || process.finishedOn) && (
                            <div className="flex gap-4 mt-1 text-xs" style={{ color: 'var(--mp-text-tertiary)' }}>
                              {process.startedOn && <span>Bắt đầu: {formatDate(process.startedOn)}</span>}
                              {process.finishedOn && <span>Kết thúc: {formatDate(process.finishedOn)}</span>}
                            </div>
                          )}
                        </div>

                        {/* Action button */}
                        {isActive && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCompleteProcess(process)}
                            disabled={updateProcessMutation.isPending}
                            className="mp-btn mp-btn-primary text-sm py-1.5 px-3"
                          >
                            {updateProcessMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Check size={14} />
                                Hoàn thành
                              </>
                            )}
                          </motion.button>
                        )}

                        {isDone && (
                          <CheckCircle size={20} className="text-green-500" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* Receive Ticket Section */}
          {showReceiveSection && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mp-glass-card p-6"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--mp-text-primary)' }}>
                <Warehouse size={20} />
                Nhập kho thành phẩm
              </h2>

              {hasRequestedReceive ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <CheckCircle size={24} className="text-green-500" />
                  <div>
                    <p className="font-medium text-green-700 dark:text-green-400">
                      Đã tạo phiếu nhập kho
                    </p>
                    <button
                      onClick={() => navigate(`/marketplace-v2/warehouse/receive-ticket/${receiveTicketId}`)}
                      className="text-sm text-green-600 hover:underline"
                    >
                      Xem phiếu nhập kho →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--mp-text-secondary)' }}>
                      Chọn kho nhập
                    </label>
                    <select
                      value={selectedWarehouseId}
                      onChange={(e) => setSelectedWarehouseId(e.target.value)}
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
                    onClick={handleCreateReceiveTicket}
                    disabled={!selectedWarehouseId}
                    className="mp-btn mp-btn-primary"
                  >
                    <Truck size={18} />
                    Tạo phiếu nhập kho
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Right Column: Status Timeline */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mp-glass-card p-6"
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
              Lịch sử trạng thái
            </h2>
            <div className="space-y-4">
              {Object.keys(statusConfig).filter(s => s !== 'Đã hủy').map((status, index) => {
                const Config = statusConfig[status];
                const Icon = Config.icon;
                const isActive = mo.status === status;
                const stages = ['Chờ xác nhận', 'Chờ sản xuất', 'Đang sản xuất', 'Chờ nhập kho', 'Đã nhập kho', 'Đã hoàn thành'];
                const currentIndex = stages.indexOf(mo.status);
                const statusIndex = stages.indexOf(status);
                const isPast = statusIndex < currentIndex;

                return (
                  <div key={status} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? Config.color : isPast ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {isPast ? <Check size={16} /> : <Icon size={16} />}
                    </div>
                    <span className={`text-sm ${isActive ? 'font-medium' : ''}`} style={{ color: isActive ? 'var(--mp-text-primary)' : 'var(--mp-text-tertiary)' }}>
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Complete MO Modal */}
      <AnimatePresence>
        {showCompleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCompleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="mp-glass-card p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
                Hoàn thành công lệnh
              </h3>
              <p className="mb-4 text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
                Nhập số lượng sản phẩm hoàn thành. Hệ thống sẽ tạo sản phẩm với mã QR tương ứng.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--mp-text-secondary)' }}>
                  Số lượng hoàn thành (tối đa: {mo.quantity})
                </label>
                <input
                  type="number"
                  value={completedQuantity}
                  onChange={(e) => setCompletedQuantity(parseInt(e.target.value) || 0)}
                  max={mo.quantity}
                  min={1}
                  className="mp-input w-full"
                  placeholder="Nhập số lượng..."
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowCompleteModal(false)}
                  className="mp-btn mp-btn-secondary"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCompleteMo}
                  disabled={completeMoMutation.isPending || !completedQuantity}
                  className="mp-btn mp-btn-primary bg-emerald-500 hover:bg-emerald-600"
                >
                  {completeMoMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Check size={18} />
                      Xác nhận
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoDetail;
