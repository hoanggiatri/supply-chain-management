import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Using Shadcn UI Card or verify if available
import { getCompanyById } from "@/services/general/CompanyService";
import toastrService from "@/services/toastrService";
import dayjs from "dayjs";
import {
    ArrowLeft,
    Building2,
    Calendar,
    Edit,
    Loader2,
    MapPin,
    User
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Company = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const { companyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      if (!companyId || companyId === "undefined") return; // Safety check
      
      const token = localStorage.getItem("token");
      setLoading(true);
      try {
        const data = await getCompanyById(companyId, token);

        if (data.logoUrl) {
          data.logoUrl = `${data.logoUrl}?t=${Date.now()}`;
        }

        setCompany(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Lỗi khi lấy thông tin công ty!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);

  if (loading) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-500">Đang tải thông tin công ty...</p>
        </div>
      );
  }

  if (!company) {
     return (
      <div className="p-6 text-center">
         <p className="text-red-500">Không tìm thấy thông tin công ty!</p>
         <Button variant="outline" className="mt-4" onClick={() => navigate("/admin/all-company")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
         </Button>
      </div>
     )
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="pl-0 hover:pl-2 transition-all text-gray-500 hover:text-gray-900 mb-4"
          onClick={() => navigate("/admin/all-company")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại danh sách
        </Button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-8 h-8 text-blue-600" />
              Chi tiết công ty
            </h1>
            <p className="text-gray-500 mt-1">
              Xem chi tiết thông tin công ty {company.companyName}
            </p>
          </div>
          <div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 gap-2"
              onClick={() => navigate(`/admin/company/${companyId}/edit`)}
            >
              <Edit className="w-4 h-4" />
              Chỉnh sửa thông tin
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Intro Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="text-center pb-2">
               <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mb-4 flex items-center justify-center">
                  {company.logoUrl ? (
                    <img
                      src={company.logoUrl}
                      alt="Company Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Building2 className="w-12 h-12 text-gray-300" />
                  )}
               </div>
               <CardTitle className="text-xl">{company.companyName}</CardTitle>
               <p className="text-sm text-gray-500">{company.companyCode}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <User className="w-4 h-4" />
                 </div>
                 <div>
                    <p className="text-gray-500 text-xs">Người đại diện</p>
                    <p className="font-medium">{company.representativeName || "Chưa cập nhật"}</p>
                 </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                 <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <MapPin className="w-4 h-4" />
                 </div>
                 <div>
                    <p className="text-gray-500 text-xs">Mã số thuế</p>
                    <p className="font-medium">{company.taxCode || "N/A"}</p>
                 </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                 <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                    <Calendar className="w-4 h-4" />
                 </div>
                 <div>
                    <p className="text-gray-500 text-xs">Ngày thành lập</p>
                    <p className="font-medium">{company.startDate ? dayjs(company.startDate).format("DD/MM/YYYY") : "N/A"}</p>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Card */}
        <div className="lg:col-span-2">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        Thông tin chi tiết
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* We can reuse the CompanyForm in readOnly mode IF it supports it and looks good, or better yet, render read-only fields directly here to ensure consistent Tailwind UI */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Tên công ty</label>
                            <div className="p-2 bg-gray-50 rounded-md border border-gray-100 text-sm">{company.companyName}</div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Mã công ty</label>
                            <div className="p-2 bg-gray-50 rounded-md border border-gray-100 text-sm">{company.companyCode}</div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Loại hình</label>
                            <div className="p-2 bg-gray-50 rounded-md border border-gray-100 text-sm">{company.companyType}</div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Người đại diện</label>
                            <div className="p-2 bg-gray-50 rounded-md border border-gray-100 text-sm">{company.representativeName}</div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Địa chỉ</label>
                            <div className="p-2 bg-gray-50 rounded-md border border-gray-100 text-sm">{company.address || "Chưa cập nhật"}</div>
                        </div>
                         <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Email liên hệ</label>
                            <div className="p-2 bg-gray-50 rounded-md border border-gray-100 text-sm">{company.email || "Chưa cập nhật"}</div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                            <div className="p-2 bg-gray-50 rounded-md border border-gray-100 text-sm">{company.phoneNumber || "Chưa cập nhật"}</div>
                        </div>
                         <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                             <div className="pt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    company.status === 'active' || company.status === 'Đang hoạt động' 
                                    ? 'bg-green-100 text-green-800 border-green-200' 
                                    : 'bg-gray-100 text-gray-800 border-gray-200'
                                } border`}>
                                    {company.status}
                                </span>
                             </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                         <h3 className="text-sm font-medium text-gray-900 mb-3">Mô tả</h3>
                         <div className="p-3 bg-gray-50 rounded-md border border-gray-100 text-sm text-gray-600 min-h-[100px]">
                            {company.description || "Không có mô tả thêm."}
                         </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default Company;
