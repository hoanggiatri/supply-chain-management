import React from "react";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from "@mui/material";

const ItemForm = ({ item, onChange, errors = {}, readOnlyFields }) => {
  const isFieldReadOnly = (field) => readOnlyFields?.[field] ?? false;

  return (
    <Grid container spacing={2}>

      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Mã hàng hóa" name="itemCode" value={item.itemCode} onChange={onChange}
          placeholder="Mã hàng hóa được tạo tự động" required
          inputProps={{ readOnly: isFieldReadOnly("itemCode") }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Tên hàng hóa" name="itemName" value={item.itemName} onChange={onChange}
          error={!!errors.itemName} helperText={errors.itemName} required
          InputProps={{ readOnly: isFieldReadOnly("itemName") }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth error={!!errors.itemType} helperText={errors.itemType} required >
          <InputLabel>Loại hàng hóa</InputLabel>
          <Select name="itemType" value={item.itemType || ''} label="Loại hàng hóa" onChange={onChange}
            inputProps={{ readOnly: isFieldReadOnly("itemType") }}
          >
            <MenuItem value="Nguyên vật liệu">Nguyên vật liệu</MenuItem>
            <MenuItem value="Thành phẩm">Thành phẩm</MenuItem>
            <MenuItem value="Bán thành phẩm">Bán thành phẩm</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Đơn vị tính" name="uom" value={item.uom} onChange={onChange}
          error={!!errors.uom} helperText={errors.uom} required
          InputProps={{ readOnly: isFieldReadOnly("uom") }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Giá nhập" name="importPrice" type="number" value={item.importPrice} onChange={onChange}
          error={!!errors.importPrice} helperText={errors.importPrice}
          InputProps={{ readOnly: isFieldReadOnly("importPrice") }}
          inputProps={{ min: 0, step: "any" }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Giá xuất" name="exportPrice" type="number" value={item.exportPrice} onChange={onChange}
          error={!!errors.exportPrice} helperText={errors.exportPrice}
          InputProps={{ readOnly: isFieldReadOnly("exportPrice") }}
          inputProps={{ min: 0, step: "any" }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Thông số kỹ thuật" name="technicalSpecifications" value={item.technicalSpecifications}
          onChange={onChange} multiline minRows={3}
          InputProps={{ readOnly: isFieldReadOnly("technicalSpecifications") }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Mô tả" name="description" value={item.description} onChange={onChange}
          multiline minRows={3} InputProps={{ readOnly: isFieldReadOnly("description") }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Checkbox
              name="isSellable"
              checked={!!item.isSellable}
              onChange={(e) => onChange({ target: { name: "isSellable", value: e.target.checked } })}
              disabled={readOnlyFields?.isSellable}
              sx={{
                ml: 0.5,
                '&.Mui-checked': {
                  color: '#05518b',
                },
                '&:hover': { backgroundColor: 'transparent' },
              }}
            />
          }
          label="Hàng bán"
        />
      </Grid>
    </Grid>
  );
};

export default ItemForm;
