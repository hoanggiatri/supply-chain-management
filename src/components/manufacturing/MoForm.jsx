import React from "react";
import PropTypes from "prop-types";
import { Input, Select, Option, Typography } from "@material-tailwind/react";

const MoForm = ({
  mo = {},
  onChange,
  errors = {},
  readOnlyFields = {},
  setMo,
  items = [],
  lines = [],
}) => {
  const isFieldReadOnly = (field) => readOnlyFields?.[field] ?? false;

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

  const handleItemChange = (value) => {
    const selectedItem = items.find(
      (item) => String(item.itemId) === String(value)
    );
    if (typeof setMo === "function") {
      setMo((prev) => ({
        ...prev,
        itemId: selectedItem?.itemId || "",
        itemCode: selectedItem?.itemCode || "",
      }));
    } else {
      handleSelectChange("itemId", selectedItem?.itemId || "");
    }
  };

  const handleLineChange = (value) => {
    const selectedLine = lines.find(
      (line) => String(line.lineId) === String(value)
    );
    if (typeof setMo === "function") {
      setMo((prev) => ({
        ...prev,
        lineCode: selectedLine?.lineCode || "",
        lineId: selectedLine?.lineId || "",
      }));
    } else {
      handleSelectChange("lineId", selectedLine?.lineId || "");
    }
  };

  const formatDateTimeLocal = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const renderItemSelect = () => {
    if (isFieldReadOnly("itemId")) {
      return (
        <Input
          label="Hàng hóa"
          value={mo.itemCode || ""}
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
        value={mo.itemId || ""}
        onChange={handleItemChange}
        className="w-full"
      >
        {items.map((item) => (
          <Option key={item.itemId} value={item.itemId}>
            {item.itemCode} - {item.itemName}
          </Option>
        ))}
      </Select>
    );
  };

  const renderLineSelect = () => {
    if (isFieldReadOnly("lineId")) {
      return (
        <Input
          label="Dây chuyền"
          value={mo.lineCode || ""}
          readOnly
          color="blue"
          className="w-full placeholder:opacity-100"
        />
      );
    }

    return (
      <Select
        label="Chọn dây chuyền"
        color="blue"
        value={mo.lineId || ""}
        onChange={handleLineChange}
        className="w-full"
      >
        {lines.map((line) => (
          <Option key={line.lineId} value={line.lineId}>
            {line.lineCode} - {line.lineName}
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
          value={mo.status || ""}
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
        value={mo.status || ""}
        onChange={(val) => handleSelectChange("status", val)}
        className="w-full"
      >
        <Option value="Chờ xác nhận">Chờ xác nhận</Option>
        <Option value="Chờ sản xuất">Chờ sản xuất</Option>
        <Option value="Đang sản xuất">Đang sản xuất</Option>
        <Option value="Chờ nhập kho">Chờ nhập kho</Option>
        <Option value="Đã hoàn thành">Đã hoàn thành</Option>
        <Option value="Đã hủy">Đã hủy</Option>
      </Select>
    );
  };

  const renderTypeField = () => {
    if (isFieldReadOnly("type")) {
      return (
        <Input
          label="Loại công lệnh"
          value={mo.type || ""}
          readOnly
          color="blue"
          className="w-full placeholder:opacity-100"
        />
      );
    }

    return (
      <Select
        label="Loại công lệnh"
        color="blue"
        value={mo.type || ""}
        onChange={(val) => handleSelectChange("type", val)}
        className="w-full"
      >
        <Option value="Sản xuất đại trà">Sản xuất đại trà</Option>
        <Option value="Sản xuất thử nghiệm">Sản xuất thử nghiệm</Option>
      </Select>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Input
          label="Mã MO"
          name="moCode"
          color="blue"
          value={mo.moCode || ""}
          onChange={onChange}
          placeholder="Mã công lệnh được tạo tự động"
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("moCode")}
          required
        />
        {errors.moCode && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.moCode}
          </Typography>
        )}
      </div>

      <div>
        {renderTypeField()}
        {errors.type && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.type}
          </Typography>
        )}
      </div>

      <div>
        {renderItemSelect()}
        {errors.itemId && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.itemId}
          </Typography>
        )}
      </div>

      <div>
        {renderLineSelect()}
        {errors.lineId && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.lineId}
          </Typography>
        )}
      </div>

      <div>
        <Input
          label="Số lượng"
          name="quantity"
          type="number"
          min={0}
          color="blue"
          value={mo.quantity ?? ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("quantity")}
          required
        />
        {errors.quantity && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.quantity}
          </Typography>
        )}
      </div>

      <div>
        <Input
          label="Thời gian bắt đầu dự kiến"
          name="estimatedStartTime"
          type="datetime-local"
          value={formatDateTimeLocal(mo.estimatedStartTime) || ""}
          onChange={onChange}
          color="blue"
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("estimatedStartTime")}
        />
        {errors.estimatedStartTime && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.estimatedStartTime}
          </Typography>
        )}
      </div>

      <div>
        <Input
          label="Thời gian kết thúc dự kiến"
          name="estimatedEndTime"
          type="datetime-local"
          value={formatDateTimeLocal(mo.estimatedEndTime) || ""}
          onChange={onChange}
          color="blue"
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("estimatedEndTime")}
        />
        {errors.estimatedEndTime && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.estimatedEndTime}
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

MoForm.propTypes = {
  mo: PropTypes.object,
  onChange: PropTypes.func,
  errors: PropTypes.object,
  readOnlyFields: PropTypes.object,
  setMo: PropTypes.func,
  items: PropTypes.array,
  lines: PropTypes.array,
};

export default MoForm;
