import React, { useEffect, useState } from "react";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import SelectAutocomplete from "@components/content-components/SelectAutocomplete";
import { getAllCompanies } from "@/services/general/CompanyService";

const RfqForm = ({ rfq, onChange, errors = {}, readOnlyFields, setRfq }) => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  const companyId = localStorage.getItem("companyId");
  const token = localStorage.getItem("token");

  const isFieldReadOnly = (field) => readOnlyFields?.[field] ?? false;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getAllCompanies(token);
        const filtered = data.filter(c => c.companyId.toString() !== companyId);
        setCompanies(filtered);
        setFilteredCompanies(filtered);
      } catch (error) {
        alert(error.response?.data?.message || "Có lỗi khi lấy danh sách công ty!");
      }
    };
    fetchCompanies();
  }, [token, companyId]);

  const handleCompanyChange = (selected) => {
    const selectedCompany = companies.find((company) => company.companyId === selected?.value);
    setRfq((prev) => ({
      ...prev,
      requestedCompanyId: selectedCompany?.companyId || "",
      requestedCompanyCode: selectedCompany?.companyCode || "",
      requestedCompanyName: selectedCompany?.companyName || "",
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
        <TextField fullWidth label="Mã yêu cầu" name="rfqCode" value={rfq.rfqCode} onChange={onChange}
          placeholder="Mã yêu cầu được tạo tự động" required
          inputProps={{ readOnly: isFieldReadOnly("rfqCode") }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <SelectAutocomplete
          options={filteredCompanies.map(c => ({ label: c.companyCode + " - " + c.companyName, value: c.companyId }))}
          value={rfq.requestedCompanyId}
          onChange={handleCompanyChange}
          placeholder="Chọn công ty yêu cầu"
          error={errors.requestedCompanyId}
          helperText={errors.requestedCompanyId}
          size="small"
          disabled={isFieldReadOnly("requestedCompanyId")}
        />
      </Grid>



      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth type="datetime-local" label="Hạn báo giá" name="needByDate"
          value={formatDateTimeLocal(rfq.needByDate) || ""}
          onChange={onChange} error={!!errors.needByDate} helperText={errors.needByDate}
          InputLabelProps={{ shrink: true }} required
          InputProps={{ readOnly: isFieldReadOnly("needByDate") }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth error={!!errors.status} required>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            name="status" value={rfq.status || ""} label="Trạng thái"
            onChange={onChange} inputProps={{ readOnly: isFieldReadOnly("status") }}
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

export default RfqForm;
