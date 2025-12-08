import React, { useEffect, useState } from "react";
import {
  getCompanyById,
  updateCompany,
  updateCompanyLogo,
} from "@/services/general/CompanyService";
import CompanyForm from "@components/general/CompanyForm";
import { useNavigate } from "react-router-dom";
import toastrService from "@/services/toastrService";
import { Button } from "@/components/ui/button";
import FormPageLayout from "@/components/layout/FormPageLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageUpload } from "@/components/common/ImageUpload";
import { Save, X } from "lucide-react";

const EditCompany = () => {
  const [company, setCompany] = useState(null);
  const [editedCompany, setEditedCompany] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      const companyId = localStorage.getItem("companyId");
      const token = localStorage.getItem("token");
      if (!companyId) return;

      try {
        const data = await getCompanyById(companyId, token);

        if (data.logoUrl) {
          data.logoUrl = `${data.logoUrl}?t=${Date.now()}`;
        }

        setCompany(data);
        setEditedCompany(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Lỗi khi lấy thông tin công ty!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  const validateForm = () => {
    const errors = {};
    const companyName = (editedCompany?.companyName ?? "").toString();
    const representativeName = (
      editedCompany?.representativeName ?? ""
    ).toString();
    const address = (editedCompany?.address ?? "").toString();
    const phoneNumber = (editedCompany?.phoneNumber ?? "").toString();
    const email = (editedCompany?.email ?? "").toString();
    const startDate = editedCompany?.startDate;
    const joinDate = editedCompany?.joinDate;

    if (!companyName.trim())
      errors.companyName = "Tên công ty không được để trống";
    if (!address.trim()) errors.address = "Địa chỉ không được để trống";
    if (!representativeName.trim())
      errors.representativeName = "Người đại diện không được để trống";
    if (!phoneNumber.trim())
      errors.phoneNumber = "Số điện thoại không được để trống";
    if (phoneNumber.trim() && !/^\d{10,11}$/.test(phoneNumber.trim()))
      errors.phoneNumber = "Số điện thoại không hợp lệ";
    if (!email.trim()) errors.email = "Email không được để trống";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errors.email = "Email không hợp lệ";
    if (startDate && joinDate && new Date(startDate) > new Date(joinDate)) {
      errors.startDate = "Ngày bắt đầu phải trước ngày tham gia";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setEditedCompany(company);
    navigate("/company");
  };

  const handleSave = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const companyId = localStorage.getItem("companyId");
    const token = localStorage.getItem("token");

    try {
      const { joinDate, id, country, ...payload } = editedCompany || {};
      await updateCompany(companyId, payload, token);

      const updatedCompany = await getCompanyById(companyId, token);

      setCompany(updatedCompany);
      setEditedCompany(updatedCompany);
      toastrService.success("Cập nhật thông tin thành công!");
      navigate("/company");
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Cập nhật thất bại!"
      );
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadLogo = async () => {
    const companyId = localStorage.getItem("companyId");
    const token = localStorage.getItem("token");

    try {
      await updateCompanyLogo(companyId, logoFile, token);

      // Fetch lại thông tin company từ server để lấy URL logo mới
      const updatedCompany = await getCompanyById(companyId, token);

      // Thêm timestamp để tránh cache
      if (updatedCompany.logoUrl) {
        updatedCompany.logoUrl = `${updatedCompany.logoUrl}?t=${Date.now()}`;
      }

      setCompany(updatedCompany);
      setEditedCompany(updatedCompany);
      setLogoFile(null);
      setLogoPreview(null);
      toastrService.success("Cập nhật logo thành công!");
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Cập nhật logo thất bại!"
      );
    }
  };

  if (loading) {
    return (
      <FormPageLayout
        breadcrumbs="Thông tin công ty / Chỉnh sửa"
        backLink="/company"
      >
        <div className="space-y-4">
          <Skeleton className="h-32 w-32 rounded-lg" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </FormPageLayout>
    );
  }

  if (!company) return null;

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Thông tin công ty", path: "/company" },
        { label: "Chỉnh sửa" },
      ]}
      backLink="/company"
      backLabel="Quay lại"
    >
      {/* Title với icon */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          CHỈNH SỬA THÔNG TIN CÔNG TY
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-8 mb-8 bg-white rounded-lg border border-gray-200 p-6">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shadow-sm mb-3">
            <img
              src={
                logoPreview ||
                company.logoUrl ||
                "https://cdn-icons-png.freepik.com/512/2774/2774806.png"
              }
              alt="Company Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <input
            type="file"
            id="company-logo-input"
            accept="image/*"
            onChange={handleLogoChange}
            className="hidden"
          />
          <label
            htmlFor="company-logo-input"
            className="block w-32 px-3 py-2 text-xs text-center bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 cursor-pointer transition-colors"
          >
            Chọn logo
          </label>
          {logoFile && (
            <Button onClick={handleUploadLogo} size="sm" className="w-32 mt-2">
              Cập nhật logo
            </Button>
          )}
        </div>

        {/* Right: Form với Grid 2 cột */}
        <div className="flex-1 w-full">
          <CompanyForm
            companyData={editedCompany}
            onChange={handleChange}
            errors={errors}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
        <Button variant="outline" onClick={handleCancel}>
          Hủy
        </Button>
        <Button onClick={handleSave}>Lưu thay đổi</Button>
      </div>
    </FormPageLayout>
  );
};

export default EditCompany;
