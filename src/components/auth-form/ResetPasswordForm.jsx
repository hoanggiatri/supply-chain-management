import React, { useState, useEffect } from "react";
import { Typography, Input, Button, Alert, Card, CardBody } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { resetPassword } from "@/services/general/AuthService";
import { getButtonProps } from "@/utils/buttonStyles";
import { useNavigate } from "react-router-dom";
import toastrService from "@/services/toastrService";

const ResetPasswordForm = () => {
  const [formData, setFormData] = useState({ email: "", newPassword: "" });
  const [errors, setErrors] = useState({});
  const [passwordShown, setPasswordShown] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setPasswordShown((cur) => !cur);

  useEffect(() => {
    const storedEmail = localStorage.getItem("forgotEmail");
    if (storedEmail) {
      setFormData((prevData) => ({ ...prevData, email: storedEmail }));
    }
  }, []);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    if (errors[event.target.name]) {
      setErrors({ ...errors, [event.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    if (!formData.newPassword)
      newErrors.newPassword = "Vui lòng nhập mật khẩu";
    if (formData.newPassword.length < 8)
      newErrors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự";
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
      toastrService.success("Đặt lại mật khẩu thành công!");
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Thay đổi thất bại! Vui lòng thử lại.";
      toastrService.error(errorMessage);
      setErrors({
        apiError: errorMessage,
      });
    }
  };

  return (
    <Card className="w-full max-w-[28rem] shadow-2xl">
      <CardBody className="p-8">
        <div className="text-center mb-6">
          <Typography variant="h3" color="blue-gray" className="mb-2">
            Đặt Lại Mật Khẩu
          </Typography>
          <Typography className="text-gray-600 font-normal">
            Nhập mật khẩu mới cho tài khoản của bạn
          </Typography>
        </div>

        <form onSubmit={handleSubmit} className="text-left">
          {/* Password Field */}
          <div className="mb-3">
            <div className="relative">
              <Input
                id="newPassword"
                size="lg"
                color="blue"
                name="newPassword"
                label="Mật khẩu mới"
                value={formData.newPassword}
                onChange={handleChange}
                error={!!errors.newPassword}
                className="w-full placeholder:opacity-100 pr-10"
                type={passwordShown ? "text" : "password"}
                containerProps={{ className: "min-w-0" }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="!absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer z-10"
              >
                {passwordShown ? (
                  <EyeIcon className="h-5 w-5 text-blue-gray-500" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5 text-blue-gray-500" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.newPassword}
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
            Đặt lại mật khẩu
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

export default ResetPasswordForm;
