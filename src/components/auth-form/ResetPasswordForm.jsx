import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { resetPassword } from "@/services/general/AuthService";
import { useNavigate } from "react-router-dom";

const ResetPasswordForm = () => {
  const [formData, setFormData] = useState({ email: "", newPassword: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("forgotEmail");
    if (storedEmail) {
      setFormData((prevData) => ({ ...prevData, email: storedEmail }));
    }
  }, []);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ";
    if (!formData.newPassword) newErrors.newPassword = "Vui lòng nhập mật khẩu";
    if (formData.newPassword.length < 8) errors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự";
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      await resetPassword(formData);
      alert("Đặt lại mật khẩu thành công!");
      navigate("/login");
    } catch (error) {
      setErrors({
        apiError: error.response?.data?.message || "Thay đổi thất bại! Vui lòng thử lại.",
      });
    }
  };

  return (
    <Container maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Mật khẩu mới" name="newPassword" type={showPassword ? "text" : "password"} value={formData.newPassword} onChange={handleChange} error={!!errors.newPassword} helperText={errors.newPassword} margin="normal" required InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />

        {errors.apiError && (
          <Typography className="api-error">{errors.apiError}</Typography>
        )}

        <Button type="submit" variant="contained" color="default" fullWidth style={{ marginTop: "10px" }}>Đặt lại mật khẩu</Button>
        <Typography align="center" sx={{ mt: 1 }}>
          <Button color="default" onClick={() => navigate("/login")}>Quay lại Đăng nhập</Button>
        </Typography>
      </form>
    </Container>
  );
};

export default ResetPasswordForm;