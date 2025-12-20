import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportToExcel } from "@/lib/utils";
import { getAllCompanies } from "@/services/general/CompanyService";
import toastrService from "@/services/toastrService";
import dayjs from "dayjs";
import {
  Building2,
  Calendar,
  FileSpreadsheet,
  Loader2,
  Search
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AllCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const data = await getAllCompanies(token, { page: 1, pageSize: 100 });
        // Safe data extraction
        const companyList = Array.isArray(data) ? data : (data?.data || data?.content || []);
        setCompanies(companyList);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy danh sách công ty!"
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchCompanies();
  }, [token]);

  // Client-side filtering
  const filteredCompanies = companies.filter(company => 
    company.companyName?.toLowerCase().includes(search.toLowerCase()) ||
    company.companyCode?.toLowerCase().includes(search.toLowerCase()) ||
    company.taxCode?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Đang hoạt động":
      case "active":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">Đang hoạt động</span>;
      case "Ngừng hoạt động":
      case "inactive":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">Ngừng hoạt động</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">{status}</span>;
    }
  };

  const handleExport = () => {
    const exportData = companies.map(company => ({
      "Mã công ty": company.companyCode,
      "Tên công ty": company.companyName,
      "Mã số thuế": company.taxCode,
      "Người đại diện": company.representativeName,
      "Loại hình": company.companyType,
      "Trạng thái": company.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động',
      "Ngày tham gia": company.joinDate ? dayjs(company.joinDate).format("DD/MM/YYYY") : "",
      "Địa chỉ": company.address,
      "Email": company.email,
      "SĐT": company.phoneNumber
    }));
    exportToExcel(exportData, "Danh_sach_cong_ty");
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            Quản lý công ty
          </h1>
          <p className="text-gray-500 mt-1">
            Danh sách các công ty doanh nghiệp trong hệ thống
          </p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="gap-2" onClick={handleExport}>
            <FileSpreadsheet className="w-4 h-4" />
            Xuất Excel
          </Button>
          {/* Create company usually done via registration or super admin manual add? Assuming manual add for now based on button existence expectation */}
          {/* <Button 
            className="bg-blue-600 hover:bg-blue-700 gap-2"
            onClick={() => navigate('/admin/company/create')} 
          >
            <Plus className="w-4 h-4" />
            Thêm công ty
          </Button> */}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border shadow-sm mb-6 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Tìm kiếm theo tên, mã, mã số thuế..." 
            className="pl-9 bg-gray-50/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b">
              <tr>
                <th className="px-6 py-4 w-[60px]">STT</th>
                <th className="px-6 py-4">Thông tin công ty</th>
                <th className="px-6 py-4">Mã số thuế</th>
                <th className="px-6 py-4">Loại hình</th>
                <th className="px-6 py-4">Người đại diện</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Ngày tham gia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                   <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                    <p>Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Building2 className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-lg font-medium text-gray-900">Không tìm thấy công ty</p>
                      <p className="text-sm">Thử thay đổi bộ lọc tìm kiếm của bạn</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company, index) => (
                  <tr 
                    key={company.id || index} 
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/company/${company.id}`)}
                  >
                    <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100">
                          {company.companyCode}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{company.companyName}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{company.address || "Chưa cập nhật địa chỉ"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">
                      {company.taxCode}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {company.companyType}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {company.representativeName}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(company.status)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {company.joinDate ? dayjs(company.joinDate).format("DD/MM/YYYY") : "-"}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {!loading && filteredCompanies.length > 0 && (
           <div className="px-6 py-4 border-t bg-gray-50/50 text-sm text-gray-500 flex justify-between items-center">
            <span>Hiển thị {filteredCompanies.length} công ty</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCompanies;
