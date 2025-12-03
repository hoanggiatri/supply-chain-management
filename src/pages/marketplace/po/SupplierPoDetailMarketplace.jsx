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
import { getPoById, updatePoStatus } from "@/services/purchasing/PoService";
import toastrService from "@/services/toastrService";
import { getButtonProps } from "@/utils/buttonStyles";

const SupplierPoDetailMarketplace = () => {
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
          error.response?.data?.message || "Lỗi khi tải đơn đặt hàng!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPo();
  }, [poId, token]);

  // Handle confirm PO
  const handleConfirmPo = useCallback(async () => {
    const result = await toastrService.confirm(
      "Bạn có chắc chắn muốn xác nhận đơn đặt hàng này không?"
    );
    if (!result.isConfirmed) return;

    try {
      await updatePoStatus(po.poId, "Đã xác nhận", token);
      toastrService.success("Đã xác nhận đơn đặt hàng!");
      setPo((prev) => ({ ...prev, status: "Đã xác nhận" }));
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi khi xác nhận đơn đặt hàng!"
      );
    }
  }, [po, token]);

  // Navigate to create SO
  const handleCreateSo = useCallback(() => {
    navigate(`/create-so/${poId}`);
  }, [navigate, poId]);

  // Navigate back
  const handleBack = useCallback(() => {
    navigate("/marketplace/supplier-pos");
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
          title="Không tìm thấy đơn đặt hàng"
          description="Đơn đặt hàng này không tồn tại hoặc đã bị xóa."
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
          {/* Back button and actions */}
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

            <div className="flex gap-2">
              {po.status === "Chờ xác nhận" && (
                <Button
                  {...getButtonProps("success")}
                  onClick={handleConfirmPo}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                  Xác nhận đơn hàng
                </Button>
              )}
              {po.status === "Đã xác nhận" && (
                <Button {...getButtonProps("primary")} onClick={handleCreateSo}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Tạo đơn bán hàng
                </Button>
              )}
            </div>
          </div>

          {/* PO Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-gray-50 rounded-lg p-4">
              <Typography variant="small" color="gray" className="mb-1">
                Khách hàng
              </Typography>
              <Typography variant="h6" color="blue-gray">
                {po.companyName || "N/A"}
              </Typography>
              <Typography variant="small" color="gray">
                Mã: {po.companyCode || "N/A"}
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
                Ngày đặt hàng
              </Typography>
              <Typography variant="h6" color="blue-gray">
                {formatDate(po.createdOn) || "N/A"}
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
              description="Đơn đặt hàng này chưa có hàng hóa nào."
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default SupplierPoDetailMarketplace;




