import React from "react";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const SupplierRfqForm = ({ rfq }) => {

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
        <TextField
          fullWidth label="Mã yêu cầu" name="rfqCode" value={rfq.rfqCode}
          readOnly required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth type="datetime-local" label="Hạn báo giá" name="needByDate"
          value={formatDateTimeLocal(rfq.needByDate) || ""}
          InputLabelProps={{ shrink: true }}
          readOnly required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth label="Mã công ty yêu cầu" name="companyCode" value={rfq.companyCode || ""}
          readOnly required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth label="Tên công ty yêu cầu" name="companyName" value={rfq.companyName || ""}
          readOnly required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            name="status" value={rfq.status || ""} label="Trạng thái"
            readOnly required
          >
            <MenuItem value="Chưa báo giá">Chưa báo giá</MenuItem>
            <MenuItem value="Đã báo giá">Đã báo giá</MenuItem>
            <MenuItem value="Đã hủy">Đã hủy</MenuItem>
            <MenuItem value="Đã từ chối">Đã từ chối</MenuItem>
            <MenuItem value="Đã chấp nhận">Đã chấp nhận</MenuItem>
            <MenuItem value="Quá hạn báo giá">Quá hạn báo giá</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default SupplierRfqForm;
