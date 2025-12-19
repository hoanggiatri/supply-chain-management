import { Combobox } from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAllDepartmentsInCompany } from "@/services/general/DepartmentService";
import toastrService from "@/services/toastrService";
import { useEffect, useState } from "react";

const GENDER_OPTIONS = [
  { value: "Nam", label: "Nam" },
  { value: "Nữ", label: "Nữ" },
  { value: "Khác", label: "Khác" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Không hoạt động" },
  { value: "resigned", label: "Đã nghỉ" },
];

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
    // Auto-set position and role based on department selection
    if (name === "departmentId" && mode === "create") {
      // Find the selected department to check its name
      const selectedDept = departments.find(dept => dept.id === value);
      const isDeptQuanTri = selectedDept?.departmentName === "Quản trị";
      
      // Set position and role based on department
      const position = isDeptQuanTri ? "Quản lý" : "Nhân viên";
      const role = isDeptQuanTri ? "c_admin" : "user";
      
      // Update department, position, and role together
      onChange({
        target: {
          name,
          value,
        },
      });
      
      // Also set position
      onChange({
        target: {
          name: "position",
          value: position,
        },
      });
      
      // Also set role
      onChange({
        target: {
          name: "role",
          value: role,
        },
      });
    } else {
      onChange({
        target: {
          name,
          value,
        },
      });
    }
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

  const departmentOptions = departments.map((dept) => ({
    value: dept.id,
    label: `${dept.departmentCode} - ${dept.departmentName}`,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Bộ phận */}
      <div className="space-y-2">
        <Label htmlFor="departmentId">
          Bộ phận <span className="text-red-500">*</span>
        </Label>
        <Combobox
          options={departmentOptions}
          value={employee.departmentId}
          onChange={(option) => handleSelectChange("departmentId", option?.value)}
          placeholder="Chọn bộ phận"
          searchPlaceholder="Tìm bộ phận..."
          emptyText="Không tìm thấy bộ phận"
          disabled={isFieldReadOnly("departmentId")}
          className={errors.departmentId ? "border-red-500" : ""}
        />
        {errors.departmentId && (
          <p className="text-sm text-red-500">{errors.departmentId}</p>
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
          readOnly
          disabled
          className={`bg-gray-100 ${errors.employeeCode ? "border-red-500" : ""}`}
          placeholder="Nhập mã nhân viên"
        />
      </div>

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
        />
        {errors.employeeName && (
          <p className="text-sm text-red-500">{errors.employeeName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Giới tính</Label>
        <Combobox
          options={GENDER_OPTIONS}
          value={employee.gender}
          onChange={(option) => handleSelectChange("gender", option?.value)}
          placeholder="Chọn giới tính"
          searchPlaceholder="Tìm giới tính..."
          emptyText="Không tìm thấy giới tính"
          disabled={isFieldReadOnly("gender")}
          className={errors.gender ? "border-red-500" : ""}
        />
        {errors.gender && (
          <p className="text-sm text-red-500">{errors.gender}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Ngày sinh</Label>
        <DatePicker
          name="dateOfBirth"
          value={employee.dateOfBirth ? employee.dateOfBirth.substring(0, 10) : ""}
          onChange={onChange}
          disabled={isFieldReadOnly("dateOfBirth")}
          error={!!errors.dateOfBirth}
          placeholder="Chọn ngày sinh"
        />
        {errors.dateOfBirth && (
          <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
        )}
      </div>

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

          {/* Trạng thái */}
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Combobox
              options={STATUS_OPTIONS}
              value={employee.status}
              onChange={(option) => handleSelectChange("status", option?.value)}
              placeholder="Chọn trạng thái"
              searchPlaceholder="Tìm trạng thái..."
              emptyText="Không tìm thấy trạng thái"
              disabled={isFieldReadOnly("status")}
              className={errors.status ? "border-red-500" : ""}
            />
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
