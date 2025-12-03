import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
  Chip,
} from "@material-tailwind/react";
import {
  ArrowDownTrayIcon,
  PrinterIcon,
  LinkIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/24/outline";
import QRScannerModal from "@/components/general/product/QRScannerModal";
import { Grid, Divider, Box } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import BackButton from "@/components/common/BackButton";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import {
  getProductById,
  downloadMultipleQR,
} from "@/services/general/ProductService";
import toastrService from "@/services/toastrService";
import { getButtonProps } from "@/utils/buttonStyles";
import dayjs from "dayjs";
import StatusBadge from "@/components/common/StatusBadge";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const data = await getProductById(productId, token);
      setProduct(data);
    } catch (error) {
      toastrService.error("Có lỗi xảy ra khi lấy thông tin sản phẩm!");
    }
  };

  const handleDownloadQR = async () => {
    try {
      const blob = await downloadMultipleQR([productId], token);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `QR_${product.serialNumber}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toastrService.success("Tải QR code thành công!");
    } catch (error) {
      toastrService.error("Có lỗi xảy ra khi tải QR code!");
    }
  };

  const handlePrintQR = () => {
    const canvas = document.getElementById("product-qr-canvas");
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code - ${product.serialNumber}</title>
            <style>
              body { text-align: center; padding: 20px; }
              img { max-width: 400px; }
              h3 { margin-top: 10px; }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" />
            <h3>${product.serialNumber}</h3>
            <p>${product.qrCode}</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
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

  if (!product) {
    return <LoadingPaper title="THÔNG TIN SẢN PHẨM" />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <BackButton to="/products" label="Quay lại danh sách" />
        <Button
          {...getButtonProps("secondary")}
          onClick={() => setScanModalOpen(true)}
        >
          <ViewfinderCircleIcon className="mr-2 h-5 w-5" />
          Quét QR khác
        </Button>
      </div>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardBody className="text-center">
              <Typography variant="h6" className="mb-4">
                QR Code
              </Typography>

              <Box className="p-4 bg-white inline-block">
                <QRCodeCanvas
                  id="product-qr-canvas"
                  value={product.qrCode}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </Box>

              <Typography variant="small" className="mt-4 block">
                {product.qrCode}
              </Typography>

              <div className="mt-4 space-y-2">
                <Button
                  {...getButtonProps("primary")}
                  fullWidth
                  onClick={handleDownloadQR}
                >
                  <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
                  Tải QR Code
                </Button>

                <Button
                  {...getButtonProps("secondary")}
                  fullWidth
                  onClick={handlePrintQR}
                >
                  <PrinterIcon className="mr-2 h-5 w-5" />
                  In QR Code
                </Button>
              </div>
            </CardBody>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader floated={false} shadow={false}>
              <Typography variant="h5">Thông tin sản phẩm</Typography>
            </CardHeader>
            <CardBody>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="small" color="gray" className="mb-1">
                    Product ID
                  </Typography>
                  <Typography variant="h6">{product.productId}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="small" color="gray" className="mb-1">
                    Serial Number
                  </Typography>
                  <Chip value={product.serialNumber} color="blue" />
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="small" color="gray" className="mb-1">
                    Tên sản phẩm
                  </Typography>
                  <Typography variant="h6">{product.itemName}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="small" color="gray" className="mb-1">
                    Mã sản phẩm
                  </Typography>
                  <Typography>{product.itemCode}</Typography>
                </Grid>

                {product.description && (
                  <Grid item xs={12}>
                    <Typography variant="small" color="gray" className="mb-1">
                      Mô tả
                    </Typography>
                    <Typography>{product.description}</Typography>
                  </Grid>
                )}

                {product.technicalSpecifications && (
                  <Grid item xs={12}>
                    <Typography variant="small" color="gray" className="mb-1">
                      Thông số kỹ thuật
                    </Typography>
                    <Typography>{product.technicalSpecifications}</Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="small" color="gray" className="mb-1">
                    Batch Number
                  </Typography>
                  <Typography>{product.batchNo}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="small" color="gray" className="mb-1">
                    Trạng thái
                  </Typography>
                  <StatusBadge status={product.status} />
                </Grid>

                {product.currentCompanyName && (
                  <Grid item xs={6}>
                    <Typography variant="small" color="gray" className="mb-1">
                      Công ty hiện tại
                    </Typography>
                    <Typography>{product.currentCompanyName}</Typography>
                  </Grid>
                )}

                {product.manufacturerCompanyName && (
                  <Grid item xs={6}>
                    <Typography variant="small" color="gray" className="mb-1">
                      Nhà sản xuất
                    </Typography>
                    <Typography>{product.manufacturerCompanyName}</Typography>
                  </Grid>
                )}

                {product.manufacturedDate && (
                  <Grid item xs={6}>
                    <Typography variant="small" color="gray" className="mb-1">
                      Ngày sản xuất
                    </Typography>
                    <Typography>
                      {dayjs(product.manufacturedDate).format("DD/MM/YYYY HH:mm")}
                    </Typography>
                  </Grid>
                )}

                {product.moCode && (
                  <Grid item xs={12}>
                    <Button
                      {...getButtonProps("secondary")}
                      onClick={() => navigate(`/mo/${product.moId}`)}
                    >
                      <LinkIcon className="mr-2 h-5 w-5" />
                      Xem công lệnh sản xuất: {product.moCode}
                    </Button>
                  </Grid>
                )}
              </Grid>
            </CardBody>
          </Card>
        </Grid>
      </Grid>

      <QRScannerModal
        open={scanModalOpen}
        onClose={() => setScanModalOpen(false)}
        onScanSuccess={(productData) => {
          navigate(`/products/${productData.productId}`);
          setScanModalOpen(false);
        }}
      />
    </div>
  );
};

export default ProductDetail;

