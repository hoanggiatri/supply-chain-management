import React from "react";
import { Input, Select, Option, Typography } from "@material-tailwind/react";

const getRoleLabel = (roleValue) => {
  const roleMap = {
    c_admin: "Quản trị công ty",
    s_admin: "Quản trị hệ thống",
    user: "Nhân viên",
  };
  return roleMap[roleValue] || roleValue;
};

const getStatusLabel = (statusValue) => {
  const statusMap = {
    active: "Đang hoạt động",
    inactive: "Ngừng hoạt động",
    resigned: "Đã nghỉ",
  };
  return statusMap[statusValue] || statusValue;
};

const UserForm = ({ user, onChange, errors, role, readOnly }) => {
  const isReadOnly = readOnly || role === "user";

  const handleSelectChange = (name, value) => {
    onChange({
      target: {
        name,
        value,
      },
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Mã nhân viên hoặc Username */}
      <div>
        {(role === "c-admin" || role === "user") && (
          <Input
            label="Mã nhân viên"
            name="employeeCode"
            color="blue"
            value={user.employeeCode || ""}
            className="w-full placeholder:opacity-100"
            readOnly
          />
        )}
        {role === "s-admin" && (
          <Input
            label="Username"
            name="username"
            color="blue"
            value={user.username || ""}
            onChange={isReadOnly ? undefined : onChange}
            className="w-full placeholder:opacity-100"
            readOnly={isReadOnly}
            required
          />
        )}
        {errors.employeeCode && (role === "c-admin" || role === "user") && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.employeeCode}
          </Typography>
        )}
        {errors.username && role === "s-admin" && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.username}
          </Typography>
        )}
      </div>

      {/* Email */}
      <div>
        <Input
          label="Email"
          name="email"
          type="email"
          color="blue"
          value={user.email || ""}
          onChange={isReadOnly ? undefined : onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isReadOnly}
          required
        />
        {errors.email && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.email}
          </Typography>
        )}
      </div>

      {/* Vai trò */}
      <div>
        {isReadOnly ? (
          <Input
            label="Vai trò"
            color="blue"
            value={getRoleLabel(user.role) || ""}
            readOnly
            className="w-full placeholder:opacity-100"
          />
        ) : (
          <Select
            label="Vai trò"
            value={user.role || ""}
            color="blue"
            onChange={(val) => handleSelectChange("role", val)}
            className="w-full placeholder:opacity-100"
          >
            {role === "s-admin" && (
              <Option value="s_admin">Quản trị hệ thống</Option>
            )}
            <Option value="c_admin">Quản trị công ty</Option>
            <Option value="user">Nhân viên</Option>
          </Select>
        )}
        {errors.role && !isReadOnly && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.role}
          </Typography>
        )}
      </div>

      {/* Trạng thái */}
      <div>
        {isReadOnly ? (
          <Input
            label="Trạng thái"
            color="blue"
            value={getStatusLabel(user.status) || ""}
            readOnly
            className="w-full placeholder:opacity-100"
          />
        ) : (
          <Select
            label="Trạng thái"
            value={user.status || ""}
            color="blue"
            onChange={(val) => handleSelectChange("status", val)}
            className="w-full placeholder:opacity-100"
          >
            <Option value="active">Đang hoạt động</Option>
            <Option value="inactive">Ngừng hoạt động</Option>
            <Option value="resigned">Đã nghỉ</Option>
          </Select>
        )}
        {errors.status && !isReadOnly && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.status}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default UserForm;
