import React from "react";
import { Input, Select, Option, Typography } from "@material-tailwind/react";

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
      <div>
        <Input
          label="Tên kho"
          name="warehouseName"
          color="blue"
          value={warehouse.warehouseName || ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("warehouseName")}
          required
        />
        {errors.warehouseName && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.warehouseName}
          </Typography>
        )}
      </div>

      {/* Sức chứa tối đa */}
      <div>
        <Input
          label="Sức chứa tối đa (m³)"
          name="maxCapacity"
          type="number"
          color="blue"
          value={warehouse.maxCapacity ?? ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("maxCapacity")}
        />
        {errors.maxCapacity && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.maxCapacity}
          </Typography>
        )}
      </div>

      {/* Loại kho */}
      <div>
        <Select
          label="Loại kho"
          value={warehouse.warehouseType || ""}
          color="blue"
          onChange={(val) => handleSelectChange("warehouseType", val)}
          className="w-full placeholder:opacity-100"
          disabled={isFieldReadOnly("warehouseType")}
        >
          <Option value="Nguyên vật liệu">Nguyên vật liệu</Option>
          <Option value="Thành phẩm">Thành phẩm</Option>
          <Option value="Hàng lỗi">Hàng lỗi</Option>
          <Option value="Nhận hàng">Nhận hàng</Option>
          <Option value="Xuất hàng">Xuất hàng</Option>
        </Select>
        {errors.warehouseType && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.warehouseType}
          </Typography>
        )}
      </div>

      {/* Mô tả */}
      <div className="md:col-span-2">
        <Input
          label="Mô tả"
          name="description"
          color="blue"
          value={warehouse.description || ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("description")}
        />
        {errors.description && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.description}
          </Typography>
        )}
      </div>

      {/* Trạng thái */}
      <div>
        <Select
          label="Trạng thái"
          value={warehouse.status || ""}
          color="blue"
          onChange={(val) => handleSelectChange("status", val)}
          className="w-full placeholder:opacity-100"
          disabled={isFieldReadOnly("status")}
        >
          <Option value="Đang sử dụng">Đang sử dụng</Option>
          <Option value="Ngưng sử dụng">Ngừng sử dụng</Option>
        </Select>
        {errors.status && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.status}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default WarehouseForm;
