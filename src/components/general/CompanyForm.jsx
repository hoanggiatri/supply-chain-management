import { Combobox } from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const COMPANY_TYPE_OPTIONS = [
  { value: "Doanh nghiệp sản xuất", label: "Doanh nghiệp sản xuất" },
  { value: "Doanh nghiệp thương mại", label: "Doanh nghiệp thương mại" },
];

const COMPANY_STATUS_OPTIONS = [
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
  { value: "closed", label: "Đã đóng" },
];

const CompanyForm = ({ companyData, onChange, errors, readOnly = false }) => {
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
      {/* Mã công ty */}
      <div className="space-y-2">
        <Label htmlFor="companyCode">Mã công ty</Label>
        <Input
          id="companyCode"
          name="companyCode"
          value={companyData.companyCode || ""}
          readOnly
          className="bg-gray-100"
        />
        {errors.companyCode && (
          <p className="text-sm text-red-500">{errors.companyCode}</p>
        )}
      </div>

      {/* Tên công ty */}
      <div className="space-y-2">
        <Label htmlFor="companyName">Tên công ty <span className="text-red-500">*</span></Label>
        <Input
          id="companyName"
          name="companyName"
          value={companyData.companyName || ""}
          onChange={onChange}
          readOnly={readOnly}
          className={errors.companyName ? "border-red-500" : ""}
        />
        {errors.companyName && (
          <p className="text-sm text-red-500">{errors.companyName}</p>
        )}
      </div>

      {/* Mã số thuế */}
      <div className="space-y-2">
        <Label htmlFor="taxCode">Mã số thuế <span className="text-red-500">*</span></Label>
        <Input
          id="taxCode"
          name="taxCode"
          value={companyData.taxCode || ""}
          readOnly
          className="bg-gray-100"
        />
        {errors.taxCode && (
          <p className="text-sm text-red-500">{errors.taxCode}</p>
        )}
      </div>

      {/* Tên người đại diện */}
      <div className="space-y-2">
        <Label htmlFor="representativeName">Tên người đại diện <span className="text-red-500">*</span></Label>
        <Input
          id="representativeName"
          name="representativeName"
          value={companyData.representativeName || ""}
          onChange={onChange}
          readOnly={readOnly}
          className={errors.representativeName ? "border-red-500" : ""}
        />
        {errors.representativeName && (
          <p className="text-sm text-red-500">{errors.representativeName}</p>
        )}
      </div>

      {/* Loại hình doanh nghiệp */}
      <div className="space-y-2">
        <Label htmlFor="companyType">Loại hình doanh nghiệp</Label>
        <Combobox
          options={COMPANY_TYPE_OPTIONS}
          value={companyData.companyType}
          onChange={(option) => handleSelectChange("companyType", option?.value)}
          placeholder="Chọn loại hình doanh nghiệp"
          searchPlaceholder="Tìm loại hình doanh nghiệp..."
          emptyText="Không tìm thấy loại hình doanh nghiệp"
          disabled={readOnly}
          className={errors.companyType ? "border-red-500" : ""}
        />
        {errors.companyType && (
          <p className="text-sm text-red-500">{errors.companyType}</p>
        )}
      </div>

      {/* Ngành nghề chính */}
      <div className="space-y-2">
        <Label htmlFor="mainIndustry">Ngành nghề chính</Label>
        <Input
          id="mainIndustry"
          name="mainIndustry"
          value={companyData.mainIndustry || ""}
          onChange={onChange}
          readOnly={readOnly}
          className={errors.mainIndustry ? "border-red-500" : ""}
        />
        {errors.mainIndustry && (
          <p className="text-sm text-red-500">{errors.mainIndustry}</p>
        )}
      </div>

      {/* Địa chỉ */}
      <div className="space-y-2">
        <Label htmlFor="address">Địa chỉ <span className="text-red-500">*</span></Label>
        <Input
          id="address"
          name="address"
          value={companyData.address || ""}
          onChange={onChange}
          readOnly={readOnly}
          className={errors.address ? "border-red-500" : ""}
        />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address}</p>
        )}
      </div>

      {/* Số điện thoại */}
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Số điện thoại <span className="text-red-500">*</span></Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          value={companyData.phoneNumber || ""}
          onChange={onChange}
          readOnly={readOnly}
          className={errors.phoneNumber ? "border-red-500" : ""}
        />
        {errors.phoneNumber && (
          <p className="text-sm text-red-500">{errors.phoneNumber}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={companyData.email || ""}
          onChange={onChange}
          readOnly={readOnly}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Ngày bắt đầu */}
      <div className="space-y-2">
        <Label htmlFor="startDate">Ngày bắt đầu</Label>
        <DatePicker
          name="startDate"
          value={companyData.startDate || ""}
          onChange={onChange}
          disabled={readOnly}
          error={!!errors.startDate}
          placeholder="Chọn ngày bắt đầu"
        />
        {errors.startDate && (
          <p className="text-sm text-red-500">{errors.startDate}</p>
        )}
      </div>

      {/* Website */}
      <div className="space-y-2">
        <Label htmlFor="websiteAddress">Website</Label>
        <Input
          id="websiteAddress"
          name="websiteAddress"
          value={companyData.websiteAddress || ""}
          onChange={onChange}
          readOnly={readOnly}
          className={errors.websiteAddress ? "border-red-500" : ""}
        />
        {errors.websiteAddress && (
          <p className="text-sm text-red-500">{errors.websiteAddress}</p>
        )}
      </div>

      {/* Trạng thái */}
      <div className="space-y-2">
        <Label htmlFor="status">Trạng thái</Label>
        <Combobox
          options={COMPANY_STATUS_OPTIONS}
          value={companyData.status}
          onChange={(option) => handleSelectChange("status", option?.value)}
          placeholder="Chọn trạng thái"
          searchPlaceholder="Tìm trạng thái..."
          emptyText="Không tìm thấy trạng thái"
          disabled={readOnly}
          className={errors.status ? "border-red-500" : ""}
        />
        {errors.status && (
          <p className="text-sm text-red-500">{errors.status}</p>
        )}
      </div>
    </div>
  );
};

export default CompanyForm;
