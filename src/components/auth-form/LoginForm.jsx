import { login } from "@/services/general/AuthService";
import { getCompanyById } from "@/services/general/CompanyService";
import { getDepartmentById } from "@/services/general/DepartmentService";
import { getEmployeeById } from "@/services/general/EmployeeService";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { Alert, Button, Input, Typography } from "@material-tailwind/react";
import { setupTokenExpirationCheck } from "@utils/tokenUtils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [passwordShown, setPasswordShown] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setPasswordShown((cur) => !cur);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    // Clear error for this field when user starts typing
    if (errors[event.target.name]) {
      setErrors({ ...errors, [event.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    if (!formData.password) newErrors.password = "Vui lòng nhập mật khẩu";
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    localStorage.clear();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const response = await login(formData);

      const { accessToken, role, employeeId } = response;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("role", role);
      localStorage.setItem("employeeId", employeeId);

      const employeeData = await getEmployeeById(employeeId, accessToken);
      const { departmentId, departmentName, employeeName } = employeeData;
      localStorage.setItem("departmentId", departmentId);
      localStorage.setItem("departmentName", departmentName);
      localStorage.setItem("employeeName", employeeName);

      const departmentData = await getDepartmentById(departmentId, accessToken);
      const { companyId } = departmentData;
      localStorage.setItem("companyId", companyId);

      const companyData = await getCompanyById(companyId, accessToken);
      const { companyType, address } = companyData;
      localStorage.setItem("companyType", companyType);
      localStorage.setItem("companyAddress", address);
      setupTokenExpirationCheck();
      navigate("/homepage");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Đăng nhập thất bại! Vui lòng thử lại.";
      setErrors({ apiError: errorMessage });
    }
  };

  const inputClasses = (hasError) =>
    [
      "w-full",
      "placeholder:opacity-100",
      "!border-t-blue-gray-200",
      "focus:!border-t-gray-900",
      hasError ? "!border-t-red-500 focus:!border-t-red-500" : "",
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <div className="mx-auto max-w-[24rem]">
      <Typography variant="h3" color="blue-gray" className="mb-2">
        Đăng Nhập
      </Typography>
      <Typography className="mb-8 text-gray-600 font-normal text-[18px]">
        Đăng nhập để sử dụng hệ thống SCMS
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
            name="email"
            placeholder="name@mail.com"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            className={inputClasses(Boolean(errors.email))}
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

        {/* Password Field */}
        <div className="mb-6">
          <label htmlFor="password">
            <Typography
              variant="small"
              className="mb-2 block font-medium text-gray-900"
            >
              Mật khẩu
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
              labelProps={{
                className: "hidden",
              }}
              className={`${inputClasses(Boolean(errors.password))} pr-10`}
              type={passwordShown ? "text" : "password"}
              containerProps={{
                className: "min-w-0",
              }}
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

        {/* API Error Alert */}
        {errors.apiError && (
          <Alert color="red" className="mb-6">
            {errors.apiError}
          </Alert>
        )}

        {/* Login Button */}
        <Button type="submit" color="gray" size="lg" className="mt-6" fullWidth>
          Đăng nhập
        </Button>

        {/* Forgot Password Link */}
        <div className="!mt-4 flex justify-end">
          <Typography
            as="button"
            type="button"
            onClick={() => navigate("/forgot-password")}
            color="blue-gray"
            variant="small"
            className="font-medium cursor-pointer hover:text-blue-500"
          >
            Quên mật khẩu?
          </Typography>
        </div>

        {/* Register Link */}
        <Typography
          variant="small"
          color="gray"
          className="!mt-4 text-center font-normal"
        >
          Chưa có tài khoản?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="font-medium text-gray-900 hover:text-blue-500"
          >
            Đăng ký ngay
          </button>
        </Typography>
      </form>
    </div>
  );
};

export default LoginForm;
