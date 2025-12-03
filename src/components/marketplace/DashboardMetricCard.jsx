import React from "react";
import { Card, Typography } from "@material-tailwind/react";

/**
 * DashboardMetricCard - Displays a key metric with trend indicator
 */
const DashboardMetricCard = ({
  icon,
  iconBg = "bg-blue-500",
  label,
  value,
  trend,
  trendValue,
  onClick,
  className = "",
}) => {
  const isPositiveTrend = trend === "up";
  const isNegativeTrend = trend === "down";

  return (
    <Card
      className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-blue-gray-100 ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-xl ${iconBg} shadow-lg`}
        >
          <span className="text-2xl text-white">{icon}</span>
        </div>

        {/* Trend Indicator */}
        {trend && trendValue && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              isPositiveTrend
                ? "bg-green-50 text-green-600"
                : isNegativeTrend
                ? "bg-red-50 text-red-600"
                : "bg-blue-gray-50 text-blue-gray-600"
            }`}
          >
            {isPositiveTrend && (
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            )}
            {isNegativeTrend && (
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            )}
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      {/* Value */}
      <Typography variant="h3" className="mt-4 text-blue-gray-900 font-bold">
        {value}
      </Typography>

      {/* Label */}
      <Typography variant="small" className="text-blue-gray-500 mt-1">
        {label}
      </Typography>
    </Card>
  );
};

export default DashboardMetricCard;
