import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ROLE_OPTIONS = [
  { value: "s_admin", label: "Quản trị hệ thống" },
  { value: "c_admin", label: "Quản trị công ty" },
  { value: "user", label: "Nhân viên" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
  { value: "resigned", label: "Đã nghỉ" },
];

const getRoleLabel = (roleValue) => {
  const option = ROLE_OPTIONS.find((o) => o.value === roleValue);
  return option ? option.label : roleValue;
};

const getStatusLabel = (statusValue) => {
  const option = STATUS_OPTIONS.find((o) => o.value === statusValue);
  return option ? option.label : statusValue;
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

  const currentRoleOptions =
    role === "s-admin"
      ? ROLE_OPTIONS
      : ROLE_OPTIONS.filter((o) => o.value !== "s_admin");

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
          <Combobox
            options={currentRoleOptions}
            value={user.role}
            onChange={(option) => handleSelectChange("role", option?.value)}
            placeholder="Chọn vai trò"
            searchPlaceholder="Tìm vai trò..."
            emptyText="Không tìm thấy vai trò"
            className={errors.role ? "border-red-500" : ""}
          />
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
          <Combobox
            options={STATUS_OPTIONS}
            value={user.status}
            onChange={(option) => handleSelectChange("status", option?.value)}
            placeholder="Chọn trạng thái"
            searchPlaceholder="Tìm trạng thái..."
            emptyText="Không tìm thấy trạng thái"
            className={errors.status ? "border-red-500" : ""}
          />
        )}
        {errors.status && (
          <p className="text-sm text-red-500">{errors.status}</p>
        )}
      </div>
    </div>
  );
};

export default UserForm;
