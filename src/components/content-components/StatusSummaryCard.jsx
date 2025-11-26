import React from "react";
import { Button, Typography } from "@material-tailwind/react";

const StatusSummaryCard = ({
  data = [],
  statusLabels = [],
  getStatus,
  statusColors = {},
  onSelectStatus,
  selectedStatus,
}) => {
  const items = Array.isArray(data) ? data : [];
  const countByStatus = statusLabels.reduce((count, label) => {
    count[label] =
      label === "Tất cả"
        ? items.length
        : items.filter((item) => getStatus(item) === label).length;
    return count;
  }, {});

  // Map hex colors to Tailwind CSS classes
  const getColorClasses = (color, isSelected) => {
    const colorMap = {
      "#000": {
        bg: "bg-gray-900",
        border: "border-gray-900",
        text: "text-gray-900",
        hover: "hover:bg-gray-900",
      },
      "#ff9800": {
        bg: "bg-orange-500",
        border: "border-orange-500",
        text: "text-orange-500",
        hover: "hover:bg-orange-500",
      },
      "#f44336": {
        bg: "bg-red-500",
        border: "border-red-500",
        text: "text-red-500",
        hover: "hover:bg-red-500",
      },
      "#2196f3": {
        bg: "bg-blue-500",
        border: "border-blue-500",
        text: "text-blue-500",
        hover: "hover:bg-blue-500",
      },
      "#4caf50": {
        bg: "bg-green-500",
        border: "border-green-500",
        text: "text-green-500",
        hover: "hover:bg-green-500",
      },
    };

    const classes = colorMap[color] || {
      bg: "bg-gray-500",
      border: "border-gray-500",
      text: "text-gray-500",
      hover: "hover:bg-gray-500",
    };

    if (isSelected) {
      return `bg-white ${classes.border} ${classes.text} border-2 hover:bg-white`;
    }
    return `${classes.bg} ${classes.border} text-white border-2 ${classes.hover} hover:shadow-lg`;
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {statusLabels.map((label) => {
        const isSelected = label === selectedStatus;
        const colorClasses = getColorClasses(statusColors[label], isSelected);

        return (
          <Button
            key={label}
            onClick={() => onSelectStatus?.(label)}
            className={`h-12 px-4 transition-all duration-200 ${colorClasses}`}
          >
            <div className="flex justify-between items-center w-full gap-3">
              <Typography variant="h6" className="font-bold">
                {label}
              </Typography>
              <Typography variant="h6" className="font-bold">
                {countByStatus[label] || 0}
              </Typography>
            </div>
          </Button>
        );
      })}
    </div>
  );
};

export default StatusSummaryCard;
