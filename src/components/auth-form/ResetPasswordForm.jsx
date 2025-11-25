import React, { useState, useEffect } from "react";
import { Typography, Input, Button, Alert } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { resetPassword } from "@/services/general/AuthService";
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
    <div className="mx-auto max-w-[24rem]">
      <Typography variant="h3" color="blue-gray" className="mb-2">
        Đặt Lại Mật Khẩu
      </Typography>
      <Typography className="mb-8 text-gray-600 font-normal text-[18px]">
        Nhập mật khẩu mới cho tài khoản của bạn
      </Typography>

      <form onSubmit={handleSubmit} className="text-left">
        {/* Password Field */}
        <div className="mb-6">
          <label htmlFor="newPassword">
            <Typography
              variant="small"
              className="mb-2 block font-medium text-gray-900"
            >
              Mật khẩu mới
            </Typography>
          </label>
          <div className="relative">
            <Input
              id="newPassword"
              size="lg"
              name="newPassword"
              placeholder="********"
              value={formData.newPassword}
              onChange={handleChange}
              error={!!errors.newPassword}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 pr-10"
              type={passwordShown ? "text" : "password"}
              labelProps={{ className: "hidden" }}
              containerProps={{ className: "min-w-0" }}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="!absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {passwordShown ? (
                <EyeIcon className="h-5 w-5 text-blue-gray-500" />
              ) : (
                <EyeSlashIcon className="h-5 w-5 text-blue-gray-500" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <Typography variant="small" color="red" className="mt-2">
              {errors.newPassword}
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
          Đặt lại mật khẩu
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

export default ResetPasswordForm;
