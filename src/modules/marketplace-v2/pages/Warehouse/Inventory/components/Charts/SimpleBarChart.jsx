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

  return (
    <div>
      <h4 className="text-sm font-medium mb-4" style={{ color: 'var(--mp-text-primary)' }}>
        {title}
      </h4>
      <div className="flex items-end gap-2 h-[150px]">
        {data.slice(-12).map((item, idx) => {
          const value = item[dataKey] || 0;
          const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="w-full rounded-t-sm min-h-[4px]"
                style={{ backgroundColor: barColor }}
                title={`${item[xAxisKey]}: ${value.toLocaleString()}`}
              />
              <span
                className="text-[10px] mt-1 truncate w-full text-center"
                style={{ color: 'var(--mp-text-tertiary)' }}
              >
                {item[xAxisKey]?.substring(0, 3)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimpleBarChart;
