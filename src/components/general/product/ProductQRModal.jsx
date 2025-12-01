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
import { Download as DownloadIcon } from "@mui/icons-material";
import { getButtonProps } from "@/utils/buttonStyles";

const ProductQRModal = ({ open, onClose, product }) => {
  if (!product) return null;

  const handleDownload = () => {
    const canvas = document.getElementById("modal-qr-canvas");
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
      DELIVERED: "deep-purple",
    };
    return statusMap[status] || "gray";
  };

  return (
    <Dialog open={open} handler={onClose} size="sm">
      <DialogHeader>QR Code - {product.serialNumber}</DialogHeader>
      <DialogBody className="flex flex-col items-center gap-4">
        <QRCodeCanvas
          id="modal-qr-canvas"
          value={product.qrCode}
          size={250}
          level="H"
          includeMargin={true}
        />

        <Typography variant="small" className="text-center">
          {product.qrCode}
        </Typography>

        <div className="w-full space-y-2">
          <div className="flex justify-between items-center">
            <Typography variant="small" color="gray">
              Serial Number:
            </Typography>
            <Chip value={product.serialNumber} color="blue" size="sm" />
          </div>

          <div className="flex justify-between items-center">
            <Typography variant="small" color="gray">
              Tên sản phẩm:
            </Typography>
            <Typography variant="small" className="font-semibold">
              {product.itemName}
            </Typography>
          </div>

          <div className="flex justify-between items-center">
            <Typography variant="small" color="gray">
              Batch:
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
            />
          </div>
        </div>
      </DialogBody>

      <DialogFooter className="gap-2">
        <Button {...getButtonProps("secondary")} onClick={onClose}>
          Đóng
        </Button>
        <Button {...getButtonProps("primary")} onClick={handleDownload}>
          <DownloadIcon className="mr-2" />
          Tải xuống
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ProductQRModal;
