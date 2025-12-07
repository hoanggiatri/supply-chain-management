import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEmployeesInCompany } from "@/services/general/EmployeeService";
import toastrService from "@/services/toastrService";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { AddButton } from "@/components/common/ActionButtons";
import ListPageLayout from "@/components/layout/ListPageLayout";

const EmployeeInCompany = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fetchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const lastFetchRef = useRef(0);
  const FETCH_DEBOUNCE_MS = 500;

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    if (!companyId || !token) {
      return;
    }

    let isMounted = true;

    const scheduleFetchEmployees = () => {
      const now = Date.now();
      const elapsed = now - lastFetchRef.current;
      const delay =
        elapsed >= FETCH_DEBOUNCE_MS ? 0 : FETCH_DEBOUNCE_MS - elapsed;

      clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = setTimeout(async () => {
        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        try {
          const employees = await getAllEmployeesInCompany(companyId, token, {
            signal: controller.signal,
          });
          if (!isMounted) return;
          setEmployees(employees);
          lastFetchRef.current = Date.now();
        } catch (error) {
          if (error?.code === "ERR_CANCELED") {
            return;
          }
          toastrService.error(
            error.response?.data?.message ||
              "Có lỗi xảy ra khi lấy danh sách nhân viên!"
          );
        } finally {
          if (isMounted) setLoading(false);
        }
      }, delay);
    };

    scheduleFetchEmployees();

    return () => {
      isMounted = false;
      clearTimeout(fetchTimeoutRef.current);
      abortControllerRef.current?.abort();
    };
  }, [companyId, token]);

  const columns = [
    {
      accessorKey: "employeeCode",
      header: createSortableHeader("Mã nhân viên"),
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
      accessorKey: "employeeName",
      header: createSortableHeader("Tên nhân viên"),
    },
    {
      accessorKey: "departmentName",
      header: createSortableHeader("Bộ phận"),
    },
    {
      accessorKey: "position",
      header: createSortableHeader("Chức vụ"),
    },
    {
      accessorKey: "gender",
      header: createSortableHeader("Giới tính"),
      cell: ({ getValue }) => {
        const gender = getValue();
        const genderLabels = {
          male: "Nam",
          female: "Nữ",
          other: "Khác",
        };
        return genderLabels[gender] || gender || "";
      },
    },
    {
      accessorKey: "dateOfBirth",
      header: createSortableHeader("Ngày sinh"),
    },
    {
      accessorKey: "email",
      header: createSortableHeader("Email"),
    },
    {
      accessorKey: "phoneNumber",
      header: createSortableHeader("Số điện thoại"),
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
      breadcrumbs="Nhân viên"
      title="Danh sách nhân viên"
      description="Quản lý nhân viên trong công ty"
      actions={
        <AddButton
          onClick={() => navigate("/create-employee")}
          label="Thêm mới"
        />
      }
    >
      <DataTable
        columns={columns}
        data={employees}
        loading={loading}
        onRowClick={(row) => navigate(`/employee/${row.id}`)}
      />
    </ListPageLayout>
  );
};

export default EmployeeInCompany;
