import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const UserForm = ({
  user,
  onChange,
  errors = {},
  role,
  readOnlyFields = {},
}) => {
  const isFieldReadOnly = (field) => readOnlyFields[field] ?? false;

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
      {(role === "c-admin" || role === "user") && (
        <div className="space-y-2">
          <Label htmlFor="employeeCode">
            Mã nhân viên <span className="text-red-500">*</span>
          </Label>
          <Input
            id="employeeCode"
            name="employeeCode"
            value={user.employeeCode || ""}
            onChange={onChange}
            readOnly={isFieldReadOnly("employeeCode")}
            disabled={isFieldReadOnly("employeeCode")}
            className={errors.employeeCode ? "border-red-500" : ""}
          />
          {errors.employeeCode && (
            <p className="text-sm text-red-500">{errors.employeeCode}</p>
          )}
        </div>
      )}

      {role === "s-admin" && (
        <div className="space-y-2">
          <Label htmlFor="username">
            Username <span className="text-red-500">*</span>
          </Label>
          <Input
            id="username"
            name="username"
            value={user.username || ""}
            onChange={onChange}
            readOnly={isFieldReadOnly("username")}
            disabled={isFieldReadOnly("username")}
            className={errors.username ? "border-red-500" : ""}
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={user.email || ""}
          onChange={onChange}
          readOnly={isFieldReadOnly("email")}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">
          Vai trò <span className="text-red-500">*</span>
        </Label>
        {isFieldReadOnly("role") ? (
          <Input
            value={getRoleLabel(user.role) || ""}
            readOnly
            className="bg-gray-50"
          />
        ) : (
          <Select
            value={user.role || ""}
            onValueChange={(val) => handleSelectChange("role", val)}
          >
            <SelectTrigger className={errors.role ? "border-red-500" : ""}>
              <SelectValue placeholder="Chọn vai trò" />
            </SelectTrigger>
            <SelectContent>
              {role === "s-admin" && (
                <SelectItem value="s_admin">Quản trị hệ thống</SelectItem>
              )}
              <SelectItem value="c_admin">Quản trị công ty</SelectItem>
              <SelectItem value="user">Nhân viên</SelectItem>
            </SelectContent>
          </Select>
        )}
        {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Trạng thái</Label>
        {isFieldReadOnly("status") ? (
          <Input
            value={getStatusLabel(user.status) || ""}
            readOnly
            className="bg-gray-50"
          />
        ) : (
          <Select
            value={user.status || ""}
            onValueChange={(val) => handleSelectChange("status", val)}
          >
            <SelectTrigger className={errors.status ? "border-red-500" : ""}>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
              <SelectItem value="resigned">Đã nghỉ</SelectItem>
            </SelectContent>
          </Select>
        )}
        {errors.status && (
          <p className="text-sm text-red-500">{errors.status}</p>
        )}
      </div>
    </div>
  );
};

export default UserForm;
