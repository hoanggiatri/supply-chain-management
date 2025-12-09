import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsersInCompany } from "@/services/general/UserService";
import toastrService from "@/services/toastrService";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { AddButton } from "@/components/common/ActionButtons";
import ListPageLayout from "@/components/layout/ListPageLayout";

const UserInCompany = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    let abortController = new AbortController();
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const result = await getAllUsersInCompany(
          companyId,
          token,
          abortController.signal
        );
        setUsers(result.data || result);
      } catch (error) {
        if (error.name === "CanceledError") return;
        toastrService.error(
          error.response?.data?.message || "Lỗi khi tải danh sách người dùng!"
        );
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (companyId && token) {
        fetchUsers();
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [companyId, token]);

  const columns = [
    {
      accessorKey: "employeeCode",
      header: createSortableHeader("Mã nhân viên"),
      cell: ({ getValue }) => {
        const code = getValue();
        if (!code) return "N/A";
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {code}
          </span>
        );
      },
    },
    {
      accessorKey: "email",
      header: createSortableHeader("Email"),
    },
    {
      accessorKey: "role",
      header: createSortableHeader("Vai trò"),
      cell: ({ getValue }) => {
        const role = getValue();
        const roleLabels = {
          c_admin: "Quản trị công ty",
          s_admin: "Quản trị hệ thống",
          user: "Nhân viên",
        };
        return roleLabels[role] || role;
      },
    },
    {
      accessorKey: "status",
      header: createSortableHeader("Trạng thái"),
      cell: ({ getValue }) => {
        const status = getValue();
        const statusLabels = {
          active: "Đang hoạt động",
          inactive: "Ngừng hoạt động",
          resigned: "Đã nghỉ",
        };
        const statusColors = {
          active: "bg-green-100 text-green-700",
          inactive: "bg-amber-100 text-amber-700",
          resigned: "bg-red-100 text-red-700",
        };

        const label = statusLabels[status] || status;
        const colorClass = statusColors[status] || "bg-gray-100 text-gray-700";

        return (
          <span
            className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${colorClass}`}
          >
            {label}
          </span>
        );
      },
    },
  ];

  return (
    <ListPageLayout
      breadcrumbs="Tài khoản"
      title="Danh sách tài khoản"
      description="Quản lý tài khoản người dùng trong hệ thống"
    >
      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        exportFileName="Danh_sach_tai_khoan"
        exportMapper={(row = {}) => ({
          "Mã nhân viên": row.employeeCode || "",
          Email: row.email || "",
          "Vai trò":
            row.role === "c_admin"
              ? "Quản trị công ty"
              : row.role === "s_admin"
              ? "Quản trị hệ thống"
              : row.role === "user"
              ? "Nhân viên"
              : row.role || "",
          "Trạng thái":
            row.status === "active"
              ? "Đang hoạt động"
              : row.status === "inactive"
              ? "Ngừng hoạt động"
              : row.status === "resigned"
              ? "Đã nghỉ"
              : row.status || "",
        })}
      />
    </ListPageLayout>
  );
};

export default UserInCompany;
