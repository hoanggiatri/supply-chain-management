import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { updatePassword } from "@/services/general/UserService";
import toastrService from "@/services/toastrService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const request = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };
      await updatePassword(userId, request, token);
      toastrService.success("Đổi mật khẩu thành công!");

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});

      onSuccess?.();
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Đổi mật khẩu thất bại!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Thay đổi mật khẩu
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mật khẩu hiện tại */}
        <div className="space-y-2">
          <Label htmlFor="currentPassword">
            Mật khẩu hiện tại <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="currentPassword"
              name="currentPassword"
              type={showCurrent ? "text" : "password"}
              value={formData.currentPassword}
              onChange={handleChange}
              error={errors.currentPassword}
              placeholder="Nhập mật khẩu hiện tại"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showCurrent ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-sm text-red-500">{errors.currentPassword}</p>
          )}
        </div>

        {/* Mật khẩu mới */}
        <div className="space-y-2">
          <Label htmlFor="newPassword">
            Mật khẩu mới <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="newPassword"
              name="newPassword"
              type={showNew ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
              placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNew((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showNew ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-sm text-red-500">{errors.newPassword}</p>
          )}
        </div>

        {/* Xác nhận mật khẩu mới */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            Xác nhận mật khẩu mới <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Nhập lại mật khẩu mới"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePasswordForm;
