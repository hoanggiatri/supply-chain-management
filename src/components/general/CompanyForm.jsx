import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        <Select
          value={companyData.companyType || ""}
          onValueChange={(val) => handleSelectChange("companyType", val)}
          disabled={readOnly}
        >
          <SelectTrigger className={errors.companyType ? "border-red-500" : ""}>
            <SelectValue placeholder="Chọn loại hình doanh nghiệp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Doanh nghiệp sản xuất">Doanh nghiệp sản xuất</SelectItem>
            <SelectItem value="Doanh nghiệp thương mại">Doanh nghiệp thương mại</SelectItem>
          </SelectContent>
        </Select>
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
        <Input
          id="startDate"
          name="startDate"
          type="date"
          value={companyData.startDate?.substring(0, 10) || ""}
          onChange={onChange}
          readOnly={readOnly}
          className={errors.startDate ? "border-red-500" : ""}
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
        <Select
          value={companyData.status || ""}
          onValueChange={(val) => handleSelectChange("status", val)}
          disabled={readOnly}
        >
          <SelectTrigger className={errors.status ? "border-red-500" : ""}>
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Đang hoạt động</SelectItem>
            <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
            <SelectItem value="closed">Đã đóng</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-sm text-red-500">{errors.status}</p>
        )}
      </div>
    </div>
  );
};

export default CompanyForm;
