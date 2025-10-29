import React, { useState } from "react";
import { Container, Typography, Button, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createEmployee } from "@/services/general/EmployeeService";
import EmployeeForm from "@components/general/EmployeeForm"; // Đường dẫn tới file component con

const CreateEmployee = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    companyId: companyId,
    employeeCode: "",
    employeeName: "",
    position: "",
    gender: "",
    address: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    employmentStartDate: "",
    departmentId: "",
    password: "",
  });

  const validateForm = () => {
    const errors = {};
    if (!formData.departmentId) errors.departmentId = "Bộ phận không được để trống";
    if (!formData.position?.trim()) errors.position = "Chức vụ không được để trống";
    if (!formData.employeeCode?.trim()) errors.employeeCode = "Mã nhân viên không được để trống";
    if (!formData.employeeName?.trim()) errors.employeeName = "Họ và tên không được để trống";
    if (!formData.email?.trim()) {
      errors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }
    if (!formData.phoneNumber?.trim()) errors.phoneNumber = "SĐT không được để trống";
    else if (!/^\d{10,11}$/.test(formData.phoneNumber)) errors.phoneNumber = "SĐT không hợp lệ";
    if (!formData.password.trim()) errors.password = "Mật khẩu không được để trống";
    else if (formData.password.length < 8) errors.password = "Mật khẩu phải ≥ 8 ký tự";
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await createEmployee(formData, token);
      alert("Tạo nhân viên thành công!");
      navigate("/employees");
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi tạo nhân viên!");
    }
  };

  const handleCancel = () => {
    navigate("/employees");
  };

  return (
    <Container>
      <Paper className="paper-container" elevation={3} >
        <Typography className="page-title" variant="h4" >
          THÊM MỚI NHÂN VIÊN
        </Typography>

        <EmployeeForm employee={formData} onChange={handleChange} errors={errors} readOnlyFields={{}} mode="create" />

        <Grid container spacing={2} mt={3} justifyContent="flex-end">
          <Grid item>
            <Button variant="contained" color="default" onClick={handleSubmit}>Thêm</Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="default" onClick={handleCancel}>Hủy</Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CreateEmployee;
