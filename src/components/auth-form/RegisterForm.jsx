import React, { useState } from "react";
import {
  Typography,
  Input,
  Button,
  Alert,
  Checkbox,
  Select,
  Option,
} from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { registerCompany } from "@/services/general/AuthService";
import { useNavigate } from "react-router-dom";
import toastrService from "@/services/toastrService";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    taxCode: "",
    address: "",
    companyType: "",
    mainIndustry: "",
    representativeName: "",
    phoneNumber: "",
    email: "",
    employeeCode: "",
    password: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisibility = () => setPasswordShown((cur) => !cur);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, companyType: value });
    if (errors.companyType) {
      setErrors({ ...errors, companyType: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName.trim())
      newErrors.companyName = "Tên công ty không được để trống";
    if (!formData.taxCode.trim()) newErrors.taxCode = "Mã số thuế là bắt buộc";
    if (!formData.address.trim())
      newErrors.address = "Địa chỉ không được để trống";
    if (!formData.companyType.trim())
      newErrors.companyType = "Loại hình công ty không được để trống";
    if (!formData.mainIndustry.trim())
      newErrors.mainIndustry = "Ngành chính không được để trống";
    if (!formData.representativeName.trim())
      newErrors.representativeName = "Người đại diện không được để trống";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Số điện thoại không được để trống";
    if (!/^\d{10,11}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    if (!formData.email.trim()) newErrors.email = "Email không được để trống";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    if (!formData.employeeCode.trim())
      newErrors.employeeCode = "Mã nhân viên không được để trống";
    if (!formData.password.trim())
      newErrors.password = "Mật khẩu không được để trống";
    if (formData.password.length < 8)
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    if (!formData.termsAccepted)
      newErrors.termsAccepted = "Bạn phải đồng ý với điều khoản";
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      const { termsAccepted, ...payload } = formData;
      await registerCompany(payload);
      localStorage.setItem("registeredEmail", formData.email);
      toastrService.success(
        "Kiểm tra email để nhận mã OTP.",
        "Đăng ký thành công!"
      );
      navigate("/otp-verification");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Đăng ký thất bại! Vui lòng thử lại.";
      toastrService.error(errorMessage);
      setErrors({
        apiError: errorMessage,
      });
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4">
      <Typography variant="h3" color="blue-gray" className="mb-2 text-center">
        Đăng Ký
      </Typography>
      <Typography className="mb-8 text-gray-600 font-normal text-center">
        Đăng ký tài khoản để sử dụng hệ thống SCMS
      </Typography>

      <form onSubmit={handleSubmit} className="text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name */}
          <div>
            <label htmlFor="companyName">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Tên công ty <span className="text-red-500">*</span>
              </Typography>
            </label>
            <Input
              id="companyName"
              size="lg"
              name="companyName"
              placeholder="Nhập tên công ty"
              value={formData.companyName}
              onChange={handleChange}
              error={!!errors.companyName}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{ className: "hidden" }}
            />
            {errors.companyName && (
              <Typography variant="small" color="red" className="mt-2">
                {errors.companyName}
              </Typography>
            )}
          </div>

          {/* Tax Code */}
          <div>
            <label htmlFor="taxCode">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Mã số thuế <span className="text-red-500">*</span>
              </Typography>
            </label>
            <Input
              id="taxCode"
              size="lg"
              name="taxCode"
              placeholder="Nhập mã số thuế"
              value={formData.taxCode}
              onChange={handleChange}
              error={!!errors.taxCode}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{ className: "hidden" }}
            />
            {errors.taxCode && (
              <Typography variant="small" color="red" className="mt-2">
                {errors.taxCode}
              </Typography>
            )}
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Địa chỉ <span className="text-red-500">*</span>
              </Typography>
            </label>
            <Input
              id="address"
              size="lg"
              name="address"
              placeholder="Nhập địa chỉ"
              value={formData.address}
              onChange={handleChange}
              error={!!errors.address}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{ className: "hidden" }}
            />
            {errors.address && (
              <Typography variant="small" color="red" className="mt-2">
                {errors.address}
              </Typography>
            )}
          </div>

          {/* Company Type */}
          <div>
            <label htmlFor="companyType">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Loại hình công ty <span className="text-red-500">*</span>
              </Typography>
            </label>
            <Select
              id="companyType"
              size="lg"
              value={formData.companyType}
              onChange={handleSelectChange}
              error={!!errors.companyType}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{ className: "hidden" }}
            >
              <Option value="Doanh nghiệp sản xuất">
                Doanh nghiệp sản xuất
              </Option>
              <Option value="Doanh nghiệp thương mại">
                Doanh nghiệp thương mại
              </Option>
            </Select>
            {errors.companyType && (
              <Typography variant="small" color="red" className="mt-2">
                {errors.companyType}
              </Typography>
            )}
          </div>

          {/* Main Industry */}
          <div>
            <label htmlFor="mainIndustry">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Ngành nghề chính <span className="text-red-500">*</span>
              </Typography>
            </label>
            <Input
              id="mainIndustry"
              size="lg"
              name="mainIndustry"
              placeholder="Nhập ngành nghề chính"
              value={formData.mainIndustry}
              onChange={handleChange}
              error={!!errors.mainIndustry}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{ className: "hidden" }}
            />
            {errors.mainIndustry && (
              <Typography variant="small" color="red" className="mt-2">
                {errors.mainIndustry}
              </Typography>
            )}
          </div>

          {/* Representative Name */}
          <div>
            <label htmlFor="representativeName">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Người đại diện <span className="text-red-500">*</span>
              </Typography>
            </label>
            <Input
              id="representativeName"
              size="lg"
              name="representativeName"
              placeholder="Nhập tên người đại diện"
              value={formData.representativeName}
              onChange={handleChange}
              error={!!errors.representativeName}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{ className: "hidden" }}
            />
            {errors.representativeName && (
              <Typography variant="small" color="red" className="mt-2">
                {errors.representativeName}
              </Typography>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Số điện thoại <span className="text-red-500">*</span>
              </Typography>
            </label>
            <Input
              id="phoneNumber"
              size="lg"
              name="phoneNumber"
              placeholder="Nhập số điện thoại"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={!!errors.phoneNumber}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{ className: "hidden" }}
            />
            {errors.phoneNumber && (
              <Typography variant="small" color="red" className="mt-2">
                {errors.phoneNumber}
              </Typography>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Email <span className="text-red-500">*</span>
              </Typography>
            </label>
            <Input
              id="email"
              size="lg"
              type="email"
              name="email"
              placeholder="name@mail.com"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{ className: "hidden" }}
            />
            {errors.email && (
              <Typography variant="small" color="red" className="mt-2">
                {errors.email}
              </Typography>
            )}
          </div>

          {/* Employee Code */}
          <div>
            <label htmlFor="employeeCode">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Mã nhân viên <span className="text-red-500">*</span>
              </Typography>
            </label>
            <Input
              id="employeeCode"
              size="lg"
              name="employeeCode"
              placeholder="Nhập mã nhân viên"
              value={formData.employeeCode}
              onChange={handleChange}
              error={!!errors.employeeCode}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{ className: "hidden" }}
            />
            {errors.employeeCode && (
              <Typography variant="small" color="red" className="mt-2">
                {errors.employeeCode}
              </Typography>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Mật khẩu <span className="text-red-500">*</span>
              </Typography>
            </label>
            <div className="relative">
              <Input
                id="password"
                size="lg"
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
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
            {errors.password && (
              <Typography variant="small" color="red" className="mt-2">
                {errors.password}
              </Typography>
            )}
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="mt-6">
          <Checkbox
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            label={
              <Typography variant="small" color="gray" className="flex font-normal">
                Tôi đồng ý với điều khoản sử dụng
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          {errors.termsAccepted && (
            <Typography variant="small" color="red" className="mt-2">
              {errors.termsAccepted}
            </Typography>
          )}
        </div>

        {/* API Error Alert */}
        {errors.apiError && (
          <Alert color="red" className="mt-6">
            {errors.apiError}
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          color="gray"
          size="lg"
          className="mt-6"
          fullWidth
          disabled={!formData.termsAccepted}
        >
          Đăng ký
        </Button>

        {/* Login Link */}
        <Typography
          variant="small"
          color="gray"
          className="!mt-4 text-center font-normal"
        >
          Đã có tài khoản?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-medium text-gray-900 hover:text-blue-500"
          >
            Đăng nhập
          </button>
        </Typography>
      </form>
    </div>
  );
};

export default RegisterForm;
