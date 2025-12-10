import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

/**
 * Step progress indicator with animated transitions
 */
const StepProgress = ({
  steps = [],
  currentStep = 0,
  onStepClick
}) => {
  return (
    <div className="flex items-center justify-center w-full">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = onStepClick && index < currentStep;

        return (
          <div key={step.key || index} className="flex items-center">
            {/* Step Circle */}
            <motion.button
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${isClickable ? 'cursor-pointer' : 'cursor-default'
                } ${isCompleted
                  ? 'bg-green-500 text-white'
                  : isCurrent
                    ? 'bg-blue-500 text-white ring-4 ring-blue-100 dark:ring-blue-900'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              style={{ color: !isCompleted && !isCurrent ? 'var(--mp-text-tertiary)' : undefined }}
              whileHover={isClickable ? { scale: 1.1 } : {}}
              whileTap={isClickable ? { scale: 0.95 } : {}}
            >
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  <Check size={20} />
                </motion.div>
              ) : (
                <span>{index + 1}</span>
              )}

              {/* Pulse animation for current step */}
              {isCurrent && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-blue-500"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>

            {/* Step Label */}
            <div className="ml-3 mr-6 hidden sm:block">
              <p
                className={`text-sm font-medium ${isCurrent ? 'text-blue-600' : ''}`}
                style={{ color: isCurrent ? undefined : 'var(--mp-text-primary)' }}
              >
                {step.label}
              </p>
              {step.description && (
                <p
                  className="text-xs"
                  style={{ color: 'var(--mp-text-tertiary)' }}
                >
                  {step.description}
                </p>
              )}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 min-w-8 max-w-20 mx-2 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--mp-border-light)' }}>
                <motion.div
                  className="h-full bg-green-500"
                  initial={{ width: '0%' }}
                  animate={{ width: isCompleted ? '100%' : '0%' }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepProgress;
