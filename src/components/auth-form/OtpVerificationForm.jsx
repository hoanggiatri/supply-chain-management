import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { verifyOtp, sendVerifyOtp } from "@/services/general/AuthService";
import { useNavigate } from "react-router-dom";

const OtpVerificationForm = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("registeredEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (event) => {
    setOtp(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (otp.length !== 6) {
      setErrors({ otp: "OTP phải có 6 chữ số" });
      return;
    }

    try {
      verifyOtp({email, otp});
      alert("Xác thực thành công!");
      navigate("/login");

    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        apiError: error.response?.data?.message || "Mã OTP không đúng. Vui lòng thử lại!",
      }));
    }
  };

  const handleResendOtp = async () => {
    try {
      await sendVerifyOtp(email);
      alert("Mã OTP đã được gửi lại!");
      setResendTimer(60);
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        apiError: error.response?.data?.message || "Lỗi khi gửi lại OTP. Vui lòng thử lại!",
      }));
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography align="center">Mã xác thực đã được gửi đến email. Vui lòng kiểm tra email và nhập chính xác mã vào ô dưới.</Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Nhập OTP" name="otp" value={otp} onChange={handleChange} error={!!errors.otp} helperText={errors.otp} margin="normal" required />

        {errors.apiError && (
          <Typography className="api-error">{errors.apiError}</Typography>
        )}

        <Button type="submit" variant="contained" color="default" fullWidth style={{ marginTop: "10px" }}>
          Xác nhận
        </Button>
        <Typography align="center" sx={{ mt: 1 }}>
          Bạn chưa nhận được OTP?<Button color="default" onClick={handleResendOtp} disabled={resendTimer > 0}>{resendTimer > 0 ? `Gửi lại OTP (${resendTimer}s)` : "Gửi lại OTP"}</Button>
        </Typography>
      </form>
    </Container>
  );
};

export default OtpVerificationForm;
