import React from "react";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const SoForm = ({ po = {}, so = {}, setSo }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Grid container spacing={2} mt={1}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Mã đơn bán hàng"
          value={so.soCode || ""}
          placeholder="Mã đơn bán hàng được tạo tự động"
          InputProps={{ readOnly: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Mã đơn mua hàng"
          value={po.poCode || ""}
          InputProps={{ readOnly: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Mã công ty khách hàng"
          value={po.companyCode || ""}
          InputProps={{ readOnly: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Tên công ty khách hàng"
          value={po.companyName || ""}
          InputProps={{ readOnly: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Địa chỉ lấy hàng"
          name="deliveryFromAddress"
          value={so.deliveryFromAddress || ""}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Địa chỉ giao hàng"
          name="deliveryToAddress"
          value={po.deliveryToAddress || ""}
          readOnly
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Phương thức thanh toán</InputLabel>
          <Select
            name="paymentMethod"
            value={po.paymentMethod || ""}
            label="Phương thức thanh toán"
            readOnly
          >
            <MenuItem value="Ghi công nợ">Ghi công nợ</MenuItem>
            <MenuItem value="Chuyển khoản">Chuyển khoản</MenuItem>
            <MenuItem value="Tiền mặt">Tiền mặt</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Trạng thái</InputLabel>
          <Select name="status" value={so.status || ""} label="Trạng thái" readOnly>
            <MenuItem value="Chờ xuất kho">Chờ xuất kho</MenuItem>
            <MenuItem value="Chờ vận chuyển">Chờ vận chuyển</MenuItem>
            <MenuItem value="Đang vận chuyển">Đang vận chuyển</MenuItem>
            <MenuItem value="Đã hoàn thành">Đã hoàn thành</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default SoForm;
