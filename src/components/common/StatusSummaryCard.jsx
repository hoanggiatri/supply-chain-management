import React from "react";

const StatusSummaryCard = ({
  data = [],
  statusLabels = [],
  getStatus = (item) => item.status,
  statusColors = {},
  statusIcons = {},
  onSelectStatus,
  className = "",
}) => {
  const getStatusCount = (status) =>
    status === "Tất cả"
      ? data.length
      : data.filter((item) => getStatus(item) === status).length;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 ${className}`}>
      {statusLabels.map((status) => {
        const count = getStatusCount(status);
        const color = statusColors[status] || "#000";
        const Icon = statusIcons[status];

        return (
          <div
            key={status}
            onClick={() => onSelectStatus?.(status)}
            className="border rounded-lg p-3 bg-white cursor-pointer shadow-sm hover:shadow transition-all duration-150 relative"
            style={{ borderColor: "#e5e7eb" }}
          >
            <div className="flex items-center justify-between px-1 pt-1">
              <p className="text-gray-700 font-medium text-sm">{status}</p>
              
              {/* Chấm màu ở góc phải bên trên */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: color + "22" }}
              >
                {Icon && <Icon className="w-4 h-4" style={{ color }} />}
              </div>
            </div>

            {/* Số lượng bên trái */}
            <div className="flex items-start h-12 px-1 py-2">
              <p
                className="text-3xl font-bold"
                style={{ color }}
              >
                {count}
              </p>
            </div>

            <div className="absolute bottom-2 right-2 px-1">
              <button className="text-sm font-medium text-blue-600 hover:underline">
                View details
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusSummaryCard;
