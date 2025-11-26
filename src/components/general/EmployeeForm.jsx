import React, { useEffect, useState } from "react";
import { Input, Select, Option, Typography } from "@material-tailwind/react";
import { getAllDepartmentsInCompany } from "@/services/general/DepartmentService";
import toastrService from "@/services/toastrService";

const EmployeeForm = ({
  employee,
  onChange,
  errors = {},
  readOnlyFields,
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
      <div>
        <Select
          label="Bộ phận"
          color="blue"
          value={employee.departmentId || ""}
          onChange={(val) => handleSelectChange("departmentId", val)}
          readOnly={isFieldReadOnly("departmentId")}
          className="w-full placeholder:opacity-100"
        >
          {departments.map((dept) => (
            <Option key={dept.id} value={dept.id}>
              {dept.departmentCode} - {dept.departmentName}
            </Option>
          ))}
        </Select>
        {errors.departmentId && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.departmentId}
          </Typography>
        )}
      </div>

      {/* Chức vụ */}
      <div>
        <Select
          label="Chức vụ"
          value={employee.position || ""}
          onChange={(val) => handleSelectChange("position", val)}
          readOnly={isFieldReadOnly("position")}
          color="blue"
          className="w-full placeholder:opacity-100"
        >
          <Option value="Quản lý">Quản lý</Option>
          <Option value="Nhân viên">Nhân viên</Option>
        </Select>
        {errors.position && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.position}
          </Typography>
        )}
      </div>

      {/* Mã nhân viên */}
      <div>
        <Input
          label="Mã nhân viên"
          name="employeeCode"
          color="blue"
          value={employee.employeeCode || ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("employeeCode")}
          disabled={isFieldReadOnly("employeeCode")}
          required
        />
        {errors.employeeCode && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.employeeCode}
          </Typography>
        )}
      </div>

      {/* Họ và tên */}
      <div>
        <Input
          label="Họ và tên"
          name="employeeName"
          value={employee.employeeName || ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("employeeName")}
          color="blue"
          required
        />
        {errors.employeeName && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.employeeName}
          </Typography>
        )}
      </div>

      {/* Ngày sinh */}
      <div>
        <Input
          label="Ngày sinh"
          name="dateOfBirth"
          type="date"
          value={employee.dateOfBirth || ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("dateOfBirth")}
          color="blue"
        />
      </div>

      {/* Giới tính */}
      <div>
        <Select
          label="Giới tính"
          value={employee.gender || ""}
          onChange={(val) => handleSelectChange("gender", val)}
          readOnly={isFieldReadOnly("gender")}
          color="blue"
          className="w-full placeholder:opacity-100"
        >
          <Option value="male">Nam</Option>
          <Option value="female">Nữ</Option>
          <Option value="other">Khác</Option>
        </Select>
        {errors.gender && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.gender}
          </Typography>
        )}
      </div>

      {/* Địa chỉ */}
      <div>
        <Input
          label="Địa chỉ"
          name="address"
          value={employee.address || ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("address")}
          color="blue"
        />
        {errors.address && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.address}
          </Typography>
        )}
      </div>

      {/* Ngày bắt đầu làm */}
      <div>
        <Input
          label="Ngày bắt đầu làm"
          name="startDate"
          type="date"
          value={employee.startDate || ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("startDate")}
          color="blue"
        />
      </div>

      {/* Số điện thoại */}
      <div>
        <Input
          label="Số điện thoại"
          name="phoneNumber"
          value={employee.phoneNumber || ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("phoneNumber")}
          color="blue"
          required
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
          label="Email"
          name="email"
          type="email"
          value={employee.email || ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("email")}
          color="blue"
          required
        />
        {errors.email && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.email}
          </Typography>
        )}
      </div>

      {mode === "create" && (
        <>
          {/* Tên đăng nhập */}
          <div>
            <Input
              label="Tên đăng nhập"
              name="username"
              value={employee.username || ""}
              onChange={onChange}
              className="w-full placeholder:opacity-100"
              readOnly={isFieldReadOnly("username")}
              color="blue"
              required
            />
            {errors.username && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.username}
              </Typography>
            )}
          </div>

          {/* Mật khẩu */}
          <div>
            <Input
              label="Mật khẩu"
              name="password"
              type="password"
              value={employee.password || ""}
              onChange={onChange}
              className="w-full placeholder:opacity-100"
              readOnly={isFieldReadOnly("password")}
              color="blue"
              required
            />
            {errors.password && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.password}
              </Typography>
            )}
          </div>

          {/* Vai trò */}
          <div>
            <Select
              label="Vai trò"
              value={employee.role || ""}
              onChange={(val) => handleSelectChange("role", val)}
              readOnly={isFieldReadOnly("role")}
              color="blue"
              className="w-full placeholder:opacity-100"
            >
              <Option value="s_admin">Super Admin</Option>
              <Option value="c_admin">Company Admin</Option>
              <Option value="user">User</Option>
            </Select>
            {errors.role && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.role}
              </Typography>
            )}
          </div>

          {/* Trạng thái */}
          <div>
            <Select
              label="Trạng thái"
              value={employee.status || ""}
              onChange={(val) => handleSelectChange("status", val)}
              readOnly={isFieldReadOnly("status")}
              color="blue"
              className="w-full placeholder:opacity-100"
            >
              <Option value="active">Đang hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
              <Option value="resigned">Đã nghỉ</Option>
            </Select>
            {errors.status && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.status}
              </Typography>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeForm;
