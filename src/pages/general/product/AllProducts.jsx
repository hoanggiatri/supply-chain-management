import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Card,
  CardBody,
  Chip,
  IconButton,
  Checkbox,
  Input,
  CardFooter,
} from "@material-tailwind/react";
import {
  QrCode2 as QrCodeIcon,
  Visibility as VisibilityIcon,
  QrCodeScanner as QrCodeScannerIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { MagnifyingGlassIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import ProductQRModal from "@/components/general/product/ProductQRModal";
import QRScannerModal from "@/components/general/product/QRScannerModal";
import { getAllProducts, downloadMultipleQR } from "@/services/general/ProductService";
import toastrService from "@/services/toastrService";
import { getButtonProps } from "@/utils/buttonStyles";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
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

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
      setSelectAll(false);
    } else {
      setSelectedProducts([...filteredProducts]);
      setSelectAll(true);
    }
  };

  const handleSelectProduct = (product, checked) => {
    if (checked) {
      const newSelected = [...selectedProducts, product];
      setSelectedProducts(newSelected);
      setSelectAll(newSelected.length === filteredProducts.length);
    } else {
      const newSelected = selectedProducts.filter(
        (p) => p.productId !== product.productId
      );
      setSelectedProducts(newSelected);
      setSelectAll(false);
    }
  };

  const handleDownloadSelectedQR = async () => {
    if (selectedProducts.length === 0) {
      toastrService.warning("Vui lòng chọn ít nhất một sản phẩm!");
      return;
    }

    try {
      const productIds = selectedProducts.map((p) => p.productId);
      toastrService.info("Đang tạo file PDF...");
      const blob = await downloadMultipleQR(productIds, token);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `QR_Products_${productIds.length}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toastrService.success("Tải QR code thành công!");
      setSelectedProducts([]);
      setSelectAll(false);
    } catch (error) {
      toastrService.error("Có lỗi xảy ra khi tải QR code!");
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

  // Filter and sort logic
  const filterRows = (rows, searchTerm) => {
    if (!searchTerm) return rows;
    const lowercased = searchTerm.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(lowercased)
      )
    );
  };

  const sortRows = (rows, order, orderBy) => {
    return [...rows].sort((a, b) => {
      if (order === "desc") {
        return b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0;
      }
      return a[orderBy] < b[orderBy] ? -1 : a[orderBy] > b[orderBy] ? 1 : 0;
    });
  };

  const filteredProducts = filterRows(products, search);
  const sortedProducts = sortRows(filteredProducts, order, orderBy);
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const totalPages = Math.ceil(sortedProducts.length / rowsPerPage);

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

          {/* Search */}
          <div className="mb-4 w-72">
            <Input
              label="Tìm kiếm"
              value={search}
              placeholder="Nhập từ khóa tìm kiếm"
              onChange={(e) => setSearch(e.target.value)}
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              color="blue"
            />
          </div>

          {loading ? (
            <div className="text-center py-8">
              <Typography variant="small" color="gray">
                Đang tải danh sách sản phẩm...
              </Typography>
            </div>
          ) : (
            <>
              <div className="overflow-auto">
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <Checkbox
                          checked={selectAll}
                          onChange={handleSelectAll}
                          color="blue"
                        />
                      </th>
                      <th
                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 cursor-pointer hover:bg-blue-gray-50"
                        onClick={() => handleRequestSort("productId")}
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="flex items-center gap-2 font-normal leading-none opacity-70"
                        >
                          ID
                          <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                        </Typography>
                      </th>
                      <th
                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 cursor-pointer hover:bg-blue-gray-50"
                        onClick={() => handleRequestSort("serialNumber")}
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="flex items-center gap-2 font-normal leading-none opacity-70"
                        >
                          Serial Number
                          <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                        </Typography>
                      </th>
                      <th
                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 cursor-pointer hover:bg-blue-gray-50"
                        onClick={() => handleRequestSort("itemName")}
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="flex items-center gap-2 font-normal leading-none opacity-70"
                        >
                          Tên sản phẩm
                          <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                        </Typography>
                      </th>
                      <th
                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 cursor-pointer hover:bg-blue-gray-50"
                        onClick={() => handleRequestSort("batchNo")}
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="flex items-center gap-2 font-normal leading-none opacity-70"
                        >
                          Batch
                          <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                        </Typography>
                      </th>
                      <th
                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 cursor-pointer hover:bg-blue-gray-50"
                        onClick={() => handleRequestSort("status")}
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="flex items-center gap-2 font-normal leading-none opacity-70"
                        >
                          Trạng thái
                          <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                        </Typography>
                      </th>
                      <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          Thao tác
                        </Typography>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((product, index) => {
                      const isLast = index === paginatedProducts.length - 1;
                      const classes = isLast
                        ? "p-4"
                        : "p-4 border-b border-blue-gray-50";
                      const isSelected = selectedProducts.some(
                        (p) => p.productId === product.productId
                      );

                      return (
                        <tr key={product.productId}>
                          <td className={classes}>
                            <Checkbox
                              checked={isSelected}
                              onChange={(e) =>
                                handleSelectProduct(product, e.target.checked)
                              }
                              color="blue"
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
                                color="blue"
                                onClick={() => handleViewQR(product)}
                                title="Xem QR Code"
                              >
                                <QrCodeIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="sm"
                                color="blue-gray"
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
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  Trang {page} / {totalPages} (Tổng: {sortedProducts.length} kết quả)
                </Typography>
                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Trước
                  </Button>
                  <Button
                    variant="outlined"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                  >
                    Sau
                  </Button>
                </div>
              </CardFooter>
            </>
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
