import React, { useState } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { sendVerifyOtp } from "@/services/general/AuthService";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email không hợp lệ";
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
      await sendVerifyOtp(email);
      localStorage.setItem("forgotEmail", email);
      const storedEmail = localStorage.getItem("forgotEmail");

      alert("Kiểm tra email để nhận mã OTP.");
      navigate("/verify-forgot-password-otp");

      console.log(storedEmail);
    } catch (error) {
      setErrors({
        apiError: error.response?.data?.message || "Không thể gửi OTP! Vui lòng thử lại.",
      });
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography align="center">Nhập email của bạn để nhận mã xác thực</Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} error={!!errors.email} helperText={errors.email} margin="normal" required />

        {errors.apiError && (
          <Typography className="api-error">{errors.apiError}</Typography>
        )}

        <Button type="submit" variant="contained" color="default" fullWidth sx={{ mt: 2 }}>
          Gửi mã OTP
        </Button>
        <Typography align="center" sx={{ mt: 1 }}>
          <Button color="default" onClick={() => navigate("/login")}>
            Quay lại đăng nhập
          </Button>
        </Typography>
      </form>
    </Container>
  );
};

export default ForgotPasswordForm;
