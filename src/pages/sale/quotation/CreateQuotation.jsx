import LoadingPaper from "@/components/content-components/LoadingPaper";
import FormPageLayout from "@/components/layout/FormPageLayout";
import QuotationDetailTable from "@/components/sale/QuotationDetailTable";
import QuotationForm from "@/components/sale/QuotationForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRfqById, updateRfqStatus } from "@/services/purchasing/RfqService";
import { createQuotation } from "@/services/sale/QuotationService";
import toastrService from "@/services/toastrService";
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CreateQuotation = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = parseInt(localStorage.getItem("companyId"));
  const employeeName = localStorage.getItem("employeeName");
  const { rfqId } = useParams();

  const [rfq, setRfq] = useState(null);
  const [quotation, setQuotation] = useState({
    companyId,
    requestCompanyId: "",
    rfqId,
    taxRate: 0,
    subTotal: 0,
    taxAmount: 0,
    totalAmount: 0,
    createdBy: employeeName,
    status: "Đã báo giá",
  });
  const [quotationDetails, setQuotationDetails] = useState([]);

  useEffect(() => {
    const fetchRfq = async () => {
      try {
        const data = await getRfqById(rfqId, token);
        setRfq(data);
        const details = data.rfqDetails.map((d) => ({
          itemId: d.supplierItemId,
          itemCode: d.supplierItemCode,
          itemName: d.supplierItemName,
          discount: 0,
          quantity: d.quantity,
          note: d.note,
          customerItemId: d.itemId,
          itemPrice: d.supplierItemPrice,
        }));
        setQuotationDetails(details);
      } catch (e) {
        toastrService.error(e.response?.data?.message || "Lỗi khi tải RFQ!");
      }
    };
    fetchRfq();
  }, [rfqId, token]);

  useEffect(() => {
    const subTotal = quotationDetails.reduce(
      (sum, d) => sum + (d.itemPrice * d.quantity - d.discount || 0),
      0
    );
    const taxAmount = (subTotal * quotation.taxRate) / 100;
    const totalAmount = subTotal + taxAmount;
    setQuotation((prev) => ({ ...prev, subTotal, taxAmount, totalAmount }));
  }, [quotation.taxRate, quotationDetails]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    let newValue = value;
    if (type === "number") {
      const num = parseFloat(value);
      if (isNaN(num)) {
        newValue = "";
      } else {
        newValue = num < 0 ? 0 : num;
      }
    }

    setQuotation((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async () => {
    try {
      const request = {
        ...quotation,
        requestCompanyId: rfq.companyId,
        quotationDetails: quotationDetails.map((d) => ({
          itemId: d.itemId,
          discount: d.discount,
          quantity: d.quantity,
          itemPrice: d.itemPrice,
          note: d.note,
          customerItemId: d.customerItemId,
        })),
      };
      await createQuotation(request, token);

      await updateRfqStatus(rfqId, "Đã báo giá", token);

      toastrService.success("Gửi báo giá thành công!");
      navigate("/supplier-rfqs");
    } catch (e) {
      console.error(e);
      toastrService.error(e.response?.data?.message || "Lỗi khi gửi báo giá!");
    }
  };

  if (!rfq) return <LoadingPaper title="TẠO BÁO GIÁ" />;

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Yêu cầu báo giá", path: "/supplier-rfqs" },
        { label: "Tạo báo giá" },
      ]}
      backLink="/supplier-rfqs"
      backLabel="Quay lại danh sách"
    >
      <QuotationForm rfq={rfq} quotation={quotation} />

      <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
        Danh sách hàng hóa báo giá
      </h2>

      <QuotationDetailTable
        quotationDetails={quotationDetails}
        setQuotationDetails={setQuotationDetails}
      />

      {/* Summary */}
      <div className="mt-6 flex justify-end">
        <div className="w-full max-w-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Tổng tiền hàng (VNĐ):</span>
            <span className="font-semibold text-gray-900">
              {quotation.subTotal.toLocaleString("vi-VN")}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Thuế (%):</span>
            <Input
              type="number"
              name="taxRate"
              value={quotation.taxRate}
              onChange={handleChange}
              className="w-24 text-right"
              min={0}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Tiền thuế (VNĐ):</span>
            <span className="font-semibold text-gray-900">
              {quotation.taxAmount.toLocaleString("vi-VN")}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Tổng cộng (VNĐ):</span>
            <span className="font-bold text-gray-900 text-lg">
              {quotation.totalAmount.toLocaleString("vi-VN")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Hủy
        </Button>
        <Button
          type="button"
          variant="default"
          onClick={handleSubmit}
          className="gap-2 bg-blue-600 hover:bg-blue-700 min-w-[140px]"
        >
          <Save className="w-4 h-4" />
          Gửi báo giá
        </Button>
      </div>
    </FormPageLayout>
  );
};

export default CreateQuotation;
