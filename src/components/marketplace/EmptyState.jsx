import React from "react";
import { Typography, Button } from "@material-tailwind/react";

/**
 * EmptyState component - displays when no data or no search results
 */
const EmptyState = ({
  title = "Không có dữ liệu",
  description = "Chưa có dữ liệu nào để hiển thị",
  icon,
  actionLabel,
  onAction,
  showClearFilter = false,
  onClearFilter,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icon */}
      <div className="mb-4">
        {icon || (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 text-blue-gray-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
        )}
      </div>

      {/* Title */}
      <Typography variant="h5" color="blue-gray" className="mb-2 text-center">
        {title}
      </Typography>

      {/* Description */}
      <Typography
        variant="paragraph"
        color="gray"
        className="mb-6 text-center max-w-md"
      >
        {description}
      </Typography>

      {/* Actions */}
      <div className="flex gap-3">
        {showClearFilter && onClearFilter && (
          <Button
            variant="outlined"
            color="blue-gray"
            onClick={onClearFilter}
            className="flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            Xóa bộ lọc
          </Button>
        )}
        {actionLabel && onAction && (
          <Button color="blue" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;

