import React from "react";
import { Chip } from "@material-tailwind/react";

/**
 * Status color mapping
 */
export const STATUS_COLORS = {
  // RFQ statuses
  "Chưa báo giá": { bg: "purple", hex: "#9c27b0" },
  "Đã báo giá": { bg: "blue", hex: "#2196f3" },
  "Quá hạn báo giá": { bg: "red", hex: "#f44336" },
  "Đã chấp nhận": { bg: "green", hex: "#4caf50" },
  "Đã từ chối": { bg: "amber", hex: "#ff9800" },
  "Đã hủy": { bg: "red", hex: "#f44336" },
  // PO statuses
  "Chờ xác nhận": { bg: "purple", hex: "#9c27b0" },
  "Đã xác nhận": { bg: "blue", hex: "#2196f3" },
  "Đang vận chuyển": { bg: "cyan", hex: "#00bcd4" },
  "Chờ nhập kho": { bg: "amber", hex: "#ff9800" },
  "Đã hoàn thành": { bg: "green", hex: "#4caf50" },
  // SO statuses
  "Chờ xuất kho": { bg: "purple", hex: "#9c27b0" },
  "Chờ vận chuyển": { bg: "amber", hex: "#ff9800" },
  // Default
  "Tất cả": { bg: "blue-gray", hex: "#607d8b" },
};

/**
 * Get Tailwind color class based on status
 */
export const getStatusColor = (status) => {
  return STATUS_COLORS[status]?.bg || "blue-gray";
};

/**
 * StatusFilterChips component
 */
const StatusFilterChips = ({
  statuses = [],
  selectedStatus = "Tất cả",
  onSelectStatus,
  data = [],
  getStatus = (item) => item.status,
}) => {
  // Count items by status
  const countByStatus = statuses.reduce((acc, status) => {
    acc[status] =
      status === "Tất cả"
        ? data.length
        : data.filter((item) => getStatus(item) === status).length;
    return acc;
  }, {});

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {statuses.map((status) => {
        const isSelected = status === selectedStatus;
        const color = getStatusColor(status);
        const count = countByStatus[status] || 0;

        return (
          <Chip
            key={status}
            value={
              <div className="flex items-center gap-2">
                <span>{status}</span>
                <span className="font-bold">{count}</span>
              </div>
            }
            variant={isSelected ? "filled" : "outlined"}
            color={color}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
              isSelected ? "shadow-md" : "hover:shadow-sm"
            }`}
            onClick={() => onSelectStatus?.(status)}
          />
        );
      })}
    </div>
  );
};

export default StatusFilterChips;
