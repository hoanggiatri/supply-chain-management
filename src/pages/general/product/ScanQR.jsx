import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Input,
  Button,
  Chip,
} from "@material-tailwind/react";
import { QrCodeIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Html5Qrcode } from "html5-qrcode";
import { scanQRCodeDetail } from "@/services/general/ProductService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import toastrService from "@/services/toastrService";
import { getButtonProps } from "@/utils/buttonStyles";

const ScanQR = () => {
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("camera");
  const [qrCodeInput, setQrCodeInput] = useState("");
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanner, setScanner] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.stop().catch(() => { });
      }
    };
  }, [scanner]);

  const handleScan = async (qrCode) => {
    setLoading(true);
    try {
      const data = await scanQRCodeDetail(qrCode, token);
      setProductDetail(data);
      toastrService.success("Quét QR thành công!");
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Không tìm thấy sản phẩm!"
      );
      setProductDetail(null);
    } finally {
      setLoading(false);
    }
  };

  const startScanning = async () => {
    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
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
    if (!qrCodeInput.trim()) {
      toastrService.warning("Vui lòng nhập mã QR!");
      return;
    }
    handleScan(qrCodeInput.trim());
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
    <div className="p-6">
      <Card className="shadow-lg max-w-4xl mx-auto">
        <CardBody>
          <Typography variant="h4" color="blue-gray" className="font-bold mb-6">
            QUÉT MÃ QR SẢN PHẨM
          </Typography>

          <Tabs value={activeTab} className="mb-6">
            <TabsHeader>
              <Tab value="camera" onClick={() => setActiveTab("camera")}>
                <div className="flex items-center gap-2">
                  <QrCodeIcon className="h-5 w-5" />
                  Quét bằng Camera
                </div>
              </Tab>
              <Tab value="manual" onClick={() => setActiveTab("manual")}>
                <div className="flex items-center gap-2">
                  <PencilIcon className="h-5 w-5" />
                  Nhập thủ công
                </div>
              </Tab>
            </TabsHeader>

            <TabsBody>
              <TabPanel value="camera">
                <div className="flex flex-col items-center gap-4">
                  <div
                    id="qr-reader"
                    className="w-full max-w-md"
                    style={{ display: isScanning ? "block" : "none" }}
                  />

                  {!isScanning && (
                    <div className="w-full max-w-md h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Typography variant="small" color="gray">
                        Nhấn nút bên dưới để bắt đầu quét
                      </Typography>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {!isScanning ? (
                      <Button
                        {...getButtonProps("primary")}
                        onClick={startScanning}
                      >
                        Bắt đầu quét
                      </Button>
                    ) : (
                      <Button
                        {...getButtonProps("danger")}
                        onClick={stopScanning}
                      >
                        Dừng quét
                      </Button>
                    )}
                  </div>
                </div>
              </TabPanel>

              <TabPanel value="manual">
                <div className="flex flex-col gap-4">
                  <Input
                    label="Nhập mã QR"
                    color="blue"
                    size="lg"
                    value={qrCodeInput}
                    onChange={(e) => setQrCodeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleManualSubmit();
                      }
                    }}
                  />
                  <Button
                    {...getButtonProps("primary")}
                    onClick={handleManualSubmit}
                  >
                    Tìm kiếm
                  </Button>
                </div>
              </TabPanel>
            </TabsBody>
          </Tabs>

          {loading && <LoadingPaper title="Đang tải thông tin..." />}

          {!loading && productDetail && (
            <Card className="mt-6 bg-blue-gray-50">
              <CardBody className="space-y-4">
                <div className="flex justify-between items-center">
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="font-bold"
                  >
                    THÔNG TIN SẢN PHẨM
                  </Typography>
                  <Button
                    {...getButtonProps("primary")}
                    size="sm"
                    onClick={() =>
                      (window.location.href = `/products/${productDetail.productId}`)
                    }
                  >
                    Xem chi tiết
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Typography variant="small" color="gray">
                      Product ID
                    </Typography>
                    <Typography variant="small" className="font-semibold">
                      {productDetail.productId}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="small" color="gray">
                      Serial Number
                    </Typography>
                    <Chip
                      value={productDetail.serialNumber}
                      color="blue"
                      size="sm"
                      variant="ghost"
                      className="w-max"
                    />
                  </div>

                  <div>
                    <Typography variant="small" color="gray">
                      Tên sản phẩm
                    </Typography>
                    <Typography variant="small" className="font-semibold">
                      {productDetail.itemName}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="small" color="gray">
                      Mã sản phẩm
                    </Typography>
                    <Typography variant="small" className="font-semibold">
                      {productDetail.itemCode}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="small" color="gray">
                      Batch Number
                    </Typography>
                    <Typography variant="small" className="font-semibold">
                      {productDetail.batchNo}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="small" color="gray">
                      Trạng thái
                    </Typography>
                    <Chip
                      value={productDetail.status}
                      color={getStatusColor(productDetail.status)}
                      size="sm"
                      variant="ghost"
                      className="w-max"
                    />
                  </div>

                  {productDetail.currentCompanyName && (
                    <div>
                      <Typography variant="small" color="gray">
                        Công ty hiện tại
                      </Typography>
                      <Typography variant="small" className="font-semibold">
                        {productDetail.currentCompanyName}
                      </Typography>
                    </div>
                  )}

                  {productDetail.manufacturerCompanyName && (
                    <div>
                      <Typography variant="small" color="gray">
                        Nhà sản xuất
                      </Typography>
                      <Typography variant="small" className="font-semibold">
                        {productDetail.manufacturerCompanyName}
                      </Typography>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ScanQR;

