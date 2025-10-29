import React from "react";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const SupplierPoForm = ({ po }) => {
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
    <Grid container spacing={2} mt={1}>
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
          label="Mã báo giá"
          value={po?.quotationCode || ""}
          InputProps={{ readOnly: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Mã khách hàng"
          value={po?.companyCode || ""}
          InputProps={{ readOnly: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Tên khách hàng"
          value={po?.companyName || ""}
          InputProps={{ readOnly: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="datetime-local"
          label="Ngày đặt hàng"
          value={formatDateTimeLocal(po.createdOn || new Date().toISOString())}
          InputLabelProps={{ shrink: true }}
          name="createdOn"
          InputProps={{ readOnly: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth readOnly>
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
        <TextField
          fullWidth
          label="Địa chỉ giao hàng"
          name="deliveryToAddress"
          value={po.deliveryToAddress || ""}
          InputProps={{ readOnly: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Trạng thái</InputLabel>
          <Select name="status" value={po.status || ""} label="Trạng thái" readOnly>
            <MenuItem value="Chờ xác nhận">Chờ xác nhận</MenuItem>
            <MenuItem value="Đã xác nhận">Đã xác nhận</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default SupplierPoForm;
