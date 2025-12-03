import React from "react";
import { Chip } from "@material-tailwind/react";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  TruckIcon,
  CubeIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";

/**
 * Enhanced Status Badge Component
 * Displays status with gradient background, icon, and animation
 */
const StatusBadge = ({ status, size = "sm", showIcon = true }) => {
  const getStatusConfig = (status) => {
    const statusLower = String(status).toLowerCase();

    // Success states
    if (
      statusLower.includes("hoàn thành") ||
      statusLower.includes("completed") ||
      statusLower.includes("đã") ||
      statusLower.includes("success") ||
      statusLower.includes("active") ||
      statusLower.includes("in_warehouse") ||
      statusLower.includes("delivered")
    ) {
      return {
        color: "green",
        icon: CheckCircleIcon,
        gradient: "from-green-50 to-emerald-50",
        textColor: "text-green-700",
        borderColor: "border-green-200",
      };
    }

    // Processing/In Progress states
    if (
      statusLower.includes("đang") ||
      statusLower.includes("processing") ||
      statusLower.includes("in progress") ||
      statusLower.includes("issued")
    ) {
      return {
        color: "blue",
        icon: ClockIcon,
        gradient: "from-blue-50 to-cyan-50",
        textColor: "text-blue-700",
        borderColor: "border-blue-200",
      };
    }

    // Pending/Waiting states
    if (
      statusLower.includes("chờ") ||
      statusLower.includes("pending") ||
      statusLower.includes("waiting") ||
      statusLower.includes("produced")
    ) {
      return {
        color: "amber",
        icon: ExclamationTriangleIcon,
        gradient: "from-amber-50 to-yellow-50",
        textColor: "text-amber-700",
        borderColor: "border-amber-200",
      };
    }

    // Cancelled/Failed states
    if (
      statusLower.includes("hủy") ||
      statusLower.includes("cancel") ||
      statusLower.includes("failed") ||
      statusLower.includes("inactive") ||
      statusLower.includes("ngừng") ||
      statusLower.includes("closed")
    ) {
      return {
        color: "red",
        icon: XCircleIcon,
        gradient: "from-red-50 to-rose-50",
        textColor: "text-red-700",
        borderColor: "border-red-200",
      };
    }

    // Sold state
    if (statusLower.includes("sold") || statusLower.includes("bán")) {
      return {
        color: "purple",
        icon: ShoppingBagIcon,
        gradient: "from-purple-50 to-pink-50",
        textColor: "text-purple-700",
        borderColor: "border-purple-200",
      };
    }

    // Default
    return {
      color: "blue-gray",
      icon: CubeIcon,
      gradient: "from-gray-50 to-slate-50",
      textColor: "text-gray-700",
      borderColor: "border-gray-200",
    };
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${config.gradient} border ${config.borderColor} ${config.textColor} font-semibold text-xs uppercase tracking-wide transition-all duration-200 hover:shadow-md`}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      <span>{status}</span>
    </div>
  );
};

export default StatusBadge;
