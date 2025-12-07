import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  QrCode2 as QrCodeIcon,
  Visibility as VisibilityIcon,
  QrCodeScanner as QrCodeScannerIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import ProductQRModal from "@/components/general/product/ProductQRModal";
import QRScannerModal from "@/components/general/product/QRScannerModal";
import {
  getAllProducts,
  downloadMultipleQR,
} from "@/services/general/ProductService";
import toastrService from "@/services/toastrService";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ListPageLayout from "@/components/layout/ListPageLayout";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleViewQR = (product) => {
    setSelectedProduct(product);
    setQrModalOpen(true);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
      setSelectAll(false);
    } else {
      setSelectedProducts([...products]);
      setSelectAll(true);
    }
  };

  const handleSelectProduct = (product, checked) => {
    if (checked) {
      const newSelected = [...selectedProducts, product];
      setSelectedProducts(newSelected);
      setSelectAll(newSelected.length === products.length);
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
      PRODUCED: "bg-orange-100 text-orange-700",
      IN_WAREHOUSE: "bg-green-100 text-green-700",
      ISSUED: "bg-blue-100 text-blue-700",
      SOLD: "bg-purple-100 text-purple-700",
      DELIVERED: "bg-indigo-100 text-indigo-700",
    };
    return statusMap[status] || "bg-gray-100 text-gray-700";
  };

  const columns = [
    {
      id: "select",
      header: () => (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={selectAll}
            onChange={(e) => handleSelectAll()}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => {
        const isSelected = selectedProducts.some(
          (p) => p.productId === row.original.productId
        );
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={isSelected}
              onChange={(e) =>
                handleSelectProduct(row.original, e.target.checked)
              }
              aria-label="Select row"
            />
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "productId",
      header: createSortableHeader("ID"),
    },
    {
      accessorKey: "serialNumber",
      header: createSortableHeader("Serial Number"),
      cell: ({ getValue }) => (
        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700">
          {getValue()}
        </span>
      ),
    },
    {
      accessorKey: "itemName",
      header: createSortableHeader("Tên sản phẩm"),
    },
    {
      accessorKey: "batchNo",
      header: createSortableHeader("Batch"),
    },
    {
      accessorKey: "status",
      header: createSortableHeader("Trạng thái"),
      cell: ({ getValue }) => {
        const status = getValue();
        const colorClass = getStatusColor(status);
        return (
          <span
            className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${colorClass}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewQR(row.original);
            }}
            title="Xem QR Code"
            className="h-8 w-8 p-0"
          >
            <QrCodeIcon fontSize="small" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${row.original.productId}`);
            }}
            title="Chi tiết"
            className="h-8 w-8 p-0"
          >
            <VisibilityIcon fontSize="small" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  return (
    <ListPageLayout
      breadcrumbs="Sản phẩm"
      title="Quản lý sản phẩm"
      description="Quản lý danh sách sản phẩm và QR code"
      actions={
        <>
          <Button variant="outline" onClick={() => setScanModalOpen(true)}>
            <QrCodeScannerIcon className="mr-2 h-4 w-4" />
            Quét QR
          </Button>
          {selectedProducts.length > 0 && (
            <Button onClick={handleDownloadSelectedQR}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Tải QR đã chọn ({selectedProducts.length})
            </Button>
          )}
        </>
      }
    >
      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        onRowClick={(row) => navigate(`/products/${row.productId}`)}
      />

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
    </ListPageLayout>
  );
};

export default AllProducts;
