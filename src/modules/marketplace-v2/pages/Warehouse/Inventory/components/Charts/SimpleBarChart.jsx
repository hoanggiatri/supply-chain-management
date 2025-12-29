/**
 * SimpleBarChart Component
 * Lightweight bar chart for displaying monthly data
 */

import { motion } from 'framer-motion';

const SimpleBarChart = ({ data, barColor, title, dataKey, xAxisKey }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <p style={{ color: 'var(--mp-text-tertiary)' }}>Không có dữ liệu</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d[dataKey] || 0));

  // Helper function to format month label
  const formatMonthLabel = (monthStr) => {
    if (!monthStr) return '';
    // Handle format "MM/YYYY" -> "T1", "T2", etc.
    if (monthStr.includes('/')) {
      const month = parseInt(monthStr.split('/')[0], 10);
      return `T${month}`;
    }
    // Fallback: return first 3 characters
    return monthStr.substring(0, 3);
  };

  return (
    <div>
      <h4 className="text-sm font-medium mb-4" style={{ color: 'var(--mp-text-primary)' }}>
        {title}
      </h4>
      <div className="flex items-end gap-2" style={{ height: '150px' }}>
        {data.slice(-12).map((item, idx) => {
          const value = item[dataKey] || 0;
          const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;
          // Convert percentage to pixels based on container height (150px)
          const heightPx = maxValue > 0 ? (value / maxValue) * 130 : 0; // 130px để chừa space cho label
          const monthLabel = formatMonthLabel(item[xAxisKey]);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center justify-end" style={{ height: '100%' }}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: Math.max(heightPx, 4) }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="w-full rounded-t-sm"
                style={{ 
                  backgroundColor: barColor,
                  minWidth: '8px'
                }}
                title={`${item[xAxisKey]}: ${value.toLocaleString()}`}
              />
              <span
                className="text-[10px] mt-1 truncate w-full text-center"
                style={{ color: 'var(--mp-text-tertiary)' }}
              >
                {monthLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimpleBarChart;

