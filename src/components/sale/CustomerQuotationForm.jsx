import React from "react";
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";

const CustomerQuotationForm = ({ quotation }) => {
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
          label="Mã yêu cầu báo giá"
          value={quotation?.rfqCode || ""}
          InputProps={{ readOnly: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="datetime-local"
          label="Ngày báo giá"
          value={formatDateTimeLocal(quotation?.createdOn)}
          InputProps={{ readOnly: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Mã công ty báo giá"
          value={quotation?.companyCode || ""}
          InputProps={{ readOnly: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Tên công ty báo giá"
          value={quotation?.companyName || ""}
          InputProps={{ readOnly: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth required InputProps={{ readOnly: true }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select name="status" value={quotation.status || ""} label="Trạng thái" >
            <MenuItem value="Đã báo giá">Đã báo giá</MenuItem>
            <MenuItem value="Đã từ chối">Đã từ chối</MenuItem>
            <MenuItem value="Đã chấp nhận">Đã chấp nhận</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default CustomerQuotationForm;
