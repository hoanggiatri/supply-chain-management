import { registerCompany } from "@/services/general/AuthService";
import toastrService from "@/services/toastrService";
import { getButtonProps } from "@/utils/buttonStyles";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Checkbox,
  Input,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <Card className="w-full max-w-4xl shadow-2xl">
      <CardBody className="p-8">
        <div className="text-center mb-6">
          <Typography variant="h3" color="blue-gray" className="mb-2">
            Đăng Ký
          </Typography>
          <Typography className="text-gray-600 font-normal">
            Đăng ký tài khoản để sử dụng hệ thống SCMS
          </Typography>
        </div>

        <form onSubmit={handleSubmit} className="text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company Name */}
          <div>
            <Input
              id="companyName"
              size="lg"
              color="blue"
              name="companyName"
              label="Tên công ty"
              value={formData.companyName}
              onChange={handleChange}
              error={!!errors.companyName}
              className="w-full placeholder:opacity-100"
            />
            {errors.companyName && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.companyName}
              </Typography>
            )}
          </div>

          {/* Tax Code */}
          <div>
            <Input
              id="taxCode"
              size="lg"
              color="blue"
              name="taxCode"
              label="Mã số thuế"
              value={formData.taxCode}
              onChange={handleChange}
              error={!!errors.taxCode}
              className="w-full placeholder:opacity-100"
            />
            {errors.taxCode && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.taxCode}
              </Typography>
            )}
          </div>

          {/* Address */}
          <div>
            <Input
              id="address"
              size="lg"
              color="blue"
              name="address"
              label="Địa chỉ"
              value={formData.address}
              onChange={handleChange}
              error={!!errors.address}
              className="w-full placeholder:opacity-100"
            />
            {errors.address && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.address}
              </Typography>
            )}
          </div>

          {/* Company Type */}
          <div>
            <Select
              id="companyType"
              size="lg"
              color="blue"
              label="Loại hình công ty"
              value={formData.companyType}
              onChange={handleSelectChange}
              error={!!errors.companyType}
              className="w-full"
            >
              <Option value="Doanh nghiệp sản xuất">
                Doanh nghiệp sản xuất
              </Option>
              <Option value="Doanh nghiệp thương mại">
                Doanh nghiệp thương mại
              </Option>
            </Select>
            {errors.companyType && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.companyType}
              </Typography>
            )}
          </div>

          {/* Main Industry */}
          <div>
            <Input
              id="mainIndustry"
              size="lg"
              color="blue"
              name="mainIndustry"
              label="Ngành nghề chính"
              value={formData.mainIndustry}
              onChange={handleChange}
              error={!!errors.mainIndustry}
              className="w-full placeholder:opacity-100"
            />
            {errors.mainIndustry && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.mainIndustry}
              </Typography>
            )}
          </div>

          {/* Representative Name */}
          <div>
            <Input
              id="representativeName"
              size="lg"
              color="blue"
              name="representativeName"
              label="Người đại diện"
              value={formData.representativeName}
              onChange={handleChange}
              error={!!errors.representativeName}
              className="w-full placeholder:opacity-100"
            />
            {errors.representativeName && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.representativeName}
              </Typography>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <Input
              id="phoneNumber"
              size="lg"
              color="blue"
              name="phoneNumber"
              label="Số điện thoại"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={!!errors.phoneNumber}
              className="w-full placeholder:opacity-100"
            />
            {errors.phoneNumber && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.phoneNumber}
              </Typography>
            )}
          </div>

          {/* Email */}
          <div>
            <Input
              id="email"
              size="lg"
              color="blue"
              type="email"
              name="email"
              label="Email"
              value={formData.email}
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

          {/* Employee Code */}
          <div>
            <Input
              id="employeeCode"
              size="lg"
              color="blue"
              name="employeeCode"
              label="Mã nhân viên"
              value={formData.employeeCode}
              onChange={handleChange}
              error={!!errors.employeeCode}
              className="w-full placeholder:opacity-100"
            />
            {errors.employeeCode && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.employeeCode}
              </Typography>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <Input
                id="password"
                size="lg"
                color="blue"
                name="password"
                label="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
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
            {errors.password && (
              <Typography variant="small" color="red" className="mt-1">
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
          size="lg"
          className="mt-6"
          fullWidth
          disabled={!formData.termsAccepted}
          {...getButtonProps("primary")}
        >
          Đăng ký
        </Button>

        {/* Login Link */}
        <Typography
          variant="small"
          color="gray"
          className="mt-3 text-center font-normal"
        >
          Đã có tài khoản?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Đăng nhập
          </button>
        </Typography>
        </form>
      </CardBody>
    </Card>
  );
};

export default RegisterForm;
