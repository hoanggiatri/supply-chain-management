import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportToExcel } from "@/lib/utils";
import { getAllUsers } from "@/services/general/UserService";
import toastrService from "@/services/toastrService";
import dayjs from "dayjs";
import {
    FileSpreadsheet,
    Loader2,
    Mail,
    Plus,
    Search,
    Users
} from "lucide-react"; // Using lucide-react icons consistent with other new pages
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getAllUsers(token, { page: 1, pageSize: 100 }); // Fetch 100 for now
        // Safe data extraction
        const userList = Array.isArray(data) ? data : (data?.data || data?.content || []);
        setUsers(userList);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy danh sách người dùng!"
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUsers();
  }, [token]);

  // Client-side filtering
  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.role?.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadge = (role) => {
    switch (role) {
      case "s_admin":
      case "s-admin":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">System Admin</span>;
      case "c_admin":
      case "c-admin":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">Company Admin</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">User</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
      case "Đang hoạt động":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">• Đang hoạt động</span>;
      case "inactive":
      case "Ngừng hoạt động":
      case "Đã bị khóa":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">• Ngừng hoạt động</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">{status}</span>;
    }
  };

  const handleExport = () => {
    const exportData = users.map(user => ({
      "Mã nhân viên": user.employeeCode,
      "Tên đăng nhập": user.username,
      "Email": user.email,
      "Vai trò": user.role,
      "Trạng thái": user.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động',
      "Ngày tạo": user.createdAt ? dayjs(user.createdAt).format("DD/MM/YYYY HH:mm") : ""
    }));
    exportToExcel(exportData, "Danh_sach_nguoi_dung");
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-8 h-8 text-blue-600" />
            Quản lý tài khoản
          </h1>
          <p className="text-gray-500 mt-1">
            Danh sách tất cả người dùng trong hệ thống
          </p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="gap-2" onClick={handleExport}>
            <FileSpreadsheet className="w-4 h-4" />
            Xuất Excel
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 gap-2"
            onClick={() => navigate('/admin/user/create')} // Assuming create route exists or will be added
            // disabled={true} // Enable when create page is ready
          >
            <Plus className="w-4 h-4" />
            Thêm người dùng
          </Button>
        </div>
      </div>

      {/* Filters and Stats using Shadcn Card style (div) */}
      <div className="bg-white rounded-lg border shadow-sm mb-6 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Tìm kiếm theo tên, email, vai trò..." 
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
                <th className="px-6 py-4">Thông tin người dùng</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Vai trò</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Ngày tạo</th>
                {/* <th className="px-6 py-4 text-right">Thao tác</th> */}
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
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-lg font-medium text-gray-900">Không tìm thấy người dùng</p>
                      <p className="text-sm">Thử thay đổi bộ lọc tìm kiếm của bạn</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr 
                    key={user.userId || user.employeeId || index} 
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/user/${user.userId || user.employeeId}`)}
                  >
                    <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                          {user.username?.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.username}</p>
                          <p className="text-xs text-gray-500">{user.employeeCode || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                      {user.createdAt ? dayjs(user.createdAt).format("DD/MM/YYYY HH:mm") : "-"}
                    </td>
                    {/* <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Simple Pagination Footer - can be enhanced later */}
        {!loading && filteredUsers.length > 0 && (
           <div className="px-6 py-4 border-t bg-gray-50/50 text-sm text-gray-500 flex justify-between items-center">
            <span>Hiển thị {filteredUsers.length} người dùng</span>
            {/* Pagination buttons can actully be implemented here if backend supports it commonly */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
