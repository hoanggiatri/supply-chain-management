import React from "react";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import SelectAutocomplete from "@components/content-components/SelectAutocomplete";

const MoForm = ({ mo, onChange, errors = {}, readOnlyFields, setMo, items = [], lines = [] }) => {

  const isFieldReadOnly = (field) => readOnlyFields?.[field] ?? false;

  const handleItemChange = (selected) => {
    const selectedItem = items.find((item) => item.itemId === selected?.value);
    setMo((prev) => ({
      ...prev,
      itemId: selectedItem?.itemId || "",
      itemCode: selectedItem?.itemCode || "",
    }));
  };

  const handleLineChange = (selected) => {
    const selectedLine = lines.find((line) => line.lineId === selected?.value);
    setMo((prev) => ({
      ...prev,
      lineCode: selectedLine?.lineCode || "",
      lineId: selectedLine?.lineId || "",
    }));
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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Mã MO" name="moCode"
          value={mo.moCode} onChange={onChange} placeholder="Mã công lệnh được tạo tự động" required
          inputProps={{ readOnly: isFieldReadOnly("moCode") }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth required error={!!errors.type}>
          <InputLabel>Loại</InputLabel>
          <Select name="type" value={mo.type || ""} label="Loại" onChange={onChange}
            inputProps={{ readOnly: isFieldReadOnly("type") }}
          >
            <MenuItem value="Sản xuất đại trà">Sản xuất đại trà</MenuItem>
            <MenuItem value="Sản xuất thử nghiệm">Sản xuất thử nghiệm</MenuItem>
          </Select>
          {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <SelectAutocomplete size="small"
          options={items.map(item => ({ label: item.itemCode + " - " + item.itemName, value: item.itemId }))}
          value={mo.itemId} onChange={handleItemChange} placeholder="Chọn hàng hóa *"
          error={errors.itemId} helperText={errors.itemId} disabled={isFieldReadOnly("itemId")}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <SelectAutocomplete size="small"
          options={lines.map(line => ({ label: line.lineCode + " - " + line.lineName, value: line.lineId }))}
          value={mo.lineId} onChange={handleLineChange} placeholder="Chọn dây chuyền *"
          error={errors.lineId} helperText={errors.lineId} disabled={isFieldReadOnly("lineId")}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Số lượng" name="quantity" type="number" value={mo.quantity} onChange={onChange}
          required error={!!errors.quantity} helperText={errors.quantity}
          InputProps={{ readOnly: isFieldReadOnly("quantity") }}
          inputProps={{ min: 0 }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Thời gian bắt đầu dự kiến" name="estimatedStartTime" type="datetime-local"
          value={formatDateTimeLocal(mo.estimatedStartTime) || ""} onChange={onChange} error={!!errors.estimatedStartTime} helperText={errors.estimatedStartTime}
          InputProps={{ readOnly: isFieldReadOnly("estimatedStartTime") }} InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Thời gian kết thúc dự kiến" name="estimatedEndTime" type="datetime-local"
          value={formatDateTimeLocal(mo.estimatedEndTime || "")} onChange={onChange} error={!!errors.estimatedEndTime} helperText={errors.estimatedEndTime}
          InputProps={{ readOnly: isFieldReadOnly("estimatedEndTime") }} InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth required inputProps={{ readOnly: isFieldReadOnly("status") }} error={!!errors.status} helperText={errors.status}>
          <InputLabel>Trạng thái</InputLabel>
          <Select name="status" value={mo.status || ""} label="Trạng thái">
            <MenuItem value="Chờ xác nhận">Chờ xác nhận</MenuItem>
            <MenuItem value="Chờ sản xuất">Chờ sản xuất</MenuItem>
            <MenuItem value="Đang sản xuất">Đang sản xuất</MenuItem>
            <MenuItem value="Chờ nhập kho">Chờ nhập kho</MenuItem>
            <MenuItem value="Đã hoàn thành">Đã hoàn thành</MenuItem>
            <MenuItem value="Đã hủy">Đã hủy</MenuItem>
          </Select>
          {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default MoForm;
