import React from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getAllDepartmentsInCompany } from "@/services/general/DepartmentService";

const EmployeeForm = ({
  employee,
  onChange,
  errors = {},
  readOnlyFields,
  mode,
}) => {
  const [departments, setDepartments] = useState([]);
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const isFieldReadOnly = (field) => readOnlyFields[field] ?? false;

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getAllDepartmentsInCompany(companyId, token);
        setDepartments(data);
      } catch (error) {
        alert(error.response?.data?.message || "Có lỗi khi lấy bộ phận!");
      }
    };
    fetchDepartments();
  }, [companyId, token]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          select
          fullWidth
          label="Bộ phận"
          name="departmentId"
          value={employee.departmentId}
          onChange={onChange}
          error={!!errors.departmentId}
          helperText={errors.departmentId}
          required
          InputProps={{ readOnly: isFieldReadOnly("departmentId") }}
        >
          {departments.map((dept) => (
            <MenuItem key={dept.departmentId} value={dept.departmentId}>
              {dept.departmentCode} - {dept.departmentName}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl
          fullWidth
          required
          error={!!errors.position}
          helperText={errors.position}
          InputProps={{ readOnly: isFieldReadOnly("position") }}
        >
          <InputLabel>Chức vụ</InputLabel>
          <Select
            name="position"
            value={employee.position}
            label="Chức vụ"
            onChange={onChange}
          >
            <MenuItem value="Quản lý">Quản lý</MenuItem>
            <MenuItem value="Nhân viên">Nhân viên</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Mã nhân viên"
          name="employeeCode"
          value={employee.employeeCode}
          onChange={onChange}
          error={!!errors.employeeCode}
          helperText={errors.employeeCode}
          required
          InputProps={{ readOnly: isFieldReadOnly("employeeCode") }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Họ và tên"
          name="employeeName"
          value={employee.employeeName}
          onChange={onChange}
          error={!!errors.employeeName}
          helperText={errors.employeeName}
          required
          InputLabelProps={{ readOnly: isFieldReadOnly("employeeName") }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="date"
          name="dateOfBirth"
          label="Ngày sinh"
          value={employee.dateOfBirth}
          InputLabelProps={{ shrink: true }}
          onChange={onChange}
          InputProps={{ readOnly: isFieldReadOnly("dateOfBirth") }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl
          fullWidth
          InputProps={{ readOnlyFields: isFieldReadOnly("gender") }}
        >
          <InputLabel>Giới tính</InputLabel>
          <Select
            name="gender"
            value={employee.gender || ""}
            label="Giới tính"
            onChange={onChange}
          >
            <MenuItem value="male">Nam</MenuItem>
            <MenuItem value="female">Nữ</MenuItem>
            <MenuItem value="other">Khác</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Địa chỉ"
          name="address"
          value={employee.address}
          onChange={onChange}
          InputProps={{ readOnly: isFieldReadOnly("address") }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="date"
          label="Ngày bắt đầu làm"
          name="employmentStartDate"
          value={employee.employmentStartDate}
          InputLabelProps={{ shrink: true }}
          onChange={onChange}
          InputProps={{ readOnly: isFieldReadOnly("employmentStartDate") }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Số điện thoại"
          name="phoneNumber"
          value={employee.phoneNumber}
          onChange={onChange}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber}
          required
          InputProps={{ readOnly: isFieldReadOnly("phoneNumber") }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={employee.email}
          onChange={onChange}
          error={!!errors.email}
          helperText={errors.email}
          required
          InputProps={{ readOnly: isFieldReadOnly("email") }}
        />
      </Grid>

      {mode === "create" && (
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Mật khẩu"
            name="password"
            type="password"
            value={employee.password}
            onChange={onChange}
            error={!!errors.password}
            helperText={errors.password}
            required
            InputProps={{ readOnly: isFieldReadOnly("password") }}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default EmployeeForm;
