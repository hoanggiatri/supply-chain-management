import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SoForm = ({ po = {}, so = {}, setSo }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSo?.((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Mã đơn bán hàng */}
      <div className="space-y-2">
        <Label>Mã đơn bán hàng</Label>
        <Input
          value={so.soCode || ""}
          placeholder="Mã đơn bán hàng được tạo tự động"
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Mã đơn mua hàng */}
      <div className="space-y-2">
        <Label>Mã đơn mua hàng</Label>
        <Input
          value={po.poCode || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Mã công ty khách hàng */}
      <div className="space-y-2">
        <Label>Mã công ty khách hàng</Label>
        <Input
          value={po.companyCode || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Tên công ty khách hàng */}
      <div className="space-y-2">
        <Label>Tên công ty khách hàng</Label>
        <Input
          value={po.companyName || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Địa chỉ lấy hàng */}
      <div className="space-y-2">
        <Label>Địa chỉ lấy hàng</Label>
        <Input
          name="deliveryFromAddress"
          value={so.deliveryFromAddress || ""}
          onChange={handleChange}
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

      {/* Phương thức thanh toán */}
      <div className="space-y-2">
        <Label>Phương thức thanh toán</Label>
        <Input
          value={po.paymentMethod || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Trạng thái */}
      <div className="space-y-2">
        <Label>Trạng thái</Label>
        <Input
          value={so.status || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>
    </div>
  );
};

export default SoForm;
