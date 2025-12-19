import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PropTypes from "prop-types";

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
    if (!value) {
      if (typeof setMo === "function") {
        setMo((prev) => ({
          ...prev,
          itemId: "",
          itemCode: "",
        }));
      } else {
        handleSelectChange("itemId", "");
      }
      return;
    }

    const selectedItem = items.find(
      (item) => String(item.itemId) === String(value)
    );

    if (selectedItem) {
      if (typeof setMo === "function") {
        setMo((prev) => ({
          ...prev,
          itemId: selectedItem.itemId,
          itemCode: selectedItem.itemCode || "",
        }));
      } else {
        handleSelectChange("itemId", selectedItem.itemId);
      }
    }
  };

  const handleLineChange = (value) => {
    if (!value) {
      if (typeof setMo === "function") {
        setMo((prev) => ({
          ...prev,
          lineId: "",
          lineCode: "",
        }));
      } else {
        handleSelectChange("lineId", "");
      }
      return;
    }

    const selectedLine = lines.find(
      (line) => String(line.lineId) === String(value)
    );

    if (selectedLine) {
      if (typeof setMo === "function") {
        setMo((prev) => ({
          ...prev,
          lineId: selectedLine.lineId,
          lineCode: selectedLine.lineCode || "",
        }));
      } else {
        handleSelectChange("lineId", selectedLine.lineId);
      }
    }
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Loại công lệnh */}
      <div className="space-y-2">
        <Label htmlFor="type">
          Loại công lệnh <span className="text-red-500">*</span>
        </Label>
        {isFieldReadOnly("type") ? (
          <Input
            id="type"
            value={mo.type || ""}
            readOnly
            disabled
          />
        ) : (
          <Select
            value={mo.type || ""}
            onValueChange={(val) => handleSelectChange("type", val)}
            disabled={isFieldReadOnly("type")}
          >
            <SelectTrigger className={errors.type ? "border-red-500" : ""}>
              <SelectValue placeholder="Chọn loại công lệnh" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sản xuất đại trà">Sản xuất đại trà</SelectItem>
              <SelectItem value="Sản xuất thử nghiệm">Sản xuất thử nghiệm</SelectItem>
            </SelectContent>
          </Select>
        )}
        {errors.type && (
          <p className="text-sm text-red-500">{errors.type}</p>
        )}
      </div>

      {/* Hàng hóa */}
      <div className="space-y-2">
        <Label htmlFor="itemId">
          Hàng hóa <span className="text-red-500">*</span>
        </Label>
        {isFieldReadOnly("itemId") ? (
          <Input
            id="itemId"
            value={mo.itemCode || ""}
            readOnly
            disabled
          />
        ) : (
          <Select
            value={mo.itemId ? String(mo.itemId) : ""}
            onValueChange={handleItemChange}
            disabled={isFieldReadOnly("itemId")}
          >
            <SelectTrigger className={errors.itemId ? "border-red-500" : ""}>
              <SelectValue placeholder="Chọn hàng hóa" />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.itemId} value={String(item.itemId)}>
                  {item.itemCode} - {item.itemName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {errors.itemId && (
          <p className="text-sm text-red-500">{errors.itemId}</p>
        )}
      </div>

      {/* Dây chuyền */}
      <div className="space-y-2">
        <Label htmlFor="lineId">
          Dây chuyền <span className="text-red-500">*</span>
        </Label>
        {isFieldReadOnly("lineId") ? (
          <Input
            id="lineId"
            value={mo.lineCode || ""}
            readOnly
            disabled
          />
        ) : (
          <Select
            value={mo.lineId ? String(mo.lineId) : ""}
            onValueChange={handleLineChange}
            disabled={isFieldReadOnly("lineId")}
          >
            <SelectTrigger className={errors.lineId ? "border-red-500" : ""}>
              <SelectValue placeholder="Chọn dây chuyền" />
            </SelectTrigger>
            <SelectContent>
              {lines.map((line) => (
                <SelectItem key={line.lineId} value={String(line.lineId)}>
                  {line.lineCode} - {line.lineName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {errors.lineId && (
          <p className="text-sm text-red-500">{errors.lineId}</p>
        )}
      </div>

      {/* Số lượng */}
      <div className="space-y-2">
        <Label htmlFor="quantity">
          Số lượng <span className="text-red-500">*</span>
        </Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min={0}
          value={mo.quantity ?? ""}
          onChange={onChange}
          readOnly={isFieldReadOnly("quantity")}
          disabled={isFieldReadOnly("quantity")}
          className={errors.quantity ? "border-red-500" : ""}
          placeholder="Nhập số lượng"
        />
        {errors.quantity && (
          <p className="text-sm text-red-500">{errors.quantity}</p>
        )}
      </div>

      {/* Thời gian bắt đầu dự kiến */}
      <div className="space-y-2">
        <Label htmlFor="estimatedStartTime">
          Thời gian bắt đầu dự kiến <span className="text-red-500">*</span>
        </Label>
        <DateTimePicker
          name="estimatedStartTime"
          value={mo.estimatedStartTime || ""}
          onChange={onChange}
          disabled={isFieldReadOnly("estimatedStartTime")}
          error={!!errors.estimatedStartTime}
          placeholder="Chọn thời gian bắt đầu"
        />
        {errors.estimatedStartTime && (
          <p className="text-sm text-red-500">{errors.estimatedStartTime}</p>
        )}
      </div>

      {/* Thời gian kết thúc dự kiến */}
      <div className="space-y-2">
        <Label htmlFor="estimatedEndTime">
          Thời gian kết thúc dự kiến <span className="text-red-500">*</span>
        </Label>
        <DateTimePicker
          name="estimatedEndTime"
          value={mo.estimatedEndTime || ""}
          onChange={onChange}
          disabled={isFieldReadOnly("estimatedEndTime")}
          error={!!errors.estimatedEndTime}
          placeholder="Chọn thời gian kết thúc"
        />
        {errors.estimatedEndTime && (
          <p className="text-sm text-red-500">{errors.estimatedEndTime}</p>
        )}
      </div>

      {/* Trạng thái */}
      <div className="space-y-2">
        <Label htmlFor="status">Trạng thái</Label>
        {isFieldReadOnly("status") ? (
          <Input
            id="status"
            value={mo.status || ""}
            readOnly
            disabled
          />
        ) : (
          <Select
            value={mo.status || ""}
            onValueChange={(val) => handleSelectChange("status", val)}
            disabled={isFieldReadOnly("status")}
          >
            <SelectTrigger className={errors.status ? "border-red-500" : ""}>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Chờ xác nhận">Chờ xác nhận</SelectItem>
              <SelectItem value="Chờ sản xuất">Chờ sản xuất</SelectItem>
              <SelectItem value="Đang sản xuất">Đang sản xuất</SelectItem>
              <SelectItem value="Chờ nhập kho">Chờ nhập kho</SelectItem>
              <SelectItem value="Đã hoàn thành">Đã hoàn thành</SelectItem>
              <SelectItem value="Đã hủy">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        )}
        {errors.status && (
          <p className="text-sm text-red-500">{errors.status}</p>
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
