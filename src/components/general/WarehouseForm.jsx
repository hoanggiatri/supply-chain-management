import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <Select
          value={warehouse.warehouseType || ""}
          onValueChange={(val) => handleSelectChange("warehouseType", val)}
          disabled={isFieldReadOnly("warehouseType")}
        >
          <SelectTrigger
            className={errors.warehouseType ? "border-red-500" : ""}
          >
            <SelectValue placeholder="Chọn loại kho" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Nguyên vật liệu">Nguyên vật liệu</SelectItem>
            <SelectItem value="Thành phẩm">Thành phẩm</SelectItem>
            <SelectItem value="Hàng lỗi">Hàng lỗi</SelectItem>
            <SelectItem value="Nhận hàng">Nhận hàng</SelectItem>
            <SelectItem value="Xuất hàng">Xuất hàng</SelectItem>
          </SelectContent>
        </Select>
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
        <Select
          value={warehouse.status || ""}
          onValueChange={(val) => handleSelectChange("status", val)}
          disabled={isFieldReadOnly("status")}
        >
          <SelectTrigger className={errors.status ? "border-red-500" : ""}>
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Đang sử dụng">Đang sử dụng</SelectItem>
            <SelectItem value="Ngưng sử dụng">Ngừng sử dụng</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-sm text-red-500">{errors.status}</p>
        )}
      </div>
    </div>
  );
};

export default WarehouseForm;
