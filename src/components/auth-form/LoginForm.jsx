import { login } from "@/services/general/AuthService";
import { getCompanyById } from "@/services/general/CompanyService";
import { getDepartmentById } from "@/services/general/DepartmentService";
import { getEmployeeById } from "@/services/general/EmployeeService";
import { getButtonProps } from "@/utils/buttonStyles";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import {
    Alert,
    Button,
    Card,
    CardBody,
    Input,
    Typography,
} from "@material-tailwind/react";
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

      // Thiết lập kiểm tra hết hạn token
      setupTokenExpirationCheck(navigate);

      // Điều hướng theo vai trò và bộ phận
      if (role === "user") {
        const dept = departmentName?.toLowerCase() || '';
        
        // Route to marketplace-v2 based on department
        if (dept.includes('kho') || dept.includes('warehouse')) {
          navigate("/marketplace-v2/warehouse");
        } else if (dept.includes('mua') || dept.includes('purchasing') || dept.includes('procurement')) {
          navigate("/marketplace-v2/dashboard");
        } else if (dept.includes('bán') || dept.includes('ban') || dept.includes('sales')) {
          navigate("/marketplace-v2/dashboard");
        } else {
          // Default fallback for user role
          navigate("/marketplace-v2/dashboard");
        }
      } else {
        // Admin or other roles go to homepage
        navigate("/homepage");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Đăng nhập thất bại! Vui lòng thử lại.";
      setErrors({ apiError: errorMessage });
    }
  };

  return (
    <Card className="w-full max-w-[28rem] shadow-2xl">
      <CardBody className="p-8">
        <div className="text-center mb-6">
          <Typography variant="h3" color="blue-gray" className="mb-2">
            Đăng Nhập
          </Typography>
          <Typography className="text-gray-600 font-normal">
            Đăng nhập để sử dụng hệ thống SCMS
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

          {/* Password Field */}
          <div className="mb-3">
            <div className="relative">
              <Input
                id="password"
                color="blue"
                size="lg"
                name="password"
                label="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                className="w-full placeholder:opacity-100 pr-10"
                type={passwordShown ? "text" : "password"}
                containerProps={{
                  className: "min-w-0",
                }}
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

          {/* API Error Alert */}
          {errors.apiError && (
            <Alert color="red" className="mb-4">
              {errors.apiError}
            </Alert>
          )}

          {/* Login Button */}
          <Button
            type="submit"
            size="lg"
            className="mt-4"
            fullWidth
            {...getButtonProps("primary")}
          >
            Đăng nhập
          </Button>

          {/* Forgot Password Link */}
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Register Link */}
          <Typography
            variant="small"
            color="gray"
            className="mt-3 text-center font-normal"
          >
            Chưa có tài khoản?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Đăng ký ngay
            </button>
          </Typography>
        </form>
      </CardBody>
    </Card>
  );
};

export default LoginForm;
