import React from "react";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const DoForm = ({ deliveryOrder }) => {
  return (
    <Grid container spacing={2} mt={1}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Mã đơn vận chuyển"
          value={deliveryOrder.doCode || ""}
          InputProps={{ readOnly: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Mã đơn bán hàng"
          value={deliveryOrder.soCode || ""}
          InputProps={{ readOnly: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Địa chỉ lấy hàng"
          value={deliveryOrder.deliveryFromAddress || ""}
          InputProps={{ readOnly: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Địa chỉ giao hàng"
          value={deliveryOrder.deliveryToAddress || ""}
          InputProps={{ readOnly: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={deliveryOrder.status || ""}
            label="Trạng thái"
            readOnly
          >
            <MenuItem value="Chờ xác nhận">Chờ xác nhận</MenuItem>
            <MenuItem value="Chờ lấy hàng">Chờ lấy hàng</MenuItem>
            <MenuItem value="Đang vận chuyển">Đang vận chuyển</MenuItem>
            <MenuItem value="Đã hoàn thành">Đã hoàn thành</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default DoForm;
