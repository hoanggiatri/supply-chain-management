import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { XMarkIcon, CameraIcon } from "@heroicons/react/24/outline";
import toastrService from "@/services/toastrService";

const QRScanner = ({ open, onClose, onScanSuccess }) => {
  const [scannerId] = useState("qr-reader-" + Math.random().toString(36).substr(2, 9));
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let html5QrcodeScanner;

    if (open) {
      // Delay initialization to ensure DOM is ready
      setTimeout(() => {
        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };

        html5QrcodeScanner = new Html5QrcodeScanner(
          scannerId,
          config,
          /* verbose= */ false
        );

        html5QrcodeScanner.render(
          (decodedText) => {
            handleScan(decodedText);
          },
          (errorMessage) => {
            // Ignore scan errors as they happen frequently when no QR is found
          }
        );
        setIsScanning(true);
      }, 100);
    }

    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch((error) => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      }
    };
  }, [open, scannerId]);

  const handleScan = (decodedText) => {
    try {
      // Try to parse JSON if it's a JSON string
      let data = decodedText;
      try {
        data = JSON.parse(decodedText);
      } catch (e) {
        // Not JSON, keep as string
      }

      onScanSuccess(data);
      onClose();
      toastrService.success("Quét mã QR thành công!");
    } catch (error) {
      console.error("Error processing scan result:", error);
      toastrService.error("Mã QR không hợp lệ!");
    }
  };

  return (
    <Dialog 
      open={open} 
      handler={onClose} 
      size="sm"
      className="bg-transparent shadow-none"
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-4 right-4 z-10">
          <IconButton
            variant="text"
            color="white"
            className="bg-black/50 hover:bg-black/70 rounded-full"
            onClick={onClose}
          >
            <XMarkIcon className="h-6 w-6" />
          </IconButton>
        </div>
        
        <div className="p-6 text-center bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <CameraIcon className="h-12 w-12 mx-auto mb-2 opacity-80" />
          <Typography variant="h5" className="font-bold">
            Quét mã QR
          </Typography>
          <Typography variant="small" className="opacity-80">
            Di chuyển camera để quét mã QR sản phẩm
          </Typography>
        </div>

        <div className="p-4 bg-black">
          <div 
            id={scannerId} 
            className="overflow-hidden rounded-lg border-2 border-blue-500/50"
          />
        </div>

        <div className="p-4 text-center bg-gray-50">
          <Typography variant="small" color="gray">
            Đang tìm kiếm mã QR...
          </Typography>
        </div>
      </div>
    </Dialog>
  );
};

export default QRScanner;
