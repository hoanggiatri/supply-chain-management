import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDepartmentsInCompany } from "@/services/general/DepartmentService";
import toastrService from "@/services/toastrService";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import ListPageLayout from "@/components/layout/ListPageLayout";

const DepartmentInCompany = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const data = await getAllDepartmentsInCompany(companyId, token);
        setDepartments(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy danh sách bộ phận!"
        );
      } finally {
        setLoading(false);
      }
    };

    if (companyId && token) {
      fetchDepartments();
    }
  }, [companyId, token]);

  const columns = [
    {
      accessorKey: "departmentCode",
      header: createSortableHeader("Mã bộ phận"),
      cell: ({ getValue }) => {
        const code = getValue();
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {code}
          </span>
        );
      },
    },
    {
      accessorKey: "departmentName",
      header: createSortableHeader("Tên bộ phận"),
    },
  ];

  return (
    <ListPageLayout
      breadcrumbItems={[
        { label: "Trang chủ", path: "/" },
        { label: "Bộ phận" },
      ]}
      title="Quản lý bộ phận"
      description="Danh sách các bộ phận trong công ty"
    >
      <DataTable
        columns={columns}
        data={departments}
        loading={loading}
        exportFileName="Danh_sach_bo_phan"
        exportMapper={(row = {}) => ({
          "Mã bộ phận": row.departmentCode || "",
          "Tên bộ phận": row.departmentName || "",
        })}
      />
    </ListPageLayout>
  );
};

export default DepartmentInCompany;
