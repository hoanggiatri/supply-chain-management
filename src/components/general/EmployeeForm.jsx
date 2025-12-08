import React, { useEffect, useState } from "react";
import { getAllDepartmentsInCompany } from "@/services/general/DepartmentService";
import toastrService from "@/services/toastrService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EmployeeForm = ({
  employee,
  onChange,
  errors = {},
  readOnlyFields = {},
  mode,
}) => {
  const [departments, setDepartments] = useState([]);
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const isFieldReadOnly = (field) => readOnlyFields[field] ?? false;

  const handleSelectChange = (name, value) => {
    onChange({
      target: {
        name,
        value,
      },
    });
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getAllDepartmentsInCompany(companyId, token);
        setDepartments(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Có lỗi khi lấy bộ phận!"
        );
      }
    };
    fetchDepartments();
  }, [companyId, token]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Bộ phận */}
      <div className="space-y-2">
        <Label htmlFor="departmentId">
          Bộ phận <span className="text-red-500">*</span>
        </Label>
        <Select
          value={employee.departmentId || ""}
          onValueChange={(val) => handleSelectChange("departmentId", val)}
          disabled={isFieldReadOnly("departmentId")}
        >
          <SelectTrigger
            className={errors.departmentId ? "border-red-500" : ""}
          >
            <SelectValue placeholder="Chọn bộ phận" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.departmentCode} - {dept.departmentName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.departmentId && (
          <p className="text-sm text-red-500">{errors.departmentId}</p>
        )}
      </div>

      {/* Chức vụ */}
      <div className="space-y-2">
        <Label htmlFor="position">Chức vụ</Label>
        <Select
          value={employee.position || ""}
          onValueChange={(val) => handleSelectChange("position", val)}
          disabled={isFieldReadOnly("position")}
        >
          <SelectTrigger className={errors.position ? "border-red-500" : ""}>
            <SelectValue placeholder="Chọn chức vụ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Quản lý">Quản lý</SelectItem>
            <SelectItem value="Nhân viên">Nhân viên</SelectItem>
          </SelectContent>
        </Select>
        {errors.position && (
          <p className="text-sm text-red-500">{errors.position}</p>
        )}
      </div>

      {/* Mã nhân viên */}
      <div className="space-y-2">
        <Label htmlFor="employeeCode">
          Mã nhân viên <span className="text-red-500">*</span>
        </Label>
        <Input
          id="employeeCode"
          name="employeeCode"
          value={employee.employeeCode || ""}
          onChange={onChange}
          readOnly={isFieldReadOnly("employeeCode")}
          disabled={isFieldReadOnly("employeeCode")}
          className={errors.employeeCode ? "border-red-500" : ""}
          placeholder="Nhập mã nhân viên"
        />
        {errors.employeeCode && (
          <p className="text-sm text-red-500">{errors.employeeCode}</p>
        )}
      </div>

      {/* Họ và tên */}
      <div className="space-y-2">
        <Label htmlFor="employeeName">
          Họ và tên <span className="text-red-500">*</span>
        </Label>
        <Input
          id="employeeName"
          name="employeeName"
          value={employee.employeeName || ""}
          onChange={onChange}
          readOnly={isFieldReadOnly("employeeName")}
          className={errors.employeeName ? "border-red-500" : ""}
          placeholder="Nhập họ và tên"
        />
        {errors.employeeName && (
          <p className="text-sm text-red-500">{errors.employeeName}</p>
        )}
      </div>

      {/* Ngày sinh */}
      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Ngày sinh</Label>
        <Input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          value={employee.dateOfBirth || ""}
          onChange={onChange}
          readOnly={isFieldReadOnly("dateOfBirth")}
        />
      </div>

      {/* Giới tính */}
      <div className="space-y-2">
        <Label htmlFor="gender">Giới tính</Label>
        <Select
          value={employee.gender || ""}
          onValueChange={(val) => handleSelectChange("gender", val)}
          disabled={isFieldReadOnly("gender")}
        >
          <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
            <SelectValue placeholder="Chọn giới tính" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Nam</SelectItem>
            <SelectItem value="female">Nữ</SelectItem>
            <SelectItem value="other">Khác</SelectItem>
          </SelectContent>
        </Select>
        {errors.gender && (
          <p className="text-sm text-red-500">{errors.gender}</p>
        )}
      </div>

      {/* Địa chỉ */}
      <div className="space-y-2">
        <Label htmlFor="address">Địa chỉ</Label>
        <Input
          id="address"
          name="address"
          value={employee.address || ""}
          onChange={onChange}
          readOnly={isFieldReadOnly("address")}
          className={errors.address ? "border-red-500" : ""}
          placeholder="Nhập địa chỉ"
        />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address}</p>
        )}
      </div>

      {/* Ngày bắt đầu làm */}
      <div className="space-y-2">
        <Label htmlFor="startDate">Ngày bắt đầu làm</Label>
        <Input
          id="startDate"
          name="startDate"
          type="date"
          value={employee.startDate || ""}
          onChange={onChange}
          readOnly={isFieldReadOnly("startDate")}
        />
      </div>

      {/* Số điện thoại */}
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">
          Số điện thoại <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          value={employee.phoneNumber || ""}
          onChange={onChange}
          readOnly={isFieldReadOnly("phoneNumber")}
          className={errors.phoneNumber ? "border-red-500" : ""}
          placeholder="Nhập số điện thoại"
        />
        {errors.phoneNumber && (
          <p className="text-sm text-red-500">{errors.phoneNumber}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={employee.email || ""}
          onChange={onChange}
          readOnly={isFieldReadOnly("email")}
          className={errors.email ? "border-red-500" : ""}
          placeholder="Nhập email"
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      {mode === "create" && (
        <>
          {/* Tên đăng nhập */}
          <div className="space-y-2">
            <Label htmlFor="username">
              Tên đăng nhập <span className="text-red-500">*</span>
            </Label>
            <Input
              id="username"
              name="username"
              value={employee.username || ""}
              onChange={onChange}
              readOnly={isFieldReadOnly("username")}
              className={errors.username ? "border-red-500" : ""}
              placeholder="Nhập tên đăng nhập"
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username}</p>
            )}
          </div>

          {/* Mật khẩu */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Mật khẩu <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={employee.password || ""}
              onChange={onChange}
              readOnly={isFieldReadOnly("password")}
              className={errors.password ? "border-red-500" : ""}
              placeholder="Nhập mật khẩu"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Vai trò */}
          <div className="space-y-2">
            <Label htmlFor="role">Vai trò</Label>
            <Select
              value={employee.role || ""}
              onValueChange={(val) => handleSelectChange("role", val)}
              disabled={isFieldReadOnly("role")}
            >
              <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="s_admin">Super Admin</SelectItem>
                <SelectItem value="c_admin">Company Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role}</p>
            )}
          </div>

          {/* Trạng thái */}
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={employee.status || ""}
              onValueChange={(val) => handleSelectChange("status", val)}
              disabled={isFieldReadOnly("status")}
            >
              <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
                <SelectItem value="resigned">Đã nghỉ</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeForm;
