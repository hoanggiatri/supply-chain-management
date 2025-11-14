import React from "react";
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";

const QuotationForm = ({ rfq, quotation }) => {
  return (
    <Grid container spacing={2} mt={1}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Mã báo giá"
            value={quotation.quotationCode || ""}
            placeholder="Mã báo giá được tạo tự động"
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Mã yêu cầu báo giá"
            value={rfq?.rfqCode || ""}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Mã công ty yêu cầu"
            value={rfq?.companyCode || ""}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Tên công ty yêu cầu"
            value={rfq?.companyName || ""}
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

export default QuotationForm;
