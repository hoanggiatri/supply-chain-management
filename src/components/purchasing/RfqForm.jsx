import { Combobox } from "@/components/ui/combobox";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAllCompanies } from "@/services/general/CompanyService";
import toastrService from "@/services/toastrService";
import { useEffect, useState } from "react";

const RfqForm = ({ rfq, onChange, errors = {}, readOnlyFields, setRfq }) => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  const companyId = localStorage.getItem("companyId");
  const token = localStorage.getItem("token");

  const isFieldReadOnly = (field) => readOnlyFields?.[field] ?? false;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getAllCompanies(token);
        const list = Array.isArray(data?.data) ? data.data : [];
        const filtered = list.filter(
          (company) =>
            Number(company.companyId || company.id) !== Number(companyId)
        );
        setCompanies(filtered);
        setFilteredCompanies(filtered);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Có lỗi khi lấy danh sách công ty!"
        );
      }
    };
    fetchCompanies();
  }, [token, companyId]);

  const handleCompanyChange = (value) => {
    const selectedCompany = companies.find(
      (company) =>
        String(company.companyId || company.id) === String(value)
    );
    setRfq((prev) => ({
      ...prev,
      requestedCompanyId:
        selectedCompany?.companyId || selectedCompany?.id || "",
      requestedCompanyCode: selectedCompany?.companyCode || "",
      requestedCompanyName: selectedCompany?.companyName || "",
    }));
  };

  const companyOptions = filteredCompanies.map((c) => ({
    label: c.companyCode + " - " + c.companyName,
    value: String(c.companyId || c.id),
  }));

  const statusLabels = {
    "Chưa báo giá": "Chưa báo giá",
    "Đã báo giá": "Đã báo giá",
    "Đã hủy": "Đã hủy",
    "Đã từ chối": "Đã từ chối",
    "Đã chấp nhận": "Đã chấp nhận",
    "Quá hạn báo giá": "Quá hạn báo giá",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Mã yêu cầu */}
      <div className="space-y-2">
        <Label>Mã yêu cầu</Label>
        <Input
          name="rfqCode"
          value={rfq.rfqCode || ""}
          placeholder="Mã yêu cầu được tạo tự động"
          readOnly={isFieldReadOnly("rfqCode")}
          className={isFieldReadOnly("rfqCode") ? "bg-gray-50" : ""}
          onChange={onChange}
        />
      </div>

      {/* Công ty cung cấp */}
      <div className="space-y-2">
        <Label>
          Công ty cung cấp <span className="text-red-500">*</span>
        </Label>
        {isFieldReadOnly("requestedCompanyId") ? (
          <Input
            value={
              rfq.requestedCompanyCode
                ? `${rfq.requestedCompanyCode} - ${rfq.requestedCompanyName}`
                : ""
            }
            readOnly
            className="bg-gray-50"
          />
        ) : (
          <Combobox
            options={companyOptions}
            value={String(rfq.requestedCompanyId || "")}
            onValueChange={handleCompanyChange}
            placeholder="Chọn công ty cung cấp"
            searchPlaceholder="Tìm công ty..."
            emptyText="Không tìm thấy công ty"
            className={errors.requestedCompanyId ? "border-red-500" : ""}
          />
        )}
        {errors.requestedCompanyId && (
          <p className="text-sm text-red-500">{errors.requestedCompanyId}</p>
        )}
      </div>

      {/* Hạn báo giá */}
      <div className="space-y-2">
        <Label>
          Hạn báo giá <span className="text-red-500">*</span>
        </Label>
        {isFieldReadOnly("needByDate") ? (
          <Input
            value={rfq.needByDate ? new Date(rfq.needByDate).toLocaleString("vi-VN") : ""}
            readOnly
            className="bg-gray-50"
          />
        ) : (
          <DateTimePicker
            value={rfq.needByDate || ""}
            onChange={(value) => setRfq((prev) => ({ ...prev, needByDate: value }))}
            placeholder="Chọn ngày giờ"
            error={!!errors.needByDate}
          />
        )}
        {errors.needByDate && (
          <p className="text-sm text-red-500">{errors.needByDate}</p>
        )}
      </div>

      {/* Trạng thái */}
      <div className="space-y-2">
        <Label>Trạng thái</Label>
        <Input
          value={statusLabels[rfq.status] || rfq.status || ""}
          readOnly
          className="bg-gray-50"
        />
      </div>
    </div>
  );
};

export default RfqForm;
