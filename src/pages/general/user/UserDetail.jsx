import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from "@/services/general/UserService";
import toastrService from "@/services/toastrService";
import { EditButton } from "@/components/common/ActionButtons";
import BackButton from "@components/common/BackButton";
import { Skeleton } from "@/components/ui/skeleton";

const UserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(userId, token);
        setUser(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy thông tin người dùng!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, token]);

  const InfoRow = ({ label, value, className = "" }) => (
    <div className="flex items-start py-2">
      <span className="text-gray-500 w-40 flex-shrink-0 text-sm">{label}</span>
      <span className={`text-gray-900 text-sm ${className}`}>
        {value || "---"}
      </span>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      active: {
        label: "Hoạt động",
        className: "bg-green-100 text-green-700 border-green-200",
      },
      inactive: {
        label: "Ngừng hoạt động",
        className: "bg-amber-100 text-amber-700 border-amber-200",
      },
    };
    const config = statusConfig[status] || statusConfig.active;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  const RoleBadge = ({ role }) => {
    const roleConfig = {
      c_admin: {
        label: "Quản trị viên công ty",
        className: "bg-purple-100 text-purple-700 border-purple-200",
      },
      user: {
        label: "Người dùng",
        className: "bg-blue-100 text-blue-700 border-blue-200",
      },
      s_admin: {
        label: "Quản trị hệ thống",
        className: "bg-red-100 text-red-700 border-red-200",
      },
    };
    const config = roleConfig[role] || {
      label: role,
      className: "bg-gray-100 text-gray-700 border-gray-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <Skeleton className="h-32 w-32 rounded-full mb-4" />
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          {/* Header / Breadcrumb */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span
                className="cursor-pointer hover:text-blue-600"
                onClick={() => navigate("/users")}
              >
                Danh sách
              </span>
              <span>/</span>
              <span className="text-gray-900 font-medium">
                Chi tiết tài khoản
              </span>
            </div>
            <BackButton to="/users" label="Trở lại" />
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column: Avatar */}
              <div className="w-full md:w-2/5 flex flex-col gap-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-50 shadow-md">
                  <img
                    src={
                      user.employeeAvatar ||
                      "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg"
                    }
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right Column: Info */}
              <div className="w-full md:w-3/5 flex flex-col">
                {/* Title Section */}
                <div className="mb-6">
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {user.username}
                    </span>
                  </div>
                  <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    {user.email}
                  </h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <RoleBadge role={user.role} />
                    <StatusBadge status={user.status} />
                  </div>
                </div>

                {/* Employee Link Section - Nếu có */}
                {user.employeeCode && (
                  <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                    <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase">
                      Nhân viên liên kết
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoRow
                        label="Mã nhân viên"
                        value={user.employeeCode}
                        className="text-blue-600 hover:underline cursor-pointer"
                      />
                      <InfoRow
                        label="Họ tên"
                        value={user.employeeName}
                        className="text-blue-600 hover:underline cursor-pointer"
                      />
                      <InfoRow label="Bộ phận" value={user.departmentName} />
                      <InfoRow label="Chức vụ" value={user.position} />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 mt-auto">
                  <EditButton
                    onClick={() => navigate(`/user/${userId}/edit`)}
                    label="Chỉnh sửa"
                    className="flex-1 h-12 text-base"
                  />
                  <button
                    onClick={() => navigate(`/user/${userId}/change-password`)}
                    className="flex-1 h-12 text-base px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    Đổi mật khẩu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
