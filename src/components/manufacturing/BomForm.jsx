import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import toastrService from "@/services/toastrService";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const BomForm = ({
  bom = {},
  onChange,
  errors = {},
  readOnlyFields = {},
  setBom,
  mode,
}) => {
  const [items, setItems] = useState([]);
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  const isFieldReadOnly = (field) => readOnlyFields?.[field] ?? false;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getAllItemsInCompany(companyId, token);
        const filtered = data.filter(
          (item) =>
            item.itemType === "Thành phẩm" || item.itemType === "Bán thành phẩm"
        );

        if (
          bom?.itemCode &&
          !filtered.some((item) => item.itemCode === bom.itemCode)
        ) {
          filtered.unshift({
            itemCode: bom.itemCode,
            itemName: bom.itemName,
            itemId: bom.itemId,
          });
        }

        setItems(filtered);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Có lỗi khi lấy hàng hóa!"
        );
      }
    };
    fetchItems();
  }, [companyId, token, bom]);

  const handleSelectChange = (name, value) => {
    if (typeof onChange === "function") {
      onChange({
        target: {
          name,
          value,
        },
      });
    }
  };

  const handleItemSelect = (value) => {
    const selectedItem = items.find((item) => item.itemCode === value);
    if (typeof setBom === "function") {
      setBom((prev) => ({
        ...prev,
        itemCode: selectedItem?.itemCode || "",
        itemName: selectedItem?.itemName || "",
        itemId: selectedItem?.itemId || "",
      }));
    } else {
      handleSelectChange("itemCode", selectedItem?.itemCode || "");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Mã BOM - Ẩn khi là create mode */}
      {mode !== "create" && (
        <div className="space-y-2">
          <Label htmlFor="bomCode">Mã BOM</Label>
          <Input
            id="bomCode"
            name="bomCode"
            value={bom.bomCode || ""}
            onChange={onChange}
            placeholder="Mã BOM sẽ được tạo tự động"
            readOnly={isFieldReadOnly("bomCode")}
            disabled={isFieldReadOnly("bomCode")}
            className={errors.bomCode ? "border-red-500" : ""}
          />
          {errors.bomCode && (
            <p className="text-sm text-red-500">{errors.bomCode}</p>
          )}
        </div>
      )}

      {/* Hàng hóa */}
      <div className="space-y-2">
        <Label htmlFor="itemCode">
          Hàng hóa <span className="text-red-500">*</span>
        </Label>
        {isFieldReadOnly("itemCode") ? (
          <Input
            id="itemCode"
            value={bom.itemCode ? `${bom.itemCode} - ${bom.itemName || ""}` : ""}
            readOnly
            disabled
          />
        ) : (
          <Select
            value={bom.itemCode || ""}
            onValueChange={handleItemSelect}
            disabled={isFieldReadOnly("itemCode")}
          >
            <SelectTrigger className={errors.itemCode ? "border-red-500" : ""}>
              <SelectValue placeholder="Chọn hàng hóa" />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.itemCode} value={item.itemCode}>
                  {item.itemCode} - {item.itemName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {errors.itemCode && (
          <p className="text-sm text-red-500">{errors.itemCode}</p>
        )}
      </div>

      {/* Tên hàng hóa */}
      <div className="space-y-2">
        <Label htmlFor="itemName">Tên hàng hóa</Label>
        <Input
          id="itemName"
          name="itemName"
          value={bom.itemName || ""}
          readOnly
          disabled
        />
        {errors.itemName && (
          <p className="text-sm text-red-500">{errors.itemName}</p>
        )}
      </div>

      {/* Trạng thái */}
      <div className="space-y-2">
        <Label htmlFor="status">Trạng thái</Label>
        {isFieldReadOnly("status") ? (
          <Input
            id="status"
            value={bom.status || ""}
            readOnly
            disabled
          />
        ) : (
          <Select
            value={bom.status || ""}
            onValueChange={(val) => handleSelectChange("status", val)}
            disabled={isFieldReadOnly("status")}
          >
            <SelectTrigger className={`${errors.status ? "border-red-500" : ""} ${isFieldReadOnly("status") ? "bg-gray-50" : ""}`}>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Đang sử dụng">Đang sử dụng</SelectItem>
              <SelectItem value="Ngừng sử dụng">Ngừng sử dụng</SelectItem>
            </SelectContent>
          </Select>
        )}
        {errors.status && (
          <p className="text-sm text-red-500">{errors.status}</p>
        )}
      </div>

      {/* Mô tả */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          name="description"
          value={bom.description || ""}
          onChange={onChange}
          readOnly={isFieldReadOnly("description")}
          disabled={isFieldReadOnly("description")}
          placeholder="Nhập mô tả..."
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>
    </div>
  );
};

BomForm.propTypes = {
  bom: PropTypes.object,
  onChange: PropTypes.func,
  errors: PropTypes.object,
  readOnlyFields: PropTypes.object,
  setBom: PropTypes.func,
  mode: PropTypes.string,
};

export default BomForm;
