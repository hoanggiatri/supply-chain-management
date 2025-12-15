import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dayjs from "dayjs";

const SupplierPoForm = ({ po }) => {
  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    return dayjs(isoString).format("DD/MM/YYYY HH:mm");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Mã đơn mua hàng */}
      <div className="space-y-2">
        <Label>Mã đơn mua hàng</Label>
        <Input
          value={po.poCode || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Mã báo giá */}
      <div className="space-y-2">
        <Label>Mã báo giá</Label>
        <Input
          value={po?.quotationCode || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Mã khách hàng */}
      <div className="space-y-2">
        <Label>Mã khách hàng</Label>
        <Input
          value={po?.companyCode || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Tên khách hàng */}
      <div className="space-y-2">
        <Label>Tên khách hàng</Label>
        <Input
          value={po?.companyName || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Ngày đặt hàng */}
      <div className="space-y-2">
        <Label>Ngày đặt hàng</Label>
        <Input
          value={formatDateTime(po.createdOn || new Date().toISOString())}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Phương thức thanh toán */}
      <div className="space-y-2">
        <Label>Phương thức thanh toán</Label>
        <Input
          value={po.paymentMethod || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Địa chỉ giao hàng */}
      <div className="space-y-2">
        <Label>Địa chỉ giao hàng</Label>
        <Input
          value={po.deliveryToAddress || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Trạng thái */}
      <div className="space-y-2">
        <Label>Trạng thái</Label>
        <Input
          value={po.status || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>
    </div>
  );
};

export default SupplierPoForm;
