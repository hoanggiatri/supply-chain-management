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
import { getSoById } from "@/services/sale/SoService";
import toastrService from "@/services/toastrService";

const SoDetailMarketplace = () => {
  const { soId } = useParams();
  const navigate = useNavigate();
  const [so, setSo] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch SO
  useEffect(() => {
    const fetchSo = async () => {
      setLoading(true);
      try {
        const data = await getSoById(soId, token);
        setSo(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Lỗi khi tải đơn bán hàng!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSo();
  }, [soId, token]);

  // Navigate back
  const handleBack = useCallback(() => {
    navigate("/marketplace/sos");
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
  if (!so) {
    return (
      <div className="p-6">
        <EmptyState
          title="Không tìm thấy đơn bán hàng"
          description="Đơn bán hàng này không tồn tại hoặc đã bị xóa."
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
                {so.soCode}
              </Typography>
              <Chip
                value={so.status}
                color={getStatusColor(so.status)}
                className="shadow-md"
              />
            </div>
          </div>

          {/* SO Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-gray-50 rounded-lg p-4">
              <Typography variant="small" color="gray" className="mb-1">
                Khách hàng
              </Typography>
              <Typography variant="h6" color="blue-gray">
                {so.customerCompanyName || "N/A"}
              </Typography>
              <Typography variant="small" color="gray">
                Mã: {so.customerCompanyCode || "N/A"}
              </Typography>
            </div>

            <div className="bg-blue-gray-50 rounded-lg p-4">
              <Typography variant="small" color="gray" className="mb-1">
                Mã đơn mua
              </Typography>
              <Typography variant="h6" color="blue-gray">
                {so.poCode || "N/A"}
              </Typography>
            </div>

            <div className="bg-blue-gray-50 rounded-lg p-4">
              <Typography variant="small" color="gray" className="mb-1">
                Phương thức thanh toán
              </Typography>
              <Typography variant="h6" color="blue-gray">
                {so.paymentMethod || "N/A"}
              </Typography>
            </div>

            <div className="bg-blue-gray-50 rounded-lg p-4">
              <Typography variant="small" color="gray" className="mb-1">
                Người tạo
              </Typography>
              <Typography variant="h6" color="blue-gray">
                {so.createdBy || "N/A"}
              </Typography>
              <Typography variant="small" color="gray">
                {formatDate(so.createdOn)}
              </Typography>
            </div>
          </div>

          {/* Total Amount */}
          {so.totalAmount && (
            <div className="mt-4 bg-blue-50 rounded-lg p-4 inline-block">
              <Typography
                variant="small"
                color="blue"
                className="mb-1 font-medium"
              >
                Tổng giá trị đơn hàng
              </Typography>
              <Typography variant="h4" color="blue" className="font-bold">
                {formatCurrency(so.totalAmount)}
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
              ({so.soDetails?.length || 0} sản phẩm)
            </span>
          </Typography>

          {/* Items Grid */}
          {so.soDetails?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {so.soDetails.map((detail, index) => (
                <ItemCard
                  key={detail.soDetailId || index}
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
              description="Đơn bán hàng này chưa có hàng hóa nào."
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default SoDetailMarketplace;
