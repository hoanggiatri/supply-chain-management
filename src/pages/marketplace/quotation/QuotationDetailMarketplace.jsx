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
import { getQuotationByRfq } from "@/services/sale/QuotationService";
import { getRfqById } from "@/services/purchasing/RfqService";
import toastrService from "@/services/toastrService";
import { getButtonProps } from "@/utils/buttonStyles";

const QuotationDetailMarketplace = () => {
  const { rfqId } = useParams();
  const navigate = useNavigate();
  const [rfq, setRfq] = useState(null);
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const rfqData = await getRfqById(rfqId, token);
        setRfq(rfqData);
        const quotationData = await getQuotationByRfq(rfqId, token);
        setQuotation(quotationData);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Không thể tải thông tin báo giá!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [rfqId, token]);

  // Navigate to view RFQ
  const handleViewRfq = useCallback(() => {
    navigate(`/marketplace/supplier-rfq/${rfqId}`);
  }, [navigate, rfqId]);

  // Navigate back
  const handleBack = useCallback(() => {
    navigate("/marketplace/quotations");
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
  if (!quotation) {
    return (
      <div className="p-6">
        <EmptyState
          title="Không tìm thấy báo giá"
          description="Báo giá này không tồn tại hoặc đã bị xóa."
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
                {quotation.quotationCode}
              </Typography>
              <Chip
                value={quotation.status}
                color={getStatusColor(quotation.status)}
                className="shadow-md"
              />
            </div>

            <div className="flex gap-2">
              <Button {...getButtonProps("info")} onClick={handleViewRfq}>
                Xem yêu cầu báo giá
              </Button>
            </div>
          </div>

          {/* Quotation Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-gray-50 rounded-lg p-4">
              <Typography variant="small" color="gray" className="mb-1">
                Mã yêu cầu báo giá
              </Typography>
              <Typography variant="h6" color="blue-gray">
                {rfq?.rfqCode || "N/A"}
              </Typography>
            </div>

            <div className="bg-blue-gray-50 rounded-lg p-4">
              <Typography variant="small" color="gray" className="mb-1">
                Người báo giá
              </Typography>
              <Typography variant="h6" color="blue-gray">
                {quotation.createdBy || "N/A"}
              </Typography>
              <Typography variant="small" color="gray">
                {formatDate(quotation.createdOn)}
              </Typography>
            </div>

            <div className="bg-blue-gray-50 rounded-lg p-4">
              <Typography variant="small" color="gray" className="mb-1">
                Thuế
              </Typography>
              <Typography variant="h6" color="blue-gray">
                {quotation.taxRate}%
              </Typography>
              <Typography variant="small" color="gray">
                {formatCurrency(quotation.taxAmount)}
              </Typography>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <Typography
                variant="small"
                color="blue"
                className="mb-1 font-medium"
              >
                Tổng cộng
              </Typography>
              <Typography variant="h5" color="blue" className="font-bold">
                {formatCurrency(quotation.totalAmount)}
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Items Card */}
      <Card className="shadow-lg">
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="font-bold mb-6">
            DANH SÁCH HÀNG HÓA BÁO GIÁ
            <span className="text-gray-500 font-normal ml-2">
              ({quotation.quotationDetails?.length || 0} sản phẩm)
            </span>
          </Typography>

          {/* Items Grid */}
          {quotation.quotationDetails?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {quotation.quotationDetails.map((detail, index) => (
                <ItemCard
                  key={detail.quotationDetailId || index}
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
              description="Báo giá này chưa có hàng hóa nào."
            />
          )}

          {/* Summary */}
          {quotation.quotationDetails?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-blue-gray-100">
              <div className="flex flex-col items-end gap-2">
                <div className="flex justify-between w-full max-w-xs">
                  <Typography color="gray">Tổng tiền hàng:</Typography>
                  <Typography color="blue-gray" className="font-medium">
                    {formatCurrency(quotation.subTotal)}
                  </Typography>
                </div>
                <div className="flex justify-between w-full max-w-xs">
                  <Typography color="gray">
                    Thuế ({quotation.taxRate}%):
                  </Typography>
                  <Typography color="blue-gray" className="font-medium">
                    {formatCurrency(quotation.taxAmount)}
                  </Typography>
                </div>
                <div className="flex justify-between w-full max-w-xs pt-2 border-t border-blue-gray-100">
                  <Typography color="blue" className="font-bold">
                    Tổng cộng:
                  </Typography>
                  <Typography color="blue" className="font-bold text-lg">
                    {formatCurrency(quotation.totalAmount)}
                  </Typography>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default QuotationDetailMarketplace;




