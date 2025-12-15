import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dayjs from "dayjs";

const CustomerQuotationForm = ({ quotation }) => {
  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    return dayjs(isoString).format("DD/MM/YYYY HH:mm");
  };

  const statusLabels = {
    "Đã báo giá": "Đã báo giá",
    "Đã từ chối": "Đã từ chối",
    "Đã chấp nhận": "Đã chấp nhận",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Mã yêu cầu báo giá */}
      <div className="space-y-2">
        <Label>Mã yêu cầu báo giá</Label>
        <Input
          value={quotation?.rfqCode || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Ngày báo giá */}
      <div className="space-y-2">
        <Label>Ngày báo giá</Label>
        <Input
          value={formatDateTime(quotation?.createdOn)}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Mã công ty báo giá */}
      <div className="space-y-2">
        <Label>Mã công ty báo giá</Label>
        <Input
          value={quotation?.companyCode || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Tên công ty báo giá */}
      <div className="space-y-2">
        <Label>Tên công ty báo giá</Label>
        <Input
          value={quotation?.companyName || ""}
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

export default CustomerQuotationForm;
