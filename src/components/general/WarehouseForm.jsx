import React from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const WarehouseForm = ({ warehouse, onChange, errors, readOnlyFields }) => {
  const isFieldReadOnly = (field) => readOnlyFields[field] ?? false;

  return (
    <Grid container spacing={2}>
      {/* <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Mã kho" name="warehouseCode" value={warehouse.warehouseCode} required onChange={onChange}
        error={!!errors.warehouseCode} helperText={errors.warehouseCode} placeholder="Mã kho được tạo tự động"
        readOnly />
      </Grid> */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Tên kho"
          name="warehouseName"
          value={warehouse.warehouseName}
          required
          onChange={onChange}
          error={!!errors.warehouseName}
          helperText={errors.warehouseName}
          InputProps={{ readOnly: isFieldReadOnly("warehouseName") }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="number"
          label="Sức chứa tối đa (m³)"
          name="maxCapacity"
          value={warehouse.maxCapacity}
          onChange={onChange}
          error={!!errors.maxCapacity}
          helperText={errors.maxCapacity}
          InputProps={{ readOnly: isFieldReadOnly("maxCapacity") }}
          inputProps={{ min: 0 }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl
          fullWidth
          required
          error={!!errors.warehouseType}
          helperText={errors.warehouseType}
          InputProps={{ readOnly: isFieldReadOnly("maxCapacity") }}
        >
          <InputLabel>Loại kho</InputLabel>
          <Select
            name="warehouseType"
            value={warehouse.warehouseType || ""}
            label="Loại kho"
            onChange={onChange}
          >
            <MenuItem value="Nguyên vật liệu">Nguyên vật liệu</MenuItem>
            <MenuItem value="Thành phẩm">Thành phẩm</MenuItem>
            <MenuItem value="Hàng lỗi">Hàng lỗi</MenuItem>
            <MenuItem value="Nhận hàng">Nhận hàng</MenuItem>
            <MenuItem value="Xuất hàng">Xuất hàng</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Mô tả"
          name="description"
          value={warehouse.description}
          onChange={onChange}
          error={!!errors.description}
          helperText={errors.description}
          InputProps={{ readOnly: isFieldReadOnly("description") }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl
          fullWidth
          required
          error={!!errors.status}
          helperText={errors.status}
          InputProps={{ readOnly: isFieldReadOnly("status") }}
        >
          <InputLabel>Trạng thái</InputLabel>
          <Select
            name="status"
            value={warehouse.status || ""}
            label="Trạng thái"
            onChange={onChange}
          >
            <MenuItem value="Đang sử dụng">Đang sử dụng</MenuItem>
            <MenuItem value="Ngưng sử dụng">Ngừng sử dụng</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default WarehouseForm;
