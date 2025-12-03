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
  getStatusColor,
} from "@/components/marketplace";
import { getRfqById, updateRfqStatus } from "@/services/purchasing/RfqService";
import toastrService from "@/services/toastrService";
import { getButtonProps } from "@/utils/buttonStyles";

const RfqDetailMarketplace = () => {
  const { rfqId } = useParams();
  const navigate = useNavigate();
  const [rfq, setRfq] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch RFQ
  useEffect(() => {
    const fetchRfq = async () => {
      setLoading(true);
      try {
        const data = await getRfqById(rfqId, token);
        setRfq(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Lỗi khi tải yêu cầu báo giá!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRfq();
  }, [rfqId, token]);

  // Handle cancel RFQ
  const handleCancel = useCallback(async () => {
    const result = await toastrService.confirm(
      "Bạn có chắc chắn muốn hủy yêu cầu báo giá này không?"
    );
    if (!result.isConfirmed) return;

    try {
      await updateRfqStatus(rfq.rfqId, "Đã hủy", token);
      toastrService.success("Đã hủy yêu cầu báo giá!");
      setRfq((prev) => ({ ...prev, status: "Đã hủy" }));
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi khi hủy yêu cầu báo giá!"
      );
    }
  }, [rfq, token]);

  // Navigate to view quotation
  const handleViewQuotation = useCallback(() => {
    navigate(`/marketplace/customer-quotation/${rfq.rfqId}`);
  }, [navigate, rfq]);

  // Navigate back
  const handleBack = useCallback(() => {
    navigate("/marketplace/rfqs");
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
  if (!rfq) {
    return (
      <div className="p-6">
        <EmptyState
          title="Không tìm thấy yêu cầu báo giá"
          description="Yêu cầu báo giá này không tồn tại hoặc đã bị xóa."
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
                {rfq.rfqCode}
              </Typography>
              <Chip
                value={rfq.status}
                color={getStatusColor(rfq.status)}
                className="shadow-md"
              />
            </div>

            <div className="flex gap-2">
              {rfq.status === "Chưa báo giá" && (
                <Button {...getButtonProps("danger")} onClick={handleCancel}>
                  Hủy yêu cầu
                </Button>
              )}
              {rfq.status === "Đã báo giá" && (
                <Button
                  {...getButtonProps("primary")}
                  onClick={handleViewQuotation}
                >
                  Xem báo giá
                </Button>
              )}
            </div>
          </div>

          {/* RFQ Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-gray-50 rounded-lg p-4">
              <Typography variant="small" color="gray" className="mb-1">
                Công ty báo giá
              </Typography>
              <Typography variant="h6" color="blue-gray">
                {rfq.requestedCompanyName || "N/A"}
              </Typography>
              <Typography variant="small" color="gray">
                Mã: {rfq.requestedCompanyCode || "N/A"}
              </Typography>
            </div>

            <div className="bg-blue-gray-50 rounded-lg p-4">
              <Typography variant="small" color="gray" className="mb-1">
                Hạn báo giá
              </Typography>
              <Typography variant="h6" color="blue-gray">
                {formatDate(rfq.needByDate) || "N/A"}
              </Typography>
            </div>

            <div className="bg-blue-gray-50 rounded-lg p-4">
              <Typography variant="small" color="gray" className="mb-1">
                Người tạo
              </Typography>
              <Typography variant="h6" color="blue-gray">
                {rfq.createdBy || "N/A"}
              </Typography>
              <Typography variant="small" color="gray">
                {formatDate(rfq.createdOn)}
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Items Card */}
      <Card className="shadow-lg">
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="font-bold mb-6">
            DANH SÁCH HÀNG HÓA YÊU CẦU BÁO GIÁ
            <span className="text-gray-500 font-normal ml-2">
              ({rfq.rfqDetails?.length || 0} sản phẩm)
            </span>
          </Typography>

          {/* Items Grid */}
          {rfq.rfqDetails?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rfq.rfqDetails.map((detail, index) => (
                <ItemCard
                  key={detail.rfqDetailId || index}
                  itemCode={detail.itemCode}
                  itemName={detail.itemName}
                  imageUrl={detail.imageUrl || detail.itemImageUrl}
                  quantity={detail.quantity}
                  supplierItemCode={detail.supplierItemCode}
                  supplierItemName={detail.supplierItemName}
                  note={detail.note}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Không có hàng hóa"
              description="Yêu cầu báo giá này chưa có hàng hóa nào."
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default RfqDetailMarketplace;

