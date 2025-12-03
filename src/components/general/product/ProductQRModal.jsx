import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { QRCodeCanvas } from "qrcode.react";
import { 
  ArrowDownTrayIcon, 
  XMarkIcon, 
  ShareIcon,
  PrinterIcon 
} from "@heroicons/react/24/outline";
import { getButtonProps } from "@/utils/buttonStyles";
import toastrService from "@/services/toastrService";
import StatusBadge from "@/components/common/StatusBadge";

const ProductQRModal = ({ open, onClose, product }) => {
  if (!product) return null;

  const handleDownload = () => {
    try {
      const canvas = document.getElementById("modal-qr-canvas");
      if (!canvas) {
        toastrService.error("Không tìm thấy QR code!");
        return;
      }

      canvas.toBlob((blob) => {
        if (!blob) {
          toastrService.error("Có lỗi xảy ra khi tạo ảnh QR code!");
          return;
        }

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `QR_${product.serialNumber}.png`;
        link.click();
        window.URL.revokeObjectURL(url);
        toastrService.success("Tải QR code thành công!");
      }, "image/png");
    } catch (error) {
      toastrService.error("Có lỗi xảy ra khi tải QR code!");
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const canvas = document.getElementById("modal-qr-canvas");
    const imgUrl = canvas.toDataURL("image/png");
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR - ${product.serialNumber}</title>
          <style>
            body { 
              display: flex; 
              flex-direction: column; 
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              font-family: sans-serif; 
            }
            .qr-container { 
              text-align: center; 
              border: 1px solid #ccc; 
              padding: 20px; 
              border-radius: 10px; 
            }
            img { max-width: 100%; height: auto; }
            h2 { margin: 10px 0 5px; }
            p { margin: 0; color: #666; }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <img src="${imgUrl}" />
            <h2>${product.itemName}</h2>
            <p>${product.serialNumber}</p>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Dialog 
      open={open} 
      handler={onClose} 
      size="sm"
      className="overflow-hidden bg-white rounded-xl shadow-2xl"
    >
      <div className="absolute top-2 right-2 z-10">
        <IconButton variant="text" color="blue-gray" onClick={onClose}>
          <XMarkIcon className="h-5 w-5" />
        </IconButton>
      </div>

      <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 flex flex-col items-center border-b border-blue-100">
        <Typography variant="h5" color="blue-gray" className="font-bold text-center">
          QR Code Sản Phẩm
        </Typography>
        <Typography variant="small" color="blue-gray" className="font-normal opacity-70">
          {product.serialNumber}
        </Typography>
      </DialogHeader>

      <DialogBody className="flex flex-col items-center gap-6 p-8">
        <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100 relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <QRCodeCanvas
            id="modal-qr-canvas"
            value={product.qrCode}
            size={200}
            level="H"
            includeMargin={true}
            className="rounded-lg"
          />
        </div>

        <div className="w-full space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="flex justify-between items-center">
            <Typography variant="small" color="gray" className="font-medium">
              Tên sản phẩm:
            </Typography>
            <Typography variant="small" className="font-bold text-blue-gray-900">
              {product.itemName}
            </Typography>
          </div>
          <div className="flex justify-between items-center">
            <Typography variant="small" color="gray" className="font-medium">
              Batch:
            </Typography>
            <Typography variant="small" className="font-bold text-blue-gray-900">
              {product.batchNo}
            </Typography>
          </div>
          <div className="flex justify-between items-center">
            <Typography variant="small" color="gray" className="font-medium">
              Trạng thái:
            </Typography>
            <StatusBadge status={product.status} size="sm" />
          </div>
        </div>
      </DialogBody>

      <DialogFooter className="bg-gray-50 p-4 flex justify-between gap-2 border-t border-gray-100">
        <Button 
          variant="outlined" 
          color="blue-gray" 
          onClick={handlePrint}
          className="flex items-center gap-2"
        >
          <PrinterIcon className="h-4 w-4" />
          In
        </Button>
        <div className="flex gap-2">
          <Button
            variant="text"
            color="blue"
            onClick={() => {
              window.location.href = `/products/${product.productId}`;
            }}
          >
            Chi tiết
          </Button>
          <Button 
            color="blue" 
            onClick={handleDownload}
            className="flex items-center gap-2 shadow-blue-100 hover:shadow-blue-200"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Tải xuống
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};

export default ProductQRModal;
