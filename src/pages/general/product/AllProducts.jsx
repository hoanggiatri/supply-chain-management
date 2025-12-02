import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Card,
  CardBody,
  Chip,
  IconButton,
  Input,
} from "@material-tailwind/react";
import {
  QrCode2 as QrCodeIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  QrCodeScanner as QrCodeScannerIcon,
} from "@mui/icons-material";
import DataTable from "@/components/content-components/DataTable";
import ProductQRModal from "@/components/general/product/ProductQRModal";
import QRScannerModal from "@/components/general/product/QRScannerModal";
import {
  getAllProducts,
  downloadMultipleQR,
} from "@/services/general/ProductService";
import toastrService from "@/services/toastrService";
import { getButtonProps } from "@/utils/buttonStyles";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("productId");

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts(companyId, token);
      setProducts(data);
    } catch (error) {
      toastrService.error("Có lỗi xảy ra khi lấy danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleViewQR = (product) => {
    setSelectedProduct(product);
    setQrModalOpen(true);
  };

  const handleDownloadQR = async (productIds) => {
    try {
      const blob = await downloadMultipleQR(productIds, token);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `QR_Products_${productIds.length}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toastrService.success("Tải QR code thành công!");
    } catch (error) {
      toastrService.error("Có lỗi xảy ra khi tải QR code!");
    }
  };

  const handleDownloadSelectedQR = async () => {
    const productIds = selectedProducts.map((p) => p.productId);
    await handleDownloadQR(productIds);
    setSelectedProducts([]);
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

  const columns = [
    { id: "selection", label: "", sortable: false },
    { id: "productId", label: "ID" },
    { id: "serialNumber", label: "Serial Number" },
    { id: "itemName", label: "Tên sản phẩm" },
    { id: "batchNo", label: "Batch" },
    { id: "status", label: "Trạng thái" },
    { id: "actions", label: "Thao tác", sortable: false },
  ];


  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              QUẢN LÝ SẢN PHẨM
            </Typography>
            <div className="flex gap-2">
              <Button
                {...getButtonProps("secondary")}
                onClick={() => setScanModalOpen(true)}
              >
                <QrCodeScannerIcon className="mr-2" />
                Quét QR
              </Button>
              {selectedProducts.length > 0 && (
                <Button
                  {...getButtonProps("primary")}
                  onClick={handleDownloadSelectedQR}
                >
                  <DownloadIcon className="mr-2" />
                  Tải QR đã chọn ({selectedProducts.length})
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <Typography variant="small" color="gray">
                Đang tải danh sách sản phẩm...
              </Typography>
            </div>
          ) : (
            <DataTable
              rows={products}
              columns={columns}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
              search={search}
              setSearch={setSearch}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              checkboxSelection={true}
              selectedRows={selectedProducts}
              onSelectionChange={setSelectedProducts}
              renderRow={(product, index) => {
                const isLast = index === products.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={product.productId}>
                    <td className={classes}>
                      <input
                        type="checkbox"
                        checked={selectedProducts.some(
                          (p) => p.productId === product.productId
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts([...selectedProducts, product]);
                          } else {
                            setSelectedProducts(
                              selectedProducts.filter(
                                (p) => p.productId !== product.productId
                              )
                            );
                          }
                        }}
                      />
                    </td>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal">
                        {product.productId}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Chip
                        value={product.serialNumber}
                        color="blue"
                        size="sm"
                      />
                    </td>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal">
                        {product.itemName}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal">
                        {product.batchNo}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Chip
                        value={product.status}
                        color={getStatusColor(product.status)}
                        size="sm"
                      />
                    </td>
                    <td className={classes}>
                      <div className="flex gap-2">
                        <IconButton
                          size="sm"
                          onClick={() => handleViewQR(product)}
                          title="Xem QR Code"
                        >
                          <QrCodeIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="sm"
                          onClick={() => handleDownloadQR([product.productId])}
                          title="Tải QR Code"
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="sm"
                          onClick={() =>
                            navigate(`/products/${product.productId}`)
                          }
                          title="Chi tiết"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                );
              }}
            />
          )}
        </CardBody>
      </Card>

      <ProductQRModal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        product={selectedProduct}
      />

      <QRScannerModal
        open={scanModalOpen}
        onClose={() => setScanModalOpen(false)}
        onScanSuccess={(productData) => {
          navigate(`/products/${productData.productId}`);
        }}
      />
    </div>
  );
};

export default AllProducts;

