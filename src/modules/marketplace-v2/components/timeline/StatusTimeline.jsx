import { motion } from 'framer-motion';
import { Check, CheckCircle, Clock, FileText, Package, Truck, XCircle } from 'lucide-react';

// Default order statuses (for PO/SO)
const orderStatusSteps = [
  { key: 'draft', label: 'Nháp', icon: Clock },
  { key: 'pending', label: 'Chờ duyệt', icon: Clock },
  { key: 'confirmed', label: 'Đã xác nhận', icon: Check },
  { key: 'processing', label: 'Đang xử lý', icon: Package },
  { key: 'shipping', label: 'Đang giao hàng', icon: Truck },
  { key: 'completed', label: 'Hoàn thành', icon: CheckCircle },
  { key: 'cancelled', label: 'Đã hủy', icon: XCircle },
];

// RFQ specific statuses (6 trạng thái - lowercase từ API)
const rfqStatusSteps = [
  { key: 'chưa báo giá', label: 'Chưa báo giá', icon: Clock, order: 1 },
  { key: 'đã báo giá', label: 'Đã báo giá', icon: FileText, order: 2 },
  { key: 'đã chấp nhận', label: 'Đã chấp nhận', icon: CheckCircle, order: 3 },
  { key: 'đã từ chối', label: 'Đã từ chối', icon: XCircle, order: 3 }, // Same level as accepted
  { key: 'quá hạn báo giá', label: 'Quá hạn', icon: Clock, order: 3 },
  { key: 'đã hủy', label: 'Đã hủy', icon: XCircle, order: 0 }, // Can happen anytime
];

// Quotation specific statuses (3 trạng thái - Uppercase từ API)
const quotationStatusSteps = [
  { key: 'Đã báo giá', label: 'Đã báo giá', icon: FileText, order: 1 },
  { key: 'Đã chấp nhận', label: 'Đã chấp nhận', icon: CheckCircle, order: 2 },
  { key: 'Đã từ chối', label: 'Đã từ chối', icon: XCircle, order: 2 }, // Same level as accepted
];

// PO specific statuses (6 trạng thái - Vietnamese từ API)
const poStatusSteps = [
  { key: 'Chờ xác nhận', label: 'Chờ xác nhận', icon: Clock, order: 1 },
  { key: 'Đã xác nhận', label: 'Đã xác nhận', icon: Check, order: 2 },
  { key: 'Đang vận chuyển', label: 'Đang vận chuyển', icon: Truck, order: 3 },
  { key: 'Chờ nhập kho', label: 'Chờ nhập kho', icon: Package, order: 4 },
  { key: 'Đã hoàn thành', label: 'Đã hoàn thành', icon: CheckCircle, order: 5 },
  { key: 'Đã hủy', label: 'Đã hủy', icon: XCircle, order: 0 }, // Can happen anytime
];

// SO specific statuses (4 trạng thái - Vietnamese từ API)
const soStatusSteps = [
  { key: 'Chờ xuất kho', label: 'Chờ xuất kho', icon: Package, order: 1 },
  { key: 'Chờ vận chuyển', label: 'Chờ vận chuyển', icon: Clock, order: 2 },
  { key: 'Đang vận chuyển', label: 'Đang vận chuyển', icon: Truck, order: 3 },
  { key: 'Đã hoàn thành', label: 'Đã hoàn thành', icon: CheckCircle, order: 4 },
];

// Get status steps by type
const getStatusSteps = (type) => {
  switch (type) {
    case 'rfq':
      return rfqStatusSteps;
    case 'quotation':
      return quotationStatusSteps;
    case 'po':
      return poStatusSteps;
    case 'so':
      return soStatusSteps;
    default:
      return orderStatusSteps;
  }
};

