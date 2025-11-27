import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Input,
  Select,
  Option,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import toastrService from "@/services/toastrService";

const BomForm = ({
  bom = {},
  onChange,
  errors = {},
  readOnlyFields = {},
  setBom,
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

  const renderItemSelect = () => {
    if (isFieldReadOnly("itemCode")) {
      return (
        <Input
          label="Hàng hóa"
          value={bom.itemCode ? `${bom.itemCode} - ${bom.itemName || ""}` : ""}
          readOnly
          color="blue"
          className="w-full placeholder:opacity-100"
        />
      );
    }

    return (
      <Select
        label="Chọn hàng hóa"
        color="blue"
        value={bom.itemCode || ""}
        onChange={handleItemSelect}
        className="w-full"
      >
        {items.map((item) => (
          <Option key={item.itemCode} value={item.itemCode}>
            {item.itemCode} - {item.itemName}
          </Option>
        ))}
      </Select>
    );
  };

  const renderStatusField = () => {
    if (isFieldReadOnly("status")) {
      return (
        <Input
          label="Trạng thái"
          value={bom.status || ""}
          readOnly
          color="blue"
          className="w-full placeholder:opacity-100"
        />
      );
    }

    return (
      <Select
        label="Trạng thái"
        color="blue"
        value={bom.status || ""}
        onChange={(val) => handleSelectChange("status", val)}
        className="w-full"
      >
        <Option value="Đang sử dụng">Đang sử dụng</Option>
        <Option value="Ngừng sử dụng">Ngừng sử dụng</Option>
      </Select>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Input
          label="Mã BOM"
          name="bomCode"
          value={bom.bomCode || ""}
          onChange={onChange}
          placeholder="Mã BOM sẽ được tạo tự động"
          color="blue"
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("bomCode")}
          required
        />
        {errors.bomCode && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.bomCode}
          </Typography>
        )}
      </div>

      <div>
        {renderItemSelect()}
        {errors.itemCode && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.itemCode}
          </Typography>
        )}
      </div>

      <div>
        <Input
          label="Tên hàng hóa"
          name="itemName"
          value={bom.itemName || ""}
          readOnly
          color="blue"
          className="w-full placeholder:opacity-100"
        />
        {errors.itemName && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.itemName}
          </Typography>
        )}
      </div>

      <div>
        {renderStatusField()}
        {errors.status && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.status}
          </Typography>
        )}
      </div>

      <div className="md:col-span-2">
        <Textarea
          label="Mô tả"
          name="description"
          value={bom.description || ""}
          onChange={onChange}
          color="blue"
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("description")}
        />
        {errors.description && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.description}
          </Typography>
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
};

export default BomForm;
