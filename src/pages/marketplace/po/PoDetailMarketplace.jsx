import React, { useEffect, useState, useCallback } from "react";
import {
  Typography,
  Card,
  CardBody,
  Button,
  Chip,
  Spinner,
} from "@material-tailwind/react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ItemCard,
  EmptyState,
  formatDate,
  formatCurrency,
  getStatusColor,
} from "@/components/marketplace";
import { getPoById } from "@/services/purchasing/PoService";
import toastrService from "@/services/toastrService";

const PoDetailMarketplace = () => {
  const { poId } = useParams();
  const navigate = useNavigate();
  const [po, setPo] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch PO
  useEffect(() => {
    const fetchPo = async () => {
      setLoading(true);
      try {
        const data = await getPoById(poId, token);
        setPo(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Lỗi khi tải đơn mua hàng!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPo();
  }, [poId, token]);

  // Navigate back
  const handleBack = useCallback(() => {
    navigate("/marketplace/pos");
  }, [navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="h-12 w-12" color="blue" />
      </div>
    );
  }

  // Not found state
  if (!po) {
    return (
      <div className="p-6">
        <EmptyState
          title="Không tìm thấy đơn mua hàng"
          description="Đơn mua hàng này không tồn tại hoặc đã bị xóa."
          actionLabel="Quay lại danh sách"
          onAction={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Card */}
      <Card className="shadow-lg mb-6">
        <CardBody>
          {/* Back button and title */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="text"
                color="blue-gray"
                className="flex items-center gap-2"
                onClick={handleBack}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
                Quay lại
              </Button>
              <Typography variant="h4" color="blue-gray" className="font-bold">
                {po.poCode}
              </Typography>
              <Chip
                value={po.status}
                color={getStatusColor(po.status)}
                className="shadow-md"
              />
            </div>
          </div>

          {/* PO Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-gray-50 rounded-lg p-4">
              <Typography variant="small" color="gray" className="mb-1">
                Nhà cung cấp
              </Typography>
              <Typography variant="h6" color="blue-gray">
                {po.supplierCompanyName || "N/A"}
              </Typography>
              <Typography variant="small" color="gray">
                Mã: {po.supplierCompanyCode || "N/A"}
              </Typography>
            </div>

            <div className="bg-blue-gray-50 rounded-lg p-4">
              <Typography variant="small" color="gray" className="mb-1">
                Mã báo giá
              </Typography>
              <Typography variant="h6" color="blue-gray">
                {po.quotationCode || "N/A"}
              </Typography>
            </div>

            <div className="bg-blue-gray-50 rounded-lg p-4">
              <Typography variant="small" color="gray" className="mb-1">
                Phương thức thanh toán
              </Typography>
              <Typography variant="h6" color="blue-gray">
                {po.paymentMethod || "N/A"}
              </Typography>
            </div>

            <div className="bg-blue-gray-50 rounded-lg p-4">
              <Typography variant="small" color="gray" className="mb-1">
                Người tạo
              </Typography>
              <Typography variant="h6" color="blue-gray">
                {po.createdBy || "N/A"}
              </Typography>
              <Typography variant="small" color="gray">
                {formatDate(po.createdOn)}
              </Typography>
            </div>
          </div>

          {/* Total Amount */}
          {po.totalAmount && (
            <div className="mt-4 bg-blue-50 rounded-lg p-4 inline-block">
              <Typography
                variant="small"
                color="blue"
                className="mb-1 font-medium"
              >
                Tổng giá trị đơn hàng
              </Typography>
              <Typography variant="h4" color="blue" className="font-bold">
                {formatCurrency(po.totalAmount)}
              </Typography>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Items Card */}
      <Card className="shadow-lg">
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="font-bold mb-6">
            DANH SÁCH HÀNG HÓA
            <span className="text-gray-500 font-normal ml-2">
              ({po.poDetails?.length || 0} sản phẩm)
            </span>
          </Typography>

          {/* Items Grid */}
          {po.poDetails?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {po.poDetails.map((detail, index) => (
                <ItemCard
                  key={detail.poDetailId || index}
                  itemCode={detail.itemCode}
                  itemName={detail.itemName}
                  imageUrl={detail.imageUrl || detail.itemImageUrl}
                  quantity={detail.quantity}
                  price={detail.itemPrice}
                  discount={detail.discount}
                  note={detail.note}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Không có hàng hóa"
              description="Đơn mua hàng này chưa có hàng hóa nào."
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default PoDetailMarketplace;
