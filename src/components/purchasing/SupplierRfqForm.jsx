import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dayjs from "dayjs";

const SupplierRfqForm = ({ rfq }) => {
  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    return dayjs(isoString).format("DD/MM/YYYY HH:mm");
  };

  const statusLabels = {
    "Chưa báo giá": "Chưa báo giá",
    "Đã báo giá": "Đã báo giá",
    "Đã hủy": "Đã hủy",
    "Đã từ chối": "Đã từ chối",
    "Đã chấp nhận": "Đã chấp nhận",
    "Quá hạn báo giá": "Quá hạn báo giá",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Mã yêu cầu */}
      <div className="space-y-2">
        <Label>Mã yêu cầu</Label>
        <Input
          value={rfq.rfqCode || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Hạn báo giá */}
      <div className="space-y-2">
        <Label>Hạn báo giá</Label>
        <Input
          value={formatDateTime(rfq.needByDate)}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Mã công ty yêu cầu */}
      <div className="space-y-2">
        <Label>Mã công ty yêu cầu</Label>
        <Input
          value={rfq.companyCode || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Tên công ty yêu cầu */}
      <div className="space-y-2">
        <Label>Tên công ty yêu cầu</Label>
        <Input
          value={rfq.companyName || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Trạng thái */}
      <div className="space-y-2">
        <Label>Trạng thái</Label>
        <Input
          value={statusLabels[rfq.status] || rfq.status || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>
    </div>
  );
};

export default SupplierRfqForm;
