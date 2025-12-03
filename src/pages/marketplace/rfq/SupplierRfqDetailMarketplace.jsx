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
import { getRfqById } from "@/services/purchasing/RfqService";
import toastrService from "@/services/toastrService";
import { getButtonProps } from "@/utils/buttonStyles";

const SupplierRfqDetailMarketplace = () => {
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

  // Navigate to create quotation
  const handleCreateQuotation = useCallback(() => {
    navigate(`/create-quotation/${rfqId}`);
  }, [navigate, rfqId]);

  // Navigate back
  const handleBack = useCallback(() => {
    navigate("/marketplace/supplier-rfqs");
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
                <Button
                  {...getButtonProps("success")}
                  onClick={handleCreateQuotation}
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
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                    />
                  </svg>
                  Báo giá
                </Button>
              )}
            </div>
          </div>

          {/* RFQ Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-gray-50 rounded-lg p-4">
              <Typography variant="small" color="gray" className="mb-1">
                Công ty yêu cầu
              </Typography>
              <Typography variant="h6" color="blue-gray">
                {rfq.companyName || "N/A"}
              </Typography>
              <Typography variant="small" color="gray">
                Mã: {rfq.companyCode || "N/A"}
              </Typography>
            </div>

            <div className="bg-amber-50 rounded-lg p-4">
              <Typography
                variant="small"
                color="amber"
                className="mb-1 font-medium"
              >
                Hạn báo giá
              </Typography>
              <Typography variant="h6" color="amber" className="font-bold">
                {formatDate(rfq.needByDate) || "N/A"}
              </Typography>
            </div>

            <div className="bg-blue-gray-50 rounded-lg p-4">
              <Typography variant="small" color="gray" className="mb-1">
                Ngày yêu cầu
              </Typography>
              <Typography variant="h6" color="blue-gray">
                {formatDate(rfq.createdOn) || "N/A"}
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Items Card */}
      <Card className="shadow-lg">
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="font-bold mb-6">
            DANH SÁCH HÀNG HÓA CẦN BÁO GIÁ
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

export default SupplierRfqDetailMarketplace;




