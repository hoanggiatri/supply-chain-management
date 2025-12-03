import React, { useState, memo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Chip,
} from "@material-tailwind/react";
import ImagePlaceholder from "./ImagePlaceholder";
import { getStatusColor } from "./StatusFilterChips";

/**
 * Format currency with thousand separators and VNĐ
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "";
  return new Intl.NumberFormat("vi-VN").format(amount) + " VNĐ";
};

/**
 * Format date to locale string
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

/**
 * OrderCard component - displays RFQ/Quotation/PO/SO in card layout
 */
const OrderCard = memo(
  ({
    id,
    code,
    title,
    subtitle,
    status,
    imageUrl,
    itemCount,
    totalAmount,
    date,
    badges = [],
    onClick,
    type = "order",
  }) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
      setImageError(true);
    };

    return (
      <Card
        className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl animate-fadeIn overflow-hidden"
        onClick={onClick}
      >
        {/* Image Area */}
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="relative m-0 h-44 overflow-hidden rounded-none"
        >
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
              loading="lazy"
              onError={handleImageError}
            />
          ) : (
            <ImagePlaceholder type={type} className="h-full w-full" />
          )}

          {/* Item count badge */}
          {itemCount > 1 && (
            <div className="absolute top-2 right-2">
              <Chip
                value={`${itemCount} sản phẩm`}
                size="sm"
                color="blue-gray"
                className="bg-blue-gray-900/80 text-white"
              />
            </div>
          )}

          {/* Status badge */}
          <div className="absolute bottom-2 left-2">
            <Chip
              value={status}
              size="sm"
              color={getStatusColor(status)}
              className="shadow-md"
            />
          </div>
        </CardHeader>

        {/* Content Area */}
        <CardBody className="p-4">
          {/* Order Code */}
          <Typography
            variant="h6"
            color="blue-gray"
            className="font-bold mb-1 truncate"
          >
            {code}
          </Typography>

          {/* Title (Company name) */}
          <Typography
            variant="small"
            color="blue-gray"
            className="font-medium mb-2 truncate"
          >
            {title}
          </Typography>

          {/* Subtitle (Additional info) */}
          {subtitle && (
            <Typography variant="small" color="gray" className="mb-2 truncate">
              {subtitle}
            </Typography>
          )}

          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className="text-xs bg-blue-gray-50 text-blue-gray-600 px-2 py-1 rounded"
                >
                  <span className="font-medium">{badge.label}:</span>{" "}
                  {badge.value}
                </div>
              ))}
            </div>
          )}

          {/* Footer info */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-gray-50">
            {/* Date */}
            <Typography variant="small" color="gray" className="text-xs">
              {date}
            </Typography>

            {/* Total Amount */}
            {totalAmount !== undefined && totalAmount !== null && (
              <Typography
                variant="small"
                color="blue"
                className="font-bold text-sm"
              >
                {formatCurrency(totalAmount)}
              </Typography>
            )}
          </div>
        </CardBody>
      </Card>
    );
  }
);

OrderCard.displayName = "OrderCard";

export default OrderCard;

