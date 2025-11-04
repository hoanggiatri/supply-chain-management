import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Container,
  Typography,
  MenuItem,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { registerCompany } from "@/services/general/AuthService";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    taxCode: "",
    address: "",
    companyType: "",
    mainIndustry: "",
    representativeName: "",
    phoneNumber: "",
    email: "",
    employeeCode: "",
    password: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.companyName.trim())
      errors.companyName = "Tên công ty không được để trống";
    if (!formData.taxCode.trim()) errors.taxCode = "Mã số thuế là bắt buộc";
    if (!formData.address.trim())
      errors.address = "Địa chỉ không được để trống";
    if (!formData.companyType.trim())
      errors.companyType = "Loại hình công ty không được để trống";
    if (!formData.mainIndustry.trim())
      errors.mainIndustry = "Ngành chính không được để trống";
    if (!formData.representativeName.trim())
      errors.representativeName = "Người đại diện không được để trống";
    if (!formData.phoneNumber.trim())
      errors.phoneNumber = "Số điện thoại không được để trống";
    if (!/^\d{10,11}$/.test(formData.phoneNumber))
      errors.phoneNumber = "Số điện thoại không hợp lệ";
    if (!formData.email.trim()) errors.email = "Email không được để trống";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Email không hợp lệ";
    if (!formData.employeeCode.trim())
      errors.employeeCode = "Mã nhân viên không được để trống";
    if (!formData.password.trim())
      errors.password = "Mật khẩu không được để trống";
    if (formData.password.length < 8)
      errors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    if (!formData.termsAccepted)
      errors.termsAccepted = "Bạn phải đồng ý với điều khoản";
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      const { termsAccepted, ...payload } = formData;
      await registerCompany(payload);
      localStorage.setItem("registeredEmail", formData.email);
      alert("Đăng ký thành công! Kiểm tra email để nhận mã OTP.");
      navigate("/otp-verification");
    } catch (error) {
      setErrors({
        apiError:
          error.response?.data?.message ||
          "Đăng ký thất bại! Vui lòng thử lại.",
      });
    }
  };

  return (
    <Container maxWidth="lg" style={{ fontSize: "0.9rem" }}>
      <Typography align="center" sx={{ mb: 2 }}>
        Đăng ký tài khoản để sử dụng hệ thống SCMS
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tên công ty"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              error={!!errors.companyName}
              helperText={errors.companyName}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mã số thuế"
              name="taxCode"
              value={formData.taxCode}
              onChange={handleChange}
              error={!!errors.taxCode}
              helperText={errors.taxCode}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Địa chỉ"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={!!errors.address}
              helperText={errors.address}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Loại hình công ty"
              name="companyType"
              value={formData.companyType}
              onChange={handleChange}
              error={!!errors.companyType}
              helperText={errors.companyType}
              required
            >
              <MenuItem value="Doanh nghiệp sản xuất">
                Doanh nghiệp sản xuất
              </MenuItem>
              <MenuItem value="Doanh nghiệp thương mại">
                Doanh nghiệp thương mại
              </MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ngành nghề chính"
              name="mainIndustry"
              value={formData.mainIndustry}
              onChange={handleChange}
              error={!!errors.mainIndustry}
              helperText={errors.mainIndustry}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Người đại diện"
              name="representativeName"
              value={formData.representativeName}
              onChange={handleChange}
              error={!!errors.representativeName}
              helperText={errors.representativeName}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Số điện thoại"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mã nhân viên"
              name="employeeCode"
              value={formData.employeeCode}
              onChange={handleChange}
              error={!!errors.employeeCode}
              helperText={errors.employeeCode}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mật khẩu"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  sx={{
                    ml: 0.5,
                    "&.Mui-checked": {
                      color: "#05518b",
                    },
                    "&:hover": { backgroundColor: "transparent" },
                  }}
                />
              }
              label="Tôi đồng ý với điều khoản sử dụng"
            />
            {errors.termsAccepted && (
              <Typography color="error">{errors.termsAccepted}</Typography>
            )}
          </Grid>
          {errors.apiError && (
            <Grid item xs={12}>
              <Typography color="error">{errors.apiError}</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="default"
              fullWidth
              disabled={!formData.termsAccepted}
            >
              Đăng ký
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography align="center">
              Đã có tài khoản?{" "}
              <Button color="default" onClick={() => navigate("/login")}>
                Đăng nhập
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default RegisterForm;
