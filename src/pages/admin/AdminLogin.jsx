import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, IconButton, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import { setupTokenExpirationCheck } from "@/utils/tokenUtils";
import { adminLogin } from "@/services/general/AuthService";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AdminLogin = () => {
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
      await adminLogin(formData.email, formData.password);

      setupTokenExpirationCheck();
      navigate(`/admin-verify-otp/${formData.email}`);

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đăng nhập thất bại! Vui lòng thử lại.";
      setErrors({ apiError: errorMessage });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4" >
          ĐĂNG NHẬP
        </Typography>
        <Typography align="center">Đăng nhập để sử dụng hệ thống SCMS</Typography>
        <Container maxWidth="xs">
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} margin="normal" required />
            <TextField fullWidth label="Mật khẩu" name="password" type={showPassword ? "text" : "password"} value={formData.password}
              onChange={handleChange} error={!!errors.password} helperText={errors.password} margin="normal" required
              InputProps={{
                endAdornment: (<InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>
                </InputAdornment>)
              }}
            />

            {errors.apiError && (
              <Typography className="api-error">{errors.apiError}</Typography>
            )}

            <Button type="submit" variant="contained" color="default" fullWidth style={{ marginTop: "10px", marginBottom: "10px" }}>Đăng nhập</Button>
          </form>
        </Container>
      </Paper>
    </Container>
  );
};

export default AdminLogin;
