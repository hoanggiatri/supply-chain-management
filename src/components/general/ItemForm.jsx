import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const ItemForm = ({
  item,
  onChange,
  errors = {},
  readOnlyFields,
  hiddenFields,
}) => {
  const isFieldReadOnly = (field) => readOnlyFields?.[field] ?? false;
  const isFieldHidden = (field) => hiddenFields?.[field] ?? false;

  const handleSelectChange = (name, value) => {
    onChange({
      target: {
        name,
        value,
      },
    });
  };

  return (
    <div className="space-y-5">
      {/* Group 1: Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!isFieldHidden("itemCode") && (
          <div className="space-y-2">
            <Label htmlFor="itemCode">
              Mã hàng hóa <span className="text-red-500">*</span>
            </Label>
            <Input
              id="itemCode"
              name="itemCode"
              value={item.itemCode || ""}
              onChange={onChange}
              readOnly={isFieldReadOnly("itemCode")}
              error={!!errors.itemCode}
              placeholder="Nhập mã hàng hóa"
            />
            {errors.itemCode && (
              <p className="text-sm text-red-500">{errors.itemCode}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="itemName">
            Tên hàng hóa <span className="text-red-500">*</span>
          </Label>
          <Input
            id="itemName"
            name="itemName"
            value={item.itemName || ""}
            onChange={onChange}
            readOnly={isFieldReadOnly("itemName")}
            error={!!errors.itemName}
            placeholder="Nhập tên hàng hóa"
          />
          {errors.itemName && (
            <p className="text-sm text-red-500">{errors.itemName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="itemType">Loại hàng hóa</Label>
          <Select
            value={item.itemType || ""}
            onValueChange={(value) => handleSelectChange("itemType", value)}
            disabled={isFieldReadOnly("itemType")}
          >
            <SelectTrigger
              id="itemType"
              className={errors.itemType ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Chọn loại hàng hóa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Nguyên vật liệu">Nguyên vật liệu</SelectItem>
              <SelectItem value="Thành phẩm">Thành phẩm</SelectItem>
              <SelectItem value="Bán thành phẩm">Bán thành phẩm</SelectItem>
            </SelectContent>
          </Select>
          {errors.itemType && (
            <p className="text-sm text-red-500">{errors.itemType}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="uom">
            Đơn vị tính <span className="text-red-500">*</span>
          </Label>
          <Input
            id="uom"
            name="uom"
            value={item.uom || ""}
            onChange={onChange}
            readOnly={isFieldReadOnly("uom")}
            error={!!errors.uom}
            placeholder="Nhập đơn vị tính"
          />
          {errors.uom && <p className="text-sm text-red-500">{errors.uom}</p>}
        </div>
      </div>

      {/* Group 2: Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="importPrice">Giá nhập</Label>
          <div className="relative">
            <Input
              id="importPrice"
              name="importPrice"
              type="number"
              value={item.importPrice ?? ""}
              onChange={onChange}
              readOnly={isFieldReadOnly("importPrice")}
              error={!!errors.importPrice}
              placeholder="0"
              className="pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              VND
            </span>
          </div>
          {errors.importPrice && (
            <p className="text-sm text-red-500">{errors.importPrice}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="exportPrice">Giá xuất</Label>
          <div className="relative">
            <Input
              id="exportPrice"
              name="exportPrice"
              type="number"
              value={item.exportPrice ?? ""}
              onChange={onChange}
              readOnly={isFieldReadOnly("exportPrice")}
              error={!!errors.exportPrice}
              placeholder="0"
              className="pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              VND
            </span>
          </div>
          {errors.exportPrice && (
            <p className="text-sm text-red-500">{errors.exportPrice}</p>
          )}
        </div>
      </div>

      {/* Group 3: Details */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="technicalSpecifications">Thông số kỹ thuật</Label>
          <Textarea
            id="technicalSpecifications"
            name="technicalSpecifications"
            value={item.technicalSpecifications || ""}
            onChange={onChange}
            readOnly={isFieldReadOnly("technicalSpecifications")}
            placeholder="Nhập thông số kỹ thuật chi tiết..."
            className="min-h-[80px]"
          />
          {errors.technicalSpecifications && (
            <p className="text-sm text-red-500">
              {errors.technicalSpecifications}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            name="description"
            value={item.description || ""}
            onChange={onChange}
            readOnly={isFieldReadOnly("description")}
            placeholder="Nhập mô tả sản phẩm..."
            className="min-h-[100px]"
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
        </div>
      </div>

      {/* Group 4: Status */}
      <div className="flex items-center gap-2 pt-2">
        <Checkbox
          id="isSellable"
          name="isSellable"
          checked={!!item.isSellable}
          onChange={(e) =>
            onChange({
              target: { name: "isSellable", value: e.target.checked },
            })
          }
          disabled={readOnlyFields?.isSellable}
        />
        <Label
          htmlFor="isSellable"
          className="cursor-pointer font-medium text-gray-700"
        >
          Đang kinh doanh (Cho phép bán hàng này)
        </Label>
      </div>
    </div>
  );
};

export default ItemForm;
