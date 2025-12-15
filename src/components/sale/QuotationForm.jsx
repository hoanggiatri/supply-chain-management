import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const QuotationForm = ({ rfq, quotation }) => {
  const statusLabels = {
    "Đã báo giá": "Đã báo giá",
    "Đã từ chối": "Đã từ chối",
    "Đã chấp nhận": "Đã chấp nhận",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Mã báo giá */}
      <div className="space-y-2">
        <Label>Mã báo giá</Label>
        <Input
          value={quotation?.quotationCode || ""}
          placeholder="Mã báo giá được tạo tự động"
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Mã yêu cầu báo giá */}
      <div className="space-y-2">
        <Label>Mã yêu cầu báo giá</Label>
        <Input
          value={rfq?.rfqCode || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Mã công ty yêu cầu */}
      <div className="space-y-2">
        <Label>Mã công ty yêu cầu</Label>
        <Input
          value={rfq?.companyCode || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Tên công ty yêu cầu */}
      <div className="space-y-2">
        <Label>Tên công ty yêu cầu</Label>
        <Input
          value={rfq?.companyName || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Trạng thái */}
      <div className="space-y-2">
        <Label>Trạng thái</Label>
        <Input
          value={statusLabels[quotation?.status] || quotation?.status || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>
    </div>
  );
};

export default QuotationForm;
