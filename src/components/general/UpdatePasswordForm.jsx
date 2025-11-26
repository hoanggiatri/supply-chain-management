import React, { useState } from "react";
import {
  Button as MTButton,
  Card,
  CardBody,
  Input,
  Typography,
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { updatePassword } from "@/services/general/UserService";
import toastrService from "@/services/toastrService";

const UpdatePasswordForm = ({ userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.currentPassword.trim())
      errors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    if (!formData.newPassword.trim())
      errors.newPassword = "Vui lòng nhập mật khẩu mới";
    if (formData.newPassword.length < 8)
      errors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự";
    if (!formData.confirmPassword.trim())
      errors.confirmPassword = "Vui lòng nhập xác nhận mật khẩu";
    if (formData.confirmPassword !== formData.newPassword)
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const request = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };
      await updatePassword(userId, request, token);
      toastrService.success("Đổi mật khẩu thành công!");
      onSuccess?.();
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Đổi mật khẩu thất bại!"
      );
    }
  };

  return (
    <Card className="mt-4 shadow-lg">
      <CardBody className="space-y-4">
        <Typography variant="h5" color="blue-gray">
          THAY ĐỔI MẬT KHẨU
        </Typography>

        {/* Mật khẩu hiện tại */}
        <div>
          <div className="relative">
            <Input
              label="Mật khẩu hiện tại"
              name="currentPassword"
              type={showCurrent ? "text" : "password"}
              color="blue"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full placeholder:opacity-100 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((prev) => !prev)}
              className="!absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer z-10"
            >
              {showCurrent ? (
                <EyeSlashIcon className="h-5 w-5 text-blue-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-blue-gray-500" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <Typography variant="small" color="red" className="mt-1">
              {errors.currentPassword}
            </Typography>
          )}
        </div>

        {/* Mật khẩu mới */}
        <div>
          <div className="relative">
            <Input
              label="Mật khẩu mới"
              name="newPassword"
              type={showNew ? "text" : "password"}
              color="blue"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full placeholder:opacity-100 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNew((prev) => !prev)}
              className="!absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer z-10"
            >
              {showNew ? (
                <EyeSlashIcon className="h-5 w-5 text-blue-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-blue-gray-500" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <Typography variant="small" color="red" className="mt-1">
              {errors.newPassword}
            </Typography>
          )}
        </div>

        {/* Xác nhận mật khẩu mới */}
        <div>
          <div className="relative">
            <Input
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              color="blue"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full placeholder:opacity-100 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="!absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer z-10"
            >
              {showConfirm ? (
                <EyeSlashIcon className="h-5 w-5 text-blue-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-blue-gray-500" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <Typography variant="small" color="red" className="mt-1">
              {errors.confirmPassword}
            </Typography>
          )}
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <MTButton
            type="button"
            variant="outlined"
            color="blue-gray"
            onClick={onSuccess}
          >
            Hủy
          </MTButton>
          <MTButton
            type="button"
            variant="filled"
            color="blue"
            onClick={handleSubmit}
          >
            Cập nhật mật khẩu
          </MTButton>
        </div>
      </CardBody>
    </Card>
  );
};

export default UpdatePasswordForm;
