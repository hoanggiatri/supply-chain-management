import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getAllWarehousesInCompany } from "@/services/general/WarehouseService";
import toastrService from "@/services/toastrService";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const PoForm = ({ quotation, po = {}, setPo, errors = {}, readOnlyFields }) => {
  const [warehouses, setWarehouses] = useState([]);
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  const isFieldReadOnly = (field) => readOnlyFields?.[field] ?? false;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const warehousesData = await getAllWarehousesInCompany(
          companyId,
          token
        );
        setWarehouses(warehousesData);
      } catch (error) {
        toastrService.error(
          error?.response?.data?.message || "Có lỗi khi tải dữ liệu!"
        );
      }
    };
    fetchData();
  }, [companyId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPo((prev) => ({ ...prev, [name]: value }));
  };

  const handleWarehouseChange = (value) => {
    const selectedWarehouse = warehouses.find(
      (warehouse) => String(warehouse.warehouseId) === String(value)
    );
    setPo((prev) => ({
      ...prev,
      receiveWarehouseCode: selectedWarehouse?.warehouseCode || "",
      receiveWarehouseId: selectedWarehouse?.warehouseId || "",
      receiveWarehouseName: selectedWarehouse?.warehouseName || "",
    }));
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    return dayjs(isoString).format("DD/MM/YYYY HH:mm");
  };

  const warehouseOptions = warehouses.map((wh) => ({
    label: wh.warehouseCode + " - " + wh.warehouseName,
    value: String(wh.warehouseId),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Mã đơn mua hàng */}
      <div className="space-y-2">
        <Label>Mã đơn mua hàng</Label>
        <Input
          value={po?.poCode || ""}
          placeholder="Mã đơn mua hàng được tạo tự động"
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Mã báo giá */}
      <div className="space-y-2">
        <Label>Mã báo giá</Label>
        <Input
          value={quotation?.quotationCode || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Mã công ty cung cấp */}
      <div className="space-y-2">
        <Label>Mã công ty cung cấp</Label>
        <Input
          value={quotation?.companyCode || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Tên công ty cung cấp */}
      <div className="space-y-2">
        <Label>Tên công ty cung cấp</Label>
        <Input
          value={quotation?.companyName || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Ngày đặt hàng */}
      <div className="space-y-2">
        <Label>Ngày đặt hàng</Label>
        <Input
          value={formatDateTime(po?.createdOn || new Date().toISOString())}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Phương thức thanh toán */}
      <div className="space-y-2">
        <Label>
          Phương thức thanh toán <span className="text-red-500">*</span>
        </Label>
        {isFieldReadOnly("paymentMethod") ? (
          <Input
            value={po?.paymentMethod || ""}
            readOnly
            className="bg-gray-50"
          />
        ) : (
          <Select
            value={po?.paymentMethod || ""}
            onValueChange={(val) =>
              setPo((prev) => ({ ...prev, paymentMethod: val }))
            }
          >
            <SelectTrigger className={errors.paymentMethod ? "border-red-500" : ""}>
              <SelectValue placeholder="Chọn phương thức" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ghi công nợ">Ghi công nợ</SelectItem>
              <SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem>
              <SelectItem value="Tiền mặt">Tiền mặt</SelectItem>
            </SelectContent>
          </Select>
        )}
        {errors.paymentMethod && (
          <p className="text-sm text-red-500">{errors.paymentMethod}</p>
        )}
      </div>

      {/* Kho nhận hàng */}
      <div className="space-y-2">
        <Label>
          Kho nhận hàng <span className="text-red-500">*</span>
        </Label>
        {isFieldReadOnly("receiveWarehouseId") ? (
          <Input
            value={
              po?.receiveWarehouseCode
                ? `${po.receiveWarehouseCode} - ${po.receiveWarehouseName}`
                : ""
            }
            readOnly
            className="bg-gray-50"
          />
        ) : (
          <Combobox
            options={warehouseOptions}
            value={String(po?.receiveWarehouseId || "")}
            onValueChange={handleWarehouseChange}
            placeholder="Chọn kho"
            searchPlaceholder="Tìm kho..."
            emptyText="Không tìm thấy kho"
            className={errors.receiveWarehouseId ? "border-red-500" : ""}
          />
        )}
        {errors.receiveWarehouseId && (
          <p className="text-sm text-red-500">{errors.receiveWarehouseId}</p>
        )}
      </div>

      {/* Địa chỉ giao hàng */}
      <div className="space-y-2">
        <Label>Địa chỉ giao hàng</Label>
        <Input
          name="deliveryToAddress"
          value={po?.deliveryToAddress || ""}
          onChange={handleChange}
          readOnly={isFieldReadOnly("deliveryToAddress")}
          className={isFieldReadOnly("deliveryToAddress") ? "bg-gray-50" : ""}
          error={!!errors.deliveryToAddress}
        />
        {errors.deliveryToAddress && (
          <p className="text-sm text-red-500">{errors.deliveryToAddress}</p>
        )}
      </div>

      {/* Trạng thái */}
      <div className="space-y-2">
        <Label>Trạng thái</Label>
        <Input
          value={po?.status || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>
    </div>
  );
};

export default PoForm;
