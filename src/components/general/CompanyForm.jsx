import React from "react";
import { Input, Select, Option, Typography } from "@material-tailwind/react";

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
      <div>
        <Input
          label="Mã công ty"
          name="companyCode"
          color="blue"
          value={companyData.companyCode || ""}
          className="w-full placeholder:opacity-100"
          readOnly
        />
        {errors.companyCode && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.companyCode}
          </Typography>
        )}
      </div>

      {/* Tên công ty */}
      <div>
        <Input
          label="Tên công ty"
          name="companyName"
          color="blue"
          value={companyData.companyName || ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={readOnly}
          required
        />
        {errors.companyName && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.companyName}
          </Typography>
        )}
      </div>

      {/* Mã số thuế */}
      <div>
        <Input
          label="Mã số thuế"
          name="taxCode"
          value={companyData.taxCode || ""}
          color="blue"
          className="w-full placeholder:opacity-100"
          readOnly
          required
        />
        {errors.taxCode && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.taxCode}
          </Typography>
        )}
      </div>

      {/* Tên người đại diện */}
      <div>
        <Input
          label="Tên người đại diện"
          name="representativeName"
          color="blue"
          value={companyData.representativeName || ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={readOnly}
          required
        />
        {errors.representativeName && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.representativeName}
          </Typography>
        )}
      </div>

      {/* Loại hình doanh nghiệp */}
      <div>
        <Select
          label="Loại hình doanh nghiệp"
          value={companyData.companyType || ""}
          onChange={(val) => handleSelectChange("companyType", val)}
          color="blue"
          className="w-full placeholder:opacity-100"
          readOnly={readOnly}
        >
          <Option value="Doanh nghiệp sản xuất">Doanh nghiệp sản xuất</Option>
          <Option value="Doanh nghiệp thương mại">
            Doanh nghiệp thương mại
          </Option>
        </Select>
        {errors.companyType && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.companyType}
          </Typography>
        )}
      </div>

      {/* Ngành nghề chính */}
      <div>
        <Input
          label="Ngành nghề chính"
          name="mainIndustry"
          value={companyData.mainIndustry || ""}
          onChange={onChange}
          color="blue"
          className="w-full placeholder:opacity-100"
          readOnly={readOnly}
        />
        {errors.mainIndustry && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.mainIndustry}
          </Typography>
        )}
      </div>

      {/* Địa chỉ */}
      <div>
        <Input
          label="Địa chỉ"
          name="address"
          value={companyData.address || ""}
          onChange={onChange}
          color="blue"
          className="w-full placeholder:opacity-100"
          readOnly={readOnly}
          required
        />
        {errors.address && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.address}
          </Typography>
        )}
      </div>

      {/* Số điện thoại */}
      <div>
        <Input
          label="Số điện thoại"
          name="phoneNumber"
          value={companyData.phoneNumber || ""}
          onChange={onChange}
          color="blue"
          className="w-full placeholder:opacity-100"
          readOnly={readOnly}
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
          value={companyData.email || ""}
          onChange={onChange}
          color="blue"
          className="w-full placeholder:opacity-100"
          readOnly={readOnly}
          required
        />
        {errors.email && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.email}
          </Typography>
        )}
      </div>

      {/* Ngày bắt đầu */}
      <div>
        <Input
          label="Ngày bắt đầu"
          name="startDate"
          type="date"
          value={companyData.startDate?.substring(0, 10) || ""}
          onChange={onChange}
          color="blue"
          className="w-full placeholder:opacity-100"
          readOnly={readOnly}
        />
        {errors.startDate && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.startDate}
          </Typography>
        )}
      </div>

      {/* Website */}
      <div>
        <Input
          label="Website"
          name="websiteAddress"
          value={companyData.websiteAddress || ""}
          onChange={onChange}
          color="blue"
          className="w-full placeholder:opacity-100"
          readOnly={readOnly}
        />
        {errors.websiteAddress && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.websiteAddress}
          </Typography>
        )}
      </div>

      {/* Trạng thái */}
      <div>
        <Select
          label="Trạng thái"
          value={companyData.status || ""}
          onChange={(val) => handleSelectChange("status", val)}
          color="blue"
          className="w-full placeholder:opacity-100"
        >
          <Option value="active">Đang hoạt động</Option>
          <Option value="inactive">Ngừng hoạt động</Option>
          <Option value="closed">Đã đóng</Option>
        </Select>
        {errors.status && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.status}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default CompanyForm;