// Get main flow steps for display (exclude terminal/exception states unless current)
const getDisplaySteps = (type, currentStatus, isCancelled) => {
  const allSteps = getStatusSteps(type);
  
  if (type === 'quotation') {
    // For quotation: show all 3 states but indicate which one is current
    // Đã báo giá → Đã chấp nhận OR Đã từ chối
    if (currentStatus === 'Đã từ chối') {
      return [
        allSteps.find(s => s.key === 'Đã báo giá'),
        allSteps.find(s => s.key === 'Đã từ chối'),
      ];
    }
    return [
      allSteps.find(s => s.key === 'Đã báo giá'),
      allSteps.find(s => s.key === 'Đã chấp nhận'),
    ];
  }
  
  if (type === 'rfq') {
    // Build flow based on current status
    const baseFlow = [
      allSteps.find(s => s.key === 'chưa báo giá'),
      allSteps.find(s => s.key === 'đã báo giá'),
    ];
    
    // Add terminal state
    if (currentStatus === 'đã hủy') {
      return [...baseFlow, allSteps.find(s => s.key === 'đã hủy')];
    }
    if (currentStatus === 'đã từ chối') {
      return [...baseFlow, allSteps.find(s => s.key === 'đã từ chối')];
    }
    if (currentStatus === 'quá hạn báo giá') {
      return [...baseFlow, allSteps.find(s => s.key === 'quá hạn báo giá')];
    }
    // Default: accepted flow
    return [...baseFlow, allSteps.find(s => s.key === 'đã chấp nhận')];
  }

  if (type === 'po') {
    // PO flow: Chờ xác nhận → Đã xác nhận → Đang vận chuyển → Chờ nhập kho → Đã hoàn thành
    // Or: Chờ xác nhận → Đã hủy
    const mainFlow = [
      allSteps.find(s => s.key === 'Chờ xác nhận'),
      allSteps.find(s => s.key === 'Đã xác nhận'),
      allSteps.find(s => s.key === 'Đang vận chuyển'),
      allSteps.find(s => s.key === 'Chờ nhập kho'),
      allSteps.find(s => s.key === 'Đã hoàn thành'),
    ];

    if (currentStatus === 'Đã hủy') {
      // Show cancelled flow
      return [
        allSteps.find(s => s.key === 'Chờ xác nhận'),
        allSteps.find(s => s.key === 'Đã hủy'),
      ];
    }

    return mainFlow;
  }

  if (type === 'so') {
    // SO flow: Chờ xuất kho → Chờ vận chuyển → Đang vận chuyển → Đã hoàn thành
    const mainFlow = [
      allSteps.find(s => s.key === 'Chờ xuất kho'),
      allSteps.find(s => s.key === 'Chờ vận chuyển'),
      allSteps.find(s => s.key === 'Đang vận chuyển'),
      allSteps.find(s => s.key === 'Đã hoàn thành'),
    ];
    return mainFlow;
  }
  
  // For default orders
  if (isCancelled) {
    return allSteps.filter(s => !['completed'].includes(s.key));
  }
  return allSteps.filter(s => !['cancelled'].includes(s.key) || s.key === currentStatus);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Vertical status timeline showing order/RFQ/Quotation status changes
 * @param currentStatus - Current status key (case-sensitive)
 * @param statusHistory - Array of {status, timestamp, note} for history
 * @param isCancelled - Whether the order/rfq is cancelled
 * @param type - 'order' | 'rfq' | 'quotation'
 */
const StatusTimeline = ({
  currentStatus = 'pending',
  statusHistory = [],
  isCancelled = false,
  type = 'order'
}) => {
  const displaySteps = getDisplaySteps(type, currentStatus, isCancelled);
  
  // Find current step index
  const currentIndex = displaySteps.findIndex(s => s?.key === currentStatus);

  return (
    <div className="space-y-0">
      {displaySteps.map((step, index) => {
        if (!step) return null;
        
        const isCompleted = index < currentIndex;
        const isCurrent = step.key === currentStatus;
        const isTerminal = ['đã hủy', 'đã từ chối', 'Đã từ chối', 'quá hạn báo giá'].includes(step.key);
        const historyItem = statusHistory.find(h => h.status === step.key);
        const Icon = step.icon;

        // Color logic
        let circleClass = 'bg-gray-100 dark:bg-gray-700';
        let iconColor = 'var(--mp-text-tertiary)';
        
        if (isCurrent) {
          if (isTerminal && ['đã hủy', 'đã từ chối', 'Đã từ chối'].includes(step.key)) {
            circleClass = 'bg-red-500 text-white ring-4 ring-red-100 dark:ring-red-900';
          } else if (isTerminal && step.key === 'quá hạn báo giá') {
            circleClass = 'bg-orange-500 text-white ring-4 ring-orange-100 dark:ring-orange-900';
          } else {
            circleClass = 'bg-blue-500 text-white ring-4 ring-blue-100 dark:ring-blue-900';
          }
          iconColor = 'white';
        } else if (isCompleted) {
          circleClass = 'bg-green-500 text-white';
          iconColor = 'white';
        }

        return (
          <motion.div
            key={step.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex gap-4"
          >
            {/* Timeline Line */}
            {index < displaySteps.length - 1 && (
              <div
                className="absolute left-5 top-10 bottom-0 w-0.5"
                style={{
                  background: isCompleted
                    ? 'var(--mp-primary-500)'
                    : 'var(--mp-border-light)'
                }}
              />
            )}

            {/* Icon Circle */}
            <motion.div
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${circleClass}`}
              initial={{ scale: 1 }}
              animate={{ scale: isCurrent ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Icon 
                size={18} 
                style={{ color: iconColor === 'white' ? 'white' : iconColor }} 
              />
            </motion.div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <p
                className={`font-medium ${
                  isCurrent 
                    ? isTerminal && ['đã hủy', 'đã từ chối', 'Đã từ chối'].includes(step.key)
                      ? 'text-red-600'
                      : isTerminal && step.key === 'quá hạn báo giá'
                        ? 'text-orange-600'
                        : 'text-blue-600'
                    : ''
                }`}
                style={{ color: isCurrent ? undefined : 'var(--mp-text-primary)' }}
              >
                {step.label}
              </p>
              {historyItem && (
                <p
                  className="text-sm mt-1"
                  style={{ color: 'var(--mp-text-tertiary)' }}
                >
                  {formatDate(historyItem.timestamp)}
                  {historyItem.note && ` - ${historyItem.note}`}
                </p>
              )}
              {isCurrent && !historyItem && (
                <p
                  className="text-sm mt-1"
                  style={{ color: 'var(--mp-text-tertiary)' }}
                >
                  Trạng thái hiện tại
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatusTimeline;
