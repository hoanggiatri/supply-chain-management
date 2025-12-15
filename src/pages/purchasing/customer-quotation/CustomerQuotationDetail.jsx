import LoadingPaper from "@/components/content-components/LoadingPaper";
import FormPageLayout from "@/components/layout/FormPageLayout";
import CustomerQuotationForm from "@/components/sale/CustomerQuotationForm";
import { Button } from "@/components/ui/button";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { updateRfqStatus } from "@/services/purchasing/RfqService";
import {
    getQuotationByRfq,
    updateQuotationStatus,
} from "@/services/sale/QuotationService";
import toastrService from "@/services/toastrService";
import { Check, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CustomerQuotationDetail = () => {
  const { rfqId } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [quotation, setQuotation] = useState(null);
  const [quotationDetails, setQuotationDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getQuotationByRfq(rfqId, token);
        setQuotation(data);
        setQuotationDetails(data.quotationDetails || []);
      } catch (e) {
        toastrService.error(
          e.response?.data?.message || "Không thể tải báo giá!"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [rfqId, token]);

  const columns = [
    {
      accessorKey: "itemCode",
      header: createSortableHeader("Mã hàng hóa"),
      cell: ({ getValue }) => {
        const code = getValue();
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {code}
          </span>
        );
      },
    },
    {
      accessorKey: "itemName",
      header: createSortableHeader("Tên hàng hóa"),
    },
    {
      accessorKey: "quantity",
      header: createSortableHeader("Số lượng"),
    },
    {
      accessorKey: "note",
      header: createSortableHeader("Ghi chú"),
    },
    {
      accessorKey: "itemPrice",
      header: createSortableHeader("Đơn giá (VNĐ)"),
      cell: ({ getValue }) => getValue()?.toLocaleString("vi-VN") || "0",
    },
    {
      accessorKey: "discount",
      header: createSortableHeader("Chiết khấu"),
      cell: ({ getValue }) => getValue()?.toLocaleString("vi-VN") || "0",
    },
    {
      id: "total",
      header: () => <span className="font-medium">Thành tiền</span>,
      cell: ({ row }) => {
        const price = row.original.itemPrice || 0;
        const qty = row.original.quantity || 0;
        const discount = row.original.discount || 0;
        const total = price * qty - discount;
        return (
          <span className="font-semibold">
            {total.toLocaleString("vi-VN")}
          </span>
        );
      },
    },
  ];

  const handleDecline = async () => {
    const result = await toastrService.confirm(
      "Bạn có chắc chắn muốn từ chối báo giá này không?"
    );
    if (!result.isConfirmed) return;

    try {
      await updateQuotationStatus(quotation.quotationId, "Đã từ chối", token);
      toastrService.success("Đã từ chối!");

      await updateRfqStatus(rfqId, "Đã từ chối", token);

      setQuotation((prev) => ({
        ...prev,
        status: "Đã từ chối",
      }));
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi khi từ chối báo giá!"
      );
    }
  };

  const handleAccept = async () => {
    const result = await toastrService.confirm(
      "Bạn có chắc chắn muốn chấp nhận báo giá này không?"
    );
    if (!result.isConfirmed) return;

    try {
      await updateQuotationStatus(quotation.quotationId, "Đã chấp nhận", token);
      toastrService.success("Đã chấp nhận!");

      await updateRfqStatus(rfqId, "Đã chấp nhận", token);

      setQuotation((prev) => ({
        ...prev,
        status: "Đã chấp nhận",
      }));
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi khi chấp nhận báo giá!"
      );
    }
  };

  if (!quotation) return <LoadingPaper title="THÔNG TIN BÁO GIÁ" />;

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Báo giá nhận được", path: "/customer-quotations" },
        { label: "Chi tiết" },
      ]}
      backLink="/customer-quotations"
      backLabel="Quay lại danh sách"
    >
      {/* Action buttons */}
      <div className="flex justify-end gap-3 mb-6">
        {quotation.status === "Đã báo giá" && (
          <>
            <Button
              variant="default"
              onClick={handleAccept}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4" />
              Chấp nhận
            </Button>
            <Button
              variant="destructive"
              onClick={handleDecline}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Từ chối
            </Button>
          </>
        )}
        {quotation.status === "Đã chấp nhận" && (
          <Button
            variant="default"
            onClick={() => navigate(`/create-po/${quotation.quotationId}`)}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <ShoppingCart className="w-4 h-4" />
            Mua hàng
          </Button>
        )}
      </div>

      <CustomerQuotationForm quotation={quotation} />

      <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
        Danh sách hàng hóa báo giá
      </h2>

      <DataTable
        columns={columns}
        data={quotationDetails}
        loading={loading}
      />

      {/* Summary */}
      <div className="mt-6 flex justify-end">
        <div className="w-full max-w-sm space-y-2">
          {[
            {
              label: "Tổng tiền hàng (VNĐ):",
              value: quotation.subTotal?.toLocaleString("vi-VN"),
            },
            { label: "Thuế (%):", value: quotation.taxRate },
            {
              label: "Tiền thuế (VNĐ):",
              value: quotation.taxAmount?.toLocaleString("vi-VN"),
            },
            {
              label: "Tổng cộng (VNĐ):",
              value: quotation.totalAmount?.toLocaleString("vi-VN"),
            },
          ].map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className="font-medium text-gray-700">{item.label}</span>
              <span className="font-semibold text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </FormPageLayout>
  );
};

export default CustomerQuotationDetail;
