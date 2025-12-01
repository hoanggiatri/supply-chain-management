import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Chip,
} from "@material-tailwind/react";
import { QRCodeCanvas } from "qrcode.react";
import { getButtonProps } from "@/utils/buttonStyles";

const QRCodeModal = ({ open, product, onClose }) => {
  if (!product) return null;

  const handleDownloadQR = () => {
    const canvas = document.querySelector("#qr-canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `QR_${product.serialNumber}.png`;
      link.href = url;
      link.click();
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      PRODUCED: "orange",
      IN_WAREHOUSE: "green",
      ISSUED: "blue",
      SOLD: "purple",
    };
    return statusMap[status] || "gray";
  };

  return (
    <Dialog open={open} handler={onClose} size="sm">
      <DialogHeader>QR Code - {product.serialNumber}</DialogHeader>
      <DialogBody className="flex flex-col items-center gap-4">
        <QRCodeCanvas
          id="qr-canvas"
          value={product.qrCode}
          size={256}
          level="H"
          includeMargin={true}
        />

        <div className="w-full space-y-2">
          <div className="flex justify-between">
            <Typography variant="small" color="gray">
              Serial Number:
            </Typography>
            <Typography variant="small" className="font-semibold">
              {product.serialNumber}
            </Typography>
          </div>

          <div className="flex justify-between">
            <Typography variant="small" color="gray">
              Tên sản phẩm:
            </Typography>
            <Typography variant="small" className="font-semibold">
              {product.itemName}
            </Typography>
          </div>

          <div className="flex justify-between">
            <Typography variant="small" color="gray">
              Batch Number:
            </Typography>
            <Typography variant="small" className="font-semibold">
              {product.batchNo}
            </Typography>
          </div>

          <div className="flex justify-between items-center">
            <Typography variant="small" color="gray">
              Trạng thái:
            </Typography>
            <Chip
              value={product.status}
              color={getStatusColor(product.status)}
              size="sm"
              variant="ghost"
            />
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="gap-2">
        <Button {...getButtonProps("secondary")} onClick={onClose}>
          Đóng
        </Button>
        <Button {...getButtonProps("primary")} onClick={handleDownloadQR}>
          Tải xuống
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default QRCodeModal;
