import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import {
  InboxIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  FaceFrownIcon,
} from "@heroicons/react/24/outline";

/**
 * Empty State Component
 * Displays friendly empty states with icons and actions
 */
const EmptyState = ({
  type = "default",
  title,
  description,
  actionLabel,
  onAction,
  icon: CustomIcon,
}) => {
  const configs = {
    default: {
      icon: InboxIcon,
      title: "Không có dữ liệu",
      description: "Chưa có dữ liệu để hiển thị",
      color: "blue-gray",
    },
    search: {
      icon: MagnifyingGlassIcon,
      title: "Không tìm thấy kết quả",
      description: "Thử tìm kiếm với từ khóa khác",
      color: "blue",
    },
    error: {
      icon: ExclamationTriangleIcon,
      title: "Có lỗi xảy ra",
      description: "Vui lòng thử lại sau",
      color: "red",
    },
    noData: {
      icon: FaceFrownIcon,
      title: "Chưa có dữ liệu",
      description: "Hãy tạo mục đầu tiên của bạn",
      color: "gray",
    },
  };

  const config = configs[type] || configs.default;
  const Icon = CustomIcon || config.icon;
  const finalTitle = title || config.title;
  const finalDescription = description || config.description;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className={`mb-6 p-6 rounded-full bg-${config.color}-50`}>
        <Icon className={`h-20 w-20 text-${config.color}-300`} />
      </div>
      <Typography variant="h5" color="blue-gray" className="mb-2 font-bold">
        {finalTitle}
      </Typography>
      <Typography variant="small" color="gray" className="mb-6 max-w-md">
        {finalDescription}
      </Typography>
      {actionLabel && onAction && (
        <Button color={config.color} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
