import React, { useState } from "react";
import { Typography, Input, Button, Alert } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { sendVerifyOtp } from "@/services/general/AuthService";
import toastrService from "@/services/toastrService";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Email không hợp lệ";
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
      toastrService.success("Kiểm tra email để nhận mã OTP.");
      navigate("/verify-forgot-password-otp");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Không thể gửi OTP! Vui lòng thử lại.";
      toastrService.error(errorMessage);
      setErrors({
        apiError: errorMessage,
      });
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({ ...errors, email: "" });
    }
  };

  return (
    <div className="mx-auto max-w-[24rem]">
      <Typography variant="h3" color="blue-gray" className="mb-2">
        Quên Mật Khẩu
      </Typography>
      <Typography className="mb-8 text-gray-600 font-normal text-[18px]">
        Nhập email của bạn để nhận mã xác thực
      </Typography>

      <form onSubmit={handleSubmit} className="text-left">
        {/* Email Field */}
        <div className="mb-6">
          <label htmlFor="email">
            <Typography
              variant="small"
              className="mb-2 block font-medium text-gray-900"
            >
              Email
            </Typography>
          </label>
          <Input
            id="email"
            color="gray"
            size="lg"
            type="email"
            placeholder="name@mail.com"
            value={email}
            onChange={handleChange}
            error={!!errors.email}
            className="w-full placeholder:opacity-100 !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "hidden",
            }}
          />
          {errors.email && (
            <Typography variant="small" color="red" className="mt-2">
              {errors.email}
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
          Gửi mã OTP
        </Button>

        {/* Back to Login Link */}
        <Typography
          variant="small"
          color="gray"
          className="!mt-4 text-center font-normal"
        >
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-medium text-gray-900 hover:text-blue-500"
          >
            Quay lại đăng nhập
          </button>
        </Typography>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
