import { createReceiveTicket } from '@/services/inventory/ReceiveTicketService';
import { getPoById, updatePoStatus } from '@/services/purchasing/PoService';
import { getSoById, updateSoStatus } from '@/services/sale/SoService';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import {
    CheckCircle2,
    MapPin,
    Package,
    Plus,
    Truck,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import BackButton from '../../../components/ui/BackButton';
import {
    useCreateDeliveryProcess,
    useDeliveryOrderById,
    useDeliveryProcesses,
    useUpdateDeliveryOrder
} from '../../../hooks/useApi';

// Status configuration
const STATUS_CONFIG = {
  'Chờ xác nhận': { color: '#ef4444', step: 0 },
  'Chờ lấy hàng': { color: '#f59e0b', step: 1 },
  'Đang vận chuyển': { color: '#3b82f6', step: 2 },
  'Đã hoàn thành': { color: '#22c55e', step: 3 },
};

// Stepper Component
const DeliveryStepper = ({ currentStatus }) => {
  const steps = ['Chờ lấy hàng', 'Đang vận chuyển', 'Hoàn thành'];
  const currentStep = STATUS_CONFIG[currentStatus]?.step || 0;

  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep - 1;
        const isActive = isCompleted || isCurrent;

        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isActive ? 1.1 : 1 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-blue-500 text-white ring-4 ring-blue-200'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? <CheckCircle2 size={20} /> : index + 1}
              </motion.div>
              <span 
                className={`text-xs mt-2 font-medium ${isActive ? '' : 'text-gray-400'}`}
                style={{ color: isActive ? 'var(--mp-text-primary)' : undefined }}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 rounded-full bg-gray-200 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: isCompleted ? '100%' : '0%' }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="h-full bg-green-500"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Timeline Item Component
const TimelineItem = ({ process, isLast, isFirst }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-4"
    >
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`w-4 h-4 rounded-full ${isFirst ? 'bg-blue-500' : 'bg-green-500'}`}
        />
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gradient-to-b from-green-500 to-gray-200 my-1" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="mp-glass-card p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-blue-500" />
              <span className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                {process.location}
              </span>
            </div>
            <span className="text-xs" style={{ color: 'var(--mp-text-tertiary)' }}>
              {process.arrivalTime ? dayjs(process.arrivalTime).format('DD/MM/YYYY HH:mm') : ''}
            </span>
          </div>
          {process.note && (
            <p className="text-sm mt-2" style={{ color: 'var(--mp-text-secondary)' }}>
              {process.note === 'from' ? '📦 Đã lấy hàng' : process.note === 'to' ? '✅ Đã giao hàng' : process.note}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Add Stop Form Component
const AddStopForm = ({ doId, onSuccess }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [location, setLocation] = useState('');
  const createProcessMutation = useCreateDeliveryProcess();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.trim()) return;

    createProcessMutation.mutate({
      doId: parseInt(doId),
      location: location.trim(),
      arrivalTime: dayjs().format('YYYY-MM-DDTHH:mm:ss')
    }, {
      onSuccess: () => {
        toast.success('Thêm điểm dừng thành công!');
        setLocation('');
        setIsExpanded(false);
        onSuccess?.();
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
      }
    });
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-gray-300 border-2 border-dashed border-gray-400" />
      </div>
      <div className="flex-1 pb-6">
        <AnimatePresence>
          {isExpanded ? (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="mp-glass-card p-4"
            >
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Nhập địa điểm điểm dừng..."
                className="mp-input w-full mb-3"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={createProcessMutation.isLoading}
                  className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {createProcessMutation.isLoading ? 'Đang lưu...' : 'Thêm'}
                </button>
                <button
                  type="button"
                  onClick={() => { setIsExpanded(false); setLocation(''); }}
                  className="px-4 py-2 text-gray-500 text-sm hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Hủy
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 transition-colors"
            >
              <Plus size={16} />
              Thêm điểm dừng
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Confirm Modal Component
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 className="font-semibold text-lg" style={{ color: 'var(--mp-text-primary)' }}>
            {title}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <p style={{ color: 'var(--mp-text-secondary)' }}>{message}</p>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * Delivery Detail Page
 * Shows DO detail with tracking timeline and actions
 */
const DeliveryDetail = () => {
  const { doId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const { data: deliveryOrder, isLoading, refetch } = useDeliveryOrderById(doId);
  const { data: processesRaw = [], refetch: refetchProcesses } = useDeliveryProcesses(doId);
  const updateDoMutation = useUpdateDeliveryOrder();

  const [so, setSo] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, type: null });

  const processes = Array.isArray(processesRaw) ? processesRaw : [];

  // Fetch SO data
  useEffect(() => {
    if (deliveryOrder?.soId && token) {
      getSoById(deliveryOrder.soId, token).then(setSo).catch(() => {});
    }
  }, [deliveryOrder?.soId, token]);

  // Status config
  const statusConfig = STATUS_CONFIG[deliveryOrder?.status] || STATUS_CONFIG['Chờ xác nhận'];

  // Handle Confirm (Xác nhận)
  const handleConfirm = async () => {
    const employeeName = localStorage.getItem('employeeName');
    try {
      await updateDoMutation.mutateAsync({
        doId,
        request: { createdBy: employeeName, status: 'Chờ lấy hàng' }
      });
      if (so) {
        await updateSoStatus(so.soId, 'Đang vận chuyển', token);
        await updatePoStatus(so.poId, 'Đang vận chuyển', token);
      }
      toast.success('Xác nhận đơn vận chuyển thành công!');
      refetch();
      setConfirmModal({ open: false, type: null });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  // Handle Pickup (Lấy hàng)
  const handlePickup = async () => {
    try {
      // Create from process
      const { createDeliveryProcess } = await import('@/services/delivery/DoProcessService');
      await createDeliveryProcess({
        doId: parseInt(doId),
        location: so?.deliveryFromAddress || 'Kho giao hàng',
        arrivalTime: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
        note: 'from'
      }, token);

      await updateDoMutation.mutateAsync({
        doId,
        request: { ...deliveryOrder, status: 'Đang vận chuyển' }
      });
      toast.success('Lấy hàng thành công!');
      refetch();
      refetchProcesses();
      setConfirmModal({ open: false, type: null });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  // Handle Complete (Hoàn thành)
  const handleComplete = async () => {
    try {
      // Create to process
      const { createDeliveryProcess } = await import('@/services/delivery/DoProcessService');
      await createDeliveryProcess({
        doId: parseInt(doId),
        location: so?.deliveryToAddress || 'Địa chỉ giao hàng',
        arrivalTime: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
        note: 'to'
      }, token);

      await updateDoMutation.mutateAsync({
        doId,
        request: { ...deliveryOrder, status: 'Đã hoàn thành' }
      });

      if (so) {
        await updateSoStatus(so.soId, 'Đã hoàn thành', token);
        await updatePoStatus(so.poId, 'Chờ nhập kho', token);

        // Create receive ticket
        const po = await getPoById(so.poId, token);
        const employeeName = localStorage.getItem('employeeName');
        await createReceiveTicket({
          companyId: Number(so.customerCompanyId),
          warehouseId: Number(po.receiveWarehouseId),
          reason: 'Nhập hàng mua về',
          receiveType: 'Mua hàng',
          referenceCode: so.poCode,
          status: 'Chờ xác nhận',
          receiveDate: new Date().toISOString(),
          createdBy: employeeName
        }, token);
      }

      toast.success('Hoàn thành đơn vận chuyển!');
      refetch();
      refetchProcesses();
      setConfirmModal({ open: false, type: null });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  if (isLoading || !deliveryOrder) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, type: null })}
        onConfirm={confirmModal.type === 'confirm' ? handleConfirm : confirmModal.type === 'pickup' ? handlePickup : handleComplete}
        title="Xác nhận"
        message={
          confirmModal.type === 'confirm' ? 'Bạn có chắc muốn xác nhận đơn vận chuyển này?' :
          confirmModal.type === 'pickup' ? 'Xác nhận đã lấy hàng cho đơn vận chuyển này?' :
          'Bạn có chắc muốn hoàn thành đơn vận chuyển này?'
        }
        isLoading={updateDoMutation.isLoading}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>
                {deliveryOrder.doCode}
              </h1>
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: `${statusConfig.color}20`,
                  color: statusConfig.color,
                  boxShadow: `0 0 20px ${statusConfig.color}40`
                }}
              >
                {deliveryOrder.status}
              </motion.span>
            </div>
            <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
              Đơn bán: {deliveryOrder.soCode} • Tạo bởi: {deliveryOrder.createdBy}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {deliveryOrder.status === 'Chờ xác nhận' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setConfirmModal({ open: true, type: 'confirm' })}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <CheckCircle2 size={18} />
              Xác nhận
            </motion.button>
          )}
          {deliveryOrder.status === 'Chờ lấy hàng' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setConfirmModal({ open: true, type: 'pickup' })}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2"
            >
              <Package size={18} />
              Lấy hàng
            </motion.button>
          )}
          {deliveryOrder.status === 'Đang vận chuyển' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setConfirmModal({ open: true, type: 'complete' })}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <CheckCircle2 size={18} />
              Hoàn thành
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Stepper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mp-glass-card p-6"
      >
        <DeliveryStepper currentStatus={deliveryOrder.status} />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tracking Timeline */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mp-glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--mp-text-primary)' }}>
            <MapPin size={20} className="text-blue-500" />
            Lịch sử vận chuyển
          </h3>
          
          <div className="space-y-0">
            {processes.length > 0 ? (
              <>
                {processes.map((process, index) => (
                  <TimelineItem 
                    key={process.doProcessId || index} 
                    process={process}
                    isFirst={index === 0}
                    isLast={index === processes.length - 1 && deliveryOrder.status === 'Đã hoàn thành'}
                  />
                ))}
                {deliveryOrder.status === 'Đang vận chuyển' && (
                  <AddStopForm doId={doId} onSuccess={refetchProcesses} />
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <Truck size={48} className="mx-auto mb-4 opacity-30" />
                <p style={{ color: 'var(--mp-text-tertiary)' }}>Chưa có thông tin vận chuyển</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="mp-glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--mp-text-primary)' }}>
            <Package size={20} className="text-green-500" />
            Danh sách hàng hóa
          </h3>
          
          {deliveryOrder.deliveryOrderDetails?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--mp-border-light)' }}>
                    <th className="py-2 px-3 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Mã hàng</th>
                    <th className="py-2 px-3 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Tên hàng</th>
                    <th className="py-2 px-3 text-right font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>SL</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryOrder.deliveryOrderDetails.map((item, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="border-b"
                      style={{ borderColor: 'var(--mp-border-light)' }}
                    >
                      <td className="py-3 px-3" style={{ color: 'var(--mp-text-primary)' }}>{item.itemCode}</td>
                      <td className="py-3 px-3" style={{ color: 'var(--mp-text-secondary)' }}>{item.itemName}</td>
                      <td className="py-3 px-3 text-right font-medium" style={{ color: 'var(--mp-text-primary)' }}>{item.quantity}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Package size={48} className="mx-auto mb-4 opacity-30" />
              <p style={{ color: 'var(--mp-text-tertiary)' }}>Không có hàng hóa</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DeliveryDetail;
