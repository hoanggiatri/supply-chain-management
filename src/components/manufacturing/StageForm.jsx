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

  const renderItemSelect = () => {
    if (isFieldReadOnly("itemCode")) {
      return (
        <Input
          label="Hàng hóa"
          value={
            stage.itemCode ? `${stage.itemCode} - ${stage.itemName || ""}` : ""
          }
          color="blue"
          className="w-full placeholder:opacity-100"
          readOnly
        />
      );
    }

    return (
      <Select
        label="Chọn hàng hóa"
        color="blue"
        value={stage.itemCode || ""}
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
          value={stage.status || ""}
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
        value={stage.status || ""}
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
          label="Mã Stage"
          name="stageCode"
          color="blue"
          value={stage.stageCode || ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("stageCode")}
          placeholder="Mã Stage sẽ được tạo tự động"
        />
        {errors.stageCode && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.stageCode}
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

      <div className="md:col-span-2">
        <Textarea
          label="Mô tả"
          name="description"
          color="blue"
          value={stage.description || ""}
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

      <div>
        {renderStatusField()}
        {errors.status && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.status}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default StageForm;

StageForm.propTypes = {
  stage: PropTypes.object,
  onChange: PropTypes.func,
  errors: PropTypes.object,
  readOnlyFields: PropTypes.object,
  setStage: PropTypes.func,
};
