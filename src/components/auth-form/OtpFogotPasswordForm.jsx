import React, { useState, useEffect } from "react";
import { Typography, Input, Button, Alert, Card, CardBody } from "@material-tailwind/react";
import {
  verifyForgotPasswordOtp,
  sendVerifyOtp,
} from "@/services/general/AuthService";
import { getButtonProps } from "@/utils/buttonStyles";
import { useNavigate } from "react-router-dom";
import toastrService from "@/services/toastrService";

const OtpForgotPasswordForm = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("forgotEmail");
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
    const onlyDigits = event.target.value.replace(/\D/g, "");
    setOtp(onlyDigits.slice(0, 6));
    if (errors.otp) {
      setErrors({ ...errors, otp: "" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      setErrors({ otp: "OTP phải có 6 chữ số" });
      return;
    }

    try {
      await verifyForgotPasswordOtp({ email, otp });
      toastrService.success("Xác thực thành công!");
      navigate("/reset-password");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Xác thực thất bại! Vui lòng thử lại.";
      toastrService.error(errorMessage);
      setErrors((prevErrors) => ({
        ...prevErrors,
        apiError: errorMessage,
      }));
    }
  };

  const handleResendOtp = async () => {
    try {
      await sendVerifyOtp(email);
      toastrService.success("Mã OTP đã được gửi lại!");
      setResendTimer(60);
    } catch (error) {
      toastrService.error(
        error.response?.data?.message ||
          "Lỗi khi gửi lại OTP. Vui lòng thử lại!"
      );
    }
  };

  return (
    <Card className="w-full max-w-[28rem] shadow-2xl">
      <CardBody className="p-8">
        <div className="text-center mb-6">
          <Typography variant="h3" color="blue-gray" className="mb-2">
            Xác Thực OTP
          </Typography>
          <Typography className="text-gray-600 font-normal">
            Mã xác thực đã được gửi đến email. Vui lòng kiểm tra và nhập mã.
          </Typography>
        </div>

        <form onSubmit={handleSubmit} className="text-left">
          {/* OTP Field */}
          <div className="mb-3">
            <Input
              id="otp"
              color="blue"
              size="lg"
              type="text"
              label="Mã OTP (6 chữ số)"
              value={otp}
              onChange={handleChange}
              error={!!errors.otp}
              maxLength={6}
              className="w-full placeholder:opacity-100 tracking-widest text-center text-2xl"
            />
            {errors.otp && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.otp}
              </Typography>
            )}
          </div>

          {/* API Error Alert */}
          {errors.apiError && (
            <Alert color="red" className="mb-4">
              {errors.apiError}
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="mt-4"
            fullWidth
            {...getButtonProps("primary")}
          >
            Xác nhận
          </Button>

          {/* Resend OTP */}
          <Typography
            variant="small"
            color="gray"
            className="mt-3 text-center font-normal"
          >
            Bạn chưa nhận được OTP?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendTimer > 0}
              className={`font-medium ${
                resendTimer > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:text-blue-700 transition-colors"
              }`}
            >
              {resendTimer > 0 ? `Gửi lại OTP (${resendTimer}s)` : "Gửi lại OTP"}
            </button>
          </Typography>
        </form>
      </CardBody>
    </Card>
  );
};

export default OtpForgotPasswordForm;
