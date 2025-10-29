import React, { useState } from "react";
import { Container, TextField, Button, Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { login } from "@/services/general/AuthService";
import { getEmployeeById } from "@/services/general/EmployeeService";
import { getDepartmentById } from "@/services/general/DepartmentService";
import { getCompanyById } from "@/services/general/CompanyService";
import { useNavigate } from "react-router-dom";
import { setupTokenExpirationCheck } from "@utils/tokenUtils";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ";
    if (!formData.password) newErrors.password = "Vui lòng nhập mật khẩu";
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    localStorage.clear();
  
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    setErrors({});
  
    try {
      const response = await login(formData);
  
      const { token, role, employeeId} = response;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("employeeId", employeeId);
  
      const employeeData = await getEmployeeById(employeeId, token);
      const { departmentId, departmentName, employeeName } = employeeData;
      localStorage.setItem("departmentId", departmentId);
      localStorage.setItem("departmentName", departmentName);
      localStorage.setItem("employeeName", employeeName);
  
      const departmentData = await getDepartmentById(departmentId, token);
      const { companyId } = departmentData;
      localStorage.setItem("companyId", companyId);
  
      const companyData = await getCompanyById(companyId, token);
      const { companyType, address } = companyData;
      localStorage.setItem("companyType", companyType);
      localStorage.setItem("companyAddress", address);
      setupTokenExpirationCheck();
      navigate("/homepage");
  
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đăng nhập thất bại! Vui lòng thử lại.";
      setErrors({ apiError: errorMessage });
    }
  };
  

  return (
    <Container maxWidth="xs">
      <Typography align="center">Đăng nhập để sử dụng hệ thống SCMS</Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} margin="normal" required />
        <TextField fullWidth label="Mật khẩu" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} margin="normal" required InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />

        {errors.apiError && (
          <Typography className="api-error">{errors.apiError}</Typography>
        )}

        <Button type="submit" variant="contained" color="default" fullWidth style={{ marginTop: "10px" }}>Đăng nhập</Button>
        <Typography align="center" sx={{ mt: 1 }}>
          <Button color="default" onClick={() => navigate("/register")}>Đăng ký</Button> | <Button color="default" onClick={() => navigate("/forgot-password")}>Quên mật khẩu?</Button>
        </Typography>
      </form>
    </Container>
  );
};

export default LoginForm;