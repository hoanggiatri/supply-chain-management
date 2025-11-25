import React, { useState, useEffect } from "react";
import { Typography, Input, Button, Alert } from "@material-tailwind/react";
import { verifyOtp, sendVerifyOtp } from "@/services/general/AuthService";
import { useNavigate } from "react-router-dom";
import toastrService from "@/services/toastrService";

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
      await verifyOtp({ email, otp: Number(otp) });
      toastrService.success("Xác thực thành công!");
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Mã OTP không đúng. Vui lòng thử lại!";
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
      const errorMessage =
        error.response?.data?.message ||
        "Lỗi khi gửi lại OTP. Vui lòng thử lại!";
      toastrService.error(errorMessage);
      setErrors((prevErrors) => ({
        ...prevErrors,
        apiError: errorMessage,
      }));
    }
  };

  return (
    <div className="mx-auto max-w-[24rem]">
      <Typography variant="h3" color="blue-gray" className="mb-2">
        Xác Thực OTP
      </Typography>
      <Typography className="mb-8 text-gray-600 font-normal text-[18px]">
        Mã xác thực đã được gửi đến email. Vui lòng kiểm tra email và nhập
        chính xác mã vào ô dưới.
      </Typography>

      <form onSubmit={handleSubmit} className="text-left">
        {/* OTP Field */}
        <div className="mb-6">
          <label htmlFor="otp">
            <Typography
              variant="small"
              className="mb-2 block font-medium text-gray-900"
            >
              Mã OTP (6 chữ số)
            </Typography>
          </label>
          <Input
            id="otp"
            color="gray"
            size="lg"
            type="text"
            placeholder="123456"
            value={otp}
            onChange={handleChange}
            error={!!errors.otp}
            maxLength={6}
            className="w-full placeholder:opacity-100 !border-t-blue-gray-200 focus:!border-t-gray-900 tracking-widest text-center text-2xl"
            labelProps={{
              className: "hidden",
            }}
          />
          {errors.otp && (
            <Typography variant="small" color="red" className="mt-2">
              {errors.otp}
            </Typography>
          )}
        </div>

        {/* API Error Alert */}
        {errors.apiError && (
          <Alert color="red" className="mb-6">
            {errors.apiError}
          </Alert>
        )}

        {/* Submit Button */}
        <Button type="submit" color="gray" size="lg" className="mt-6" fullWidth>
          Xác nhận
        </Button>

        {/* Resend OTP */}
        <Typography
          variant="small"
          color="gray"
          className="!mt-4 text-center font-normal"
        >
          Bạn chưa nhận được OTP?{" "}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendTimer > 0}
            className={`font-medium ${
              resendTimer > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-900 hover:text-blue-500"
            }`}
          >
            {resendTimer > 0 ? `Gửi lại OTP (${resendTimer}s)` : "Gửi lại OTP"}
          </button>
        </Typography>
      </form>
    </div>
  );
};

export default OtpVerificationForm;
