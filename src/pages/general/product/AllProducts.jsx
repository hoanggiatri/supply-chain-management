import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Card,
  CardBody,
  IconButton,
  Checkbox,
  Input,
  CardFooter,
  Tooltip,
} from "@material-tailwind/react";
import {
  QrCodeIcon,
  EyeIcon,
  ViewfinderCircleIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import ProductQRModal from "@/components/general/product/ProductQRModal";
import QRScannerModal from "@/components/general/product/QRScannerModal";
import { getAllProducts, downloadMultipleQR } from "@/services/general/ProductService";
import toastrService from "@/services/toastrService";
import { getButtonProps } from "@/utils/buttonStyles";
import StatusBadge from "@/components/common/StatusBadge";
import { SkeletonTable } from "@/components/common/LoadingSkeleton";
import EmptyState from "@/components/common/EmptyState";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
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
      // Add a small delay to show the skeleton animation (optional, for UX feel)
      setTimeout(() => setLoading(false), 500);
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
  
  // Pagination logic
  const totalPages = Math.ceil(sortedProducts.length / rowsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

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

  return (
    <div className="p-6 min-h-screen bg-gray-50/50">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Typography variant="h4" color="blue-gray" className="font-bold">
            Quản lý Sản phẩm
          </Typography>
          <Typography variant="small" color="gray" className="font-normal mt-1">
            Xem và quản lý tất cả sản phẩm trong hệ thống
          </Typography>
        </div>
        <div className="flex gap-2">
            <Button
              {...getButtonProps("secondary")}
              onClick={() => setScanModalOpen(true)}
              className="flex items-center gap-2"
            >
              <ViewfinderCircleIcon className="h-4 w-4" />
              Quét QR
            </Button>
            {selectedProducts.length > 0 && (
              <Button
                {...getButtonProps("primary")}
                onClick={handleDownloadSelectedQR}
                className="flex items-center gap-2 animate-fade-in"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                Tải QR ({selectedProducts.length})
              </Button>
            )}
        </div>
      </div>

      <Card className="h-full w-full shadow-sm border border-blue-gray-100">
        <CardBody className="p-0">
          {/* Toolbar */}
          <div className="p-4 border-b border-blue-gray-50 flex flex-col md:flex-row justify-between gap-4 items-center bg-white rounded-t-xl">
            <div className="w-full md:w-72">
              <Input
                label="Tìm kiếm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                color="blue"
                className="!border-blue-gray-200 focus:!border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
               <Tooltip content="Bộ lọc nâng cao (Coming soon)">
                <IconButton variant="text" color="blue-gray">
                  <FunnelIcon className="h-5 w-5" />
                </IconButton>
               </Tooltip>
            </div>
          </div>

          {/* Table Content */}
          {loading ? (
            <div className="p-4">
              <SkeletonTable rows={10} columns={7} />
            </div>
          ) : filteredProducts.length === 0 ? (
            <EmptyState 
              type={search ? "search" : "noData"} 
              title={search ? "Không tìm thấy kết quả" : "Chưa có sản phẩm"}
              description={search ? `Không tìm thấy sản phẩm nào khớp với "${search}"` : "Danh sách sản phẩm hiện đang trống."}
            />
          ) : (
            <div className="overflow-auto">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 w-16">
                      <Checkbox
                        checked={selectAll}
                        onChange={handleSelectAll}
                        color="blue"
                        containerProps={{ className: "p-0" }}
                      />
                    </th>
                    {[
                      { id: "productId", label: "ID" },
                      { id: "serialNumber", label: "Serial Number" },
                      { id: "itemName", label: "Tên sản phẩm" },
                      { id: "batchNo", label: "Batch" },
                      { id: "status", label: "Trạng thái" },
                    ].map((head) => (
                      <th
                        key={head.id}
                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 cursor-pointer hover:bg-blue-gray-50 transition-colors"
                        onClick={() => handleRequestSort(head.id)}
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                        >
                          {head.label}
                          {orderBy === head.id && (
                            <ChevronUpDownIcon strokeWidth={2} className={`h-4 w-4 transition-transform ${order === "desc" ? "rotate-180" : ""}`} />
                          )}
                          {orderBy !== head.id && (
                            <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4 opacity-0 group-hover:opacity-50" />
                          )}
                        </Typography>
                      </th>
                    ))}
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 text-center">
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
                      <tr 
                        key={product.productId} 
                        className={`hover:bg-blue-gray-50/50 transition-colors ${isSelected ? "bg-blue-50/30" : ""}`}
                      >
                        <td className={classes}>
                          <Checkbox
                            checked={isSelected}
                            onChange={(e) =>
                              handleSelectProduct(product, e.target.checked)
                            }
                            color="blue"
                            containerProps={{ className: "p-0" }}
                          />
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {product.productId}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-semibold">
                            {product.serialNumber}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {product.itemName}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {product.batchNo}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <StatusBadge status={product.status} />
                        </td>
                        <td className={classes}>
                          <div className="flex justify-center gap-2">
                            <Tooltip content="Xem QR Code">
                              <IconButton
                                variant="text"
                                color="blue"
                                size="sm"
                                onClick={() => handleViewQR(product)}
                              >
                                <QrCodeIcon className="h-5 w-5" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip content="Xem chi tiết">
                              <IconButton
                                variant="text"
                                color="blue-gray"
                                size="sm"
                                onClick={() =>
                                  navigate(`/products/${product.productId}`)
                                }
                              >
                                <EyeIcon className="h-5 w-5" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
        
        {/* Pagination */}
        {!loading && filteredProducts.length > 0 && (
          <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
            <Typography variant="small" color="blue-gray" className="font-normal">
              Trang {page} / {totalPages} • Tổng {filteredProducts.length} sản phẩm
            </Typography>
            <div className="flex gap-2">
              <Button
                variant="outlined"
                size="sm"
                color="blue-gray"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Trước
              </Button>
              <Button
                variant="outlined"
                size="sm"
                color="blue-gray"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
              >
                Sau
              </Button>
            </div>
          </CardFooter>
        )}
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
