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

const StageForm = ({
  stage = {},
  onChange,
  errors = {},
  readOnlyFields = {},
  setStage,
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
          stage?.itemCode &&
          !filtered.some((item) => item.itemCode === stage.itemCode)
        ) {
          filtered.unshift({
            itemCode: stage.itemCode,
            itemName: stage.itemName,
            itemId: stage.itemId,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, token]);

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
    if (typeof setStage === "function") {
      setStage((prev) => ({
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
      {/* Hàng hóa */}
      <div className="space-y-2">
        <Label htmlFor="itemCode">
          Hàng hóa <span className="text-red-500">*</span>
        </Label>
        {isFieldReadOnly("itemCode") ? (
          <Input
            id="itemCode"
            value={stage.itemCode ? `${stage.itemCode} - ${stage.itemName || ""}` : ""}
            readOnly
            disabled
          />
        ) : (
          <Select
            value={stage.itemCode || ""}
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
            {/* Trạng thái */}
      <div className="space-y-2">
        <Label htmlFor="status">Trạng thái</Label>
        {isFieldReadOnly("status") ? (
          <Input
            id="status"
            value={stage.status || ""}
            readOnly
            disabled
          />
        ) : (
          <Select
            value={stage.status || ""}
            onValueChange={(val) => handleSelectChange("status", val)}
            disabled={isFieldReadOnly("status")}
          >
            <SelectTrigger className={errors.status ? "border-red-500" : ""}>
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
          value={stage.description || ""}
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

StageForm.propTypes = {
  stage: PropTypes.object,
  onChange: PropTypes.func,
  errors: PropTypes.object,
  readOnlyFields: PropTypes.object,
  setStage: PropTypes.func,
};

export default StageForm;
