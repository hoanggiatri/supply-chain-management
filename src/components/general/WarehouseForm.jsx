import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const WAREHOUSE_TYPE_OPTIONS = [
  { value: "Nguyên vật liệu", label: "Nguyên vật liệu" },
  { value: "Thành phẩm", label: "Thành phẩm" },
  { value: "Hàng lỗi", label: "Hàng lỗi" },
  { value: "Nhận hàng", label: "Nhận hàng" },
  { value: "Xuất hàng", label: "Xuất hàng" },
];

const WAREHOUSE_STATUS_OPTIONS = [
  { value: "Đang sử dụng", label: "Đang sử dụng" },
  { value: "Ngưng sử dụng", label: "Ngưng sử dụng" },
];

const WarehouseForm = ({ warehouse, onChange, errors, readOnlyFields }) => {
  const isFieldReadOnly = (field) => readOnlyFields[field] ?? false;

  const handleSelectChange = (name, value) => {
    onChange({
      target: {
        name,
        value,
      },
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Tên kho */}
      <div className="space-y-2">
        <Label htmlFor="warehouseName">
          Tên kho <span className="text-red-500">*</span>
        </Label>
        <Input
          id="warehouseName"
          name="warehouseName"
          value={warehouse.warehouseName || ""}
          onChange={onChange}
          readOnly={isFieldReadOnly("warehouseName")}
          className={errors.warehouseName ? "border-red-500" : ""}
          placeholder="Nhập tên kho"
        />
        {errors.warehouseName && (
          <p className="text-sm text-red-500">{errors.warehouseName}</p>
        )}
      </div>

      {/* Sức chứa tối đa */}
      <div className="space-y-2">
        <Label htmlFor="maxCapacity">Sức chứa tối đa (m³)</Label>
        <Input
          id="maxCapacity"
          name="maxCapacity"
          type="number"
          value={warehouse.maxCapacity ?? ""}
          onChange={onChange}
          readOnly={isFieldReadOnly("maxCapacity")}
          className={errors.maxCapacity ? "border-red-500" : ""}
          placeholder="Nhập sức chứa tối đa"
        />
        {errors.maxCapacity && (
          <p className="text-sm text-red-500">{errors.maxCapacity}</p>
        )}
      </div>

      {/* Loại kho */}
      <div className="space-y-2">
        <Label htmlFor="warehouseType">Loại kho</Label>
        <Combobox
          options={WAREHOUSE_TYPE_OPTIONS}
          value={warehouse.warehouseType}
          onChange={(option) => handleSelectChange("warehouseType", option?.value)}
          placeholder="Chọn loại kho"
          searchPlaceholder="Tìm loại kho..."
          emptyText="Không tìm thấy loại kho"
          disabled={isFieldReadOnly("warehouseType")}
          className={errors.warehouseType ? "border-red-500" : ""}
        />
        {errors.warehouseType && (
          <p className="text-sm text-red-500">{errors.warehouseType}</p>
        )}
      </div>

      {/* Mô tả */}
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          name="description"
          value={warehouse.description || ""}
          onChange={onChange}
          readOnly={isFieldReadOnly("description")}
          className={errors.description ? "border-red-500" : ""}
          placeholder="Nhập mô tả"
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Trạng thái */}
      <div className="space-y-2">
        <Label htmlFor="status">Trạng thái</Label>
        <Combobox
          options={WAREHOUSE_STATUS_OPTIONS}
          value={warehouse.status}
          onChange={(option) => handleSelectChange("status", option?.value)}
          placeholder="Chọn trạng thái"
          searchPlaceholder="Tìm trạng thái..."
          emptyText="Không tìm thấy trạng thái"
          disabled={isFieldReadOnly("status")}
          className={`${errors.status ? "border-red-500" : ""} ${isFieldReadOnly("status") ? "bg-gray-50" : ""}`}
        />
        {errors.status && (
          <p className="text-sm text-red-500">{errors.status}</p>
        )}
      </div>
    </div>
  );
};

export default WarehouseForm;
