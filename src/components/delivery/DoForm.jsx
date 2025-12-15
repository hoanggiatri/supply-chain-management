import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DoForm = ({ deliveryOrder }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Mã đơn vận chuyển */}
      <div className="space-y-2">
        <Label>Mã đơn vận chuyển</Label>
        <Input
          value={deliveryOrder?.doCode || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Mã đơn bán hàng */}
      <div className="space-y-2">
        <Label>Mã đơn bán hàng</Label>
        <Input
          value={deliveryOrder?.soCode || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Địa chỉ lấy hàng */}
      <div className="space-y-2">
        <Label>Địa chỉ lấy hàng</Label>
        <Input
          value={deliveryOrder?.deliveryFromAddress || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Địa chỉ giao hàng */}
      <div className="space-y-2">
        <Label>Địa chỉ giao hàng</Label>
        <Input
          value={deliveryOrder?.deliveryToAddress || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Trạng thái */}
      <div className="space-y-2">
        <Label>Trạng thái</Label>
        <Input
          value={deliveryOrder?.status || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>
    </div>
  );
};

export default DoForm;
