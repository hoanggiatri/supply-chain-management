import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Button,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Input,
  Card,
  CardBody,
  Typography,
  Chip,
} from "@material-tailwind/react";
import {
  QrCodeScanner as QrCodeScannerIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { Html5Qrcode } from "html5-qrcode";
import { scanQRCodeDetail } from "@/services/general/ProductService";
import toastrService from "@/services/toastrService";
import { getButtonProps } from "@/utils/buttonStyles";

const QRScannerModal = ({ open, onClose, onScanSuccess }) => {
  const [activeTab, setActiveTab] = useState("camera");
  const [manualInput, setManualInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanner, setScanner] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const token = localStorage.getItem("token");

  const handleScan = async (qrCode) => {
    setLoading(true);
    try {
      let codeToScan = qrCode;
      // Handle if QR is a URL
      if (qrCode.includes("/verify-product/")) {
        const parts = qrCode.split("/verify-product/");
        if (parts.length > 1) {
          codeToScan = parts[1];
        }
      }

      const productData = await scanQRCodeDetail(codeToScan, token);
      toastrService.success("Quét QR thành công!");
      onScanSuccess(productData);
      handleClose();
    } catch (error) {
      toastrService.error("Không tìm thấy sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  const startScanning = async () => {
    try {
      const html5QrCode = new Html5Qrcode("scanner-qr-reader");
      setScanner(html5QrCode);
      setIsScanning(true);

      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          handleScan(decodedText);
          html5QrCode.stop();
          setIsScanning(false);
        },
        () => { }
      );
    } catch (error) {
      toastrService.error("Không thể khởi động camera!");
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (scanner && isScanning) {
      scanner.stop().then(() => {
        setIsScanning(false);
      });
    }
  };

  const handleManualSubmit = () => {
    if (!manualInput.trim()) {
      toastrService.warning("Vui lòng nhập mã QR!");
      return;
    }
    handleScan(manualInput.trim());
  };

  const handleClose = () => {
    stopScanning();
    setManualInput("");
    setActiveTab("camera");
    onClose();
  };

  return (
    <Dialog open={open} handler={handleClose} size="md">
      <DialogHeader>Quét QR Code</DialogHeader>
      <DialogBody>
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
          <TabsHeader>
            <Tab value="camera">
              <div className="flex items-center gap-2">
                <QrCodeScannerIcon />
                Quét bằng Camera
              </div>
            </Tab>
            <Tab value="manual">
              <div className="flex items-center gap-2">
                <EditIcon />
                Nhập thủ công
              </div>
            </Tab>
          </TabsHeader>

          <TabsBody>
            <TabPanel value="camera">
              <Card>
                <CardBody className="text-center">
                  <div id="scanner-qr-reader" className="w-full"></div>

                  {!isScanning && (
                    <Button
                      {...getButtonProps("primary")}
                      fullWidth
                      onClick={startScanning}
                      className="mt-4"
                    >
                      <QrCodeScannerIcon className="mr-2" />
                      Bắt đầu quét
                    </Button>
                  )}

                  {isScanning && (
                    <Button
                      {...getButtonProps("danger")}
                      fullWidth
                      onClick={stopScanning}
                      className="mt-4"
                    >
                      Dừng quét
                    </Button>
                  )}
                </CardBody>
              </Card>
            </TabPanel>

            <TabPanel value="manual">
              <Card>
                <CardBody>
                  <Input
                    label="Nhập mã QR"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleManualSubmit();
                      }
                    }}
                    placeholder="PRODUCT-1-A1B2C3D4"
                  />

                  <Button
                    {...getButtonProps("primary")}
                    fullWidth
                    onClick={handleManualSubmit}
                    className="mt-4"
                    disabled={loading}
                  >
                    {loading ? "Đang tìm kiếm..." : "Tìm kiếm"}
                  </Button>
                </CardBody>
              </Card>
            </TabPanel>
          </TabsBody>
        </Tabs>
      </DialogBody>
    </Dialog>
  );
};

export default QRScannerModal;
