import React from "react";
import {
  Input,
  Select,
  Option,
  Typography,
  Checkbox,
} from "@material-tailwind/react";

const ItemForm = ({ item, onChange, errors = {}, readOnlyFields }) => {
  const isFieldReadOnly = (field) => readOnlyFields?.[field] ?? false;

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
      {/* Mã hàng hóa */}
      <div>
        <Input
          label="Mã hàng hóa"
          name="itemCode"
          color="blue"
          value={item.itemCode || ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("itemCode")}
          required
        />
        {errors.itemCode && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.itemCode}
          </Typography>
        )}
      </div>

      {/* Tên hàng hóa */}
      <div>
        <Input
          label="Tên hàng hóa"
          name="itemName"
          color="blue"
          value={item.itemName || ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("itemName")}
          required
        />
        {errors.itemName && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.itemName}
          </Typography>
        )}
      </div>

      {/* Loại hàng hóa */}
      <div>
        <Select
          label="Loại hàng hóa"
          value={item.itemType || ""}
          color="blue"
          onChange={(val) => handleSelectChange("itemType", val)}
          className="w-full placeholder:opacity-100"
          disabled={isFieldReadOnly("itemType")}
        >
          <Option value="Nguyên vật liệu">Nguyên vật liệu</Option>
          <Option value="Thành phẩm">Thành phẩm</Option>
          <Option value="Bán thành phẩm">Bán thành phẩm</Option>
        </Select>
        {errors.itemType && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.itemType}
          </Typography>
        )}
      </div>

      {/* Đơn vị tính */}
      <div>
        <Input
          label="Đơn vị tính"
          name="uom"
          color="blue"
          value={item.uom || ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("uom")}
          required
        />
        {errors.uom && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.uom}
          </Typography>
        )}
      </div>

      {/* Giá nhập */}
      <div>
        <Input
          label="Giá nhập"
          name="importPrice"
          type="number"
          color="blue"
          value={item.importPrice ?? ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("importPrice")}
        />
        {errors.importPrice && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.importPrice}
          </Typography>
        )}
      </div>

      {/* Giá xuất */}
      <div>
        <Input
          label="Giá xuất"
          name="exportPrice"
          type="number"
          color="blue"
          value={item.exportPrice ?? ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("exportPrice")}
        />
        {errors.exportPrice && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.exportPrice}
          </Typography>
        )}
      </div>

      {/* Thông số kỹ thuật */}
      <div>
        <Input
          label="Thông số kỹ thuật"
          name="technicalSpecifications"
          color="blue"
          value={item.technicalSpecifications || ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("technicalSpecifications")}
        />
        {errors.technicalSpecifications && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.technicalSpecifications}
          </Typography>
        )}
      </div>

      {/* Mô tả */}
      <div>
        <Input
          label="Mô tả"
          name="description"
          color="blue"
          value={item.description || ""}
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

      {/* Hàng bán */}
      <div>
        <div className="flex items-center gap-2">
          <Checkbox
            crossOrigin={undefined}
            color="blue"
            checked={!!item.isSellable}
            onChange={(e) =>
              onChange({
                target: {
                  name: "isSellable",
                  value: e.target.checked,
                },
              })
            }
            disabled={readOnlyFields?.isSellable}
          />
          <Typography className="text-sm font-medium text-blue-gray-700">
            Hàng bán
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ItemForm;
