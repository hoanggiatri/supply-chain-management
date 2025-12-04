import React, { useState } from "react";
import {
  Typography,
  Input,
  Button,
  Alert,
  Card,
  CardBody,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "@/services/general/AuthService";
import { getButtonProps } from "@/utils/buttonStyles";
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
      await forgotPassword(email);
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
    <Card className="w-full max-w-[28rem] shadow-2xl">
      <CardBody className="p-8">
        <div className="text-center mb-6">
          <Typography variant="h3" color="blue-gray" className="mb-2">
            Quên Mật Khẩu
          </Typography>
          <Typography className="text-gray-600 font-normal">
            Nhập email của bạn để nhận mã xác thực
          </Typography>
        </div>

        <form onSubmit={handleSubmit} className="text-left">
          {/* Email Field */}
          <div className="mb-3">
            <Input
              id="email"
              color="blue"
              size="lg"
              type="email"
              label="Email"
              value={email}
              onChange={handleChange}
              error={!!errors.email}
              className="w-full placeholder:opacity-100"
            />
            {errors.email && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.email}
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
            Gửi mã OTP
          </Button>

          {/* Back to Login Link */}
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              ← Quay lại đăng nhập
            </button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default ForgotPasswordForm;
