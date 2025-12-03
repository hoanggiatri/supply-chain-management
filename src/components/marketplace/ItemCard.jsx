import React, { useState, memo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import ImagePlaceholder from "./ImagePlaceholder";
import { formatCurrency } from "./OrderCard";

/**
 * ItemCard component - displays item with image in detail pages
 */
const ItemCard = memo(
  ({
    itemCode,
    itemName,
    imageUrl,
    quantity,
    price,
    discount,
    note,
    supplierItemCode,
    supplierItemName,
    onClick,
  }) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
      setImageError(true);
    };

    // Calculate total if price is available
    const total = price ? price * quantity - (discount || 0) : null;

    return (
      <Card
        className={`overflow-hidden transition-all duration-300 hover:shadow-xl ${
          onClick ? "cursor-pointer hover:scale-[1.02]" : ""
        }`}
        onClick={onClick}
      >
        {/* Image Area */}
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="relative m-0 h-40 overflow-hidden rounded-none"
        >
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={itemName}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={handleImageError}
            />
          ) : (
            <ImagePlaceholder type="item" className="h-full w-full" />
          )}
        </CardHeader>

        {/* Content Area */}
        <CardBody className="p-3">
          {/* Item Code */}
          <Typography
            variant="small"
            color="blue"
            className="font-bold mb-1 truncate"
          >
            {itemCode}
          </Typography>

          {/* Item Name */}
          <Typography
            variant="small"
            color="blue-gray"
            className="font-medium mb-2 line-clamp-2 min-h-[2.5rem]"
            title={itemName}
          >
            {itemName}
          </Typography>

          {/* Supplier info if available */}
          {(supplierItemCode || supplierItemName) && (
            <div className="mb-2 text-xs text-gray-500">
              {supplierItemCode && (
                <Typography variant="small" className="truncate text-xs">
                  Mã NCC: {supplierItemCode}
                </Typography>
              )}
              {supplierItemName && (
                <Typography variant="small" className="truncate text-xs">
                  Tên NCC: {supplierItemName}
                </Typography>
              )}
            </div>
          )}

          {/* Quantity */}
          <div className="flex justify-between items-center mb-2">
            <Typography variant="small" color="gray">
              Số lượng:
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-bold">
              {quantity}
            </Typography>
          </div>

          {/* Price if available */}
          {price !== undefined && price !== null && (
            <>
              <div className="flex justify-between items-center">
                <Typography variant="small" color="gray">
                  Đơn giá:
                </Typography>
                <Typography variant="small" color="blue-gray">
                  {formatCurrency(price)}
                </Typography>
              </div>

              {discount > 0 && (
                <div className="flex justify-between items-center">
                  <Typography variant="small" color="gray">
                    Chiết khấu:
                  </Typography>
                  <Typography variant="small" color="red">
                    -{formatCurrency(discount)}
                  </Typography>
                </div>
              )}

              {total !== null && (
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-blue-gray-50">
                  <Typography
                    variant="small"
                    color="gray"
                    className="font-medium"
                  >
                    Thành tiền:
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue"
                    className="font-bold"
                  >
                    {formatCurrency(total)}
                  </Typography>
                </div>
              )}
            </>
          )}

          {/* Note if available */}
          {note && (
            <div className="mt-2 pt-2 border-t border-blue-gray-50">
              <Typography
                variant="small"
                color="gray"
                className="text-xs italic truncate"
              >
                {note}
              </Typography>
            </div>
          )}
        </CardBody>
      </Card>
    );
  }
);

ItemCard.displayName = "ItemCard";

export default ItemCard;

