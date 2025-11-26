import React, { useEffect, useRef, useState } from "react";
import DataTable from "@components/content-components/DataTable";
import { getAllEmployeesInCompany } from "@/services/general/EmployeeService";
import { useNavigate } from "react-router-dom";
import toastrService from "@/services/toastrService";
import { Button, Typography } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";

const EmployeeInCompany = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("employeeCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(1);
  };

  const statusLabels = {
    active: "Đang hoạt động",
    inactive: "Ngừng hoạt động",
    resigned: "Đã nghỉ",
  };

  const statusColorMap = {
    active: "green",
    inactive: "amber",
    resigned: "red",
  };

  const genderLabels = {
    male: "Nam",
    female: "Nữ",
    other: "Khác",
  };

  const columns = [
    { id: "employeeCode", label: "Mã nhân viên" },
    { id: "employeeName", label: "Tên nhân viên" },
    { id: "departmentName", label: "Bộ phận" },
    { id: "position", label: "Chức vụ" },
    { id: "gender", label: "Giới tính" },
    { id: "dateOfBirth", label: "Ngày sinh" },
    { id: "email", label: "Email" },
    { id: "phoneNumber", label: "Số điện thoại" },
    { id: "status", label: "Trạng thái" },
  ];

  return (
    <div className="p-4">
      <div className="mb-6">
        <Typography variant="h4" color="blue-gray" className="mb-4">
          DANH SÁCH NHÂN VIÊN
        </Typography>
        <div className="mb-4">
          <Button
            type="button"
            {...getButtonProps("primary")}
            onClick={() => navigate("/create-employee")}
          >
            Thêm mới
          </Button>
        </div>
      </div>
      <DataTable
        rows={employees}
        columns={columns}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        search={search}
        setSearch={setSearch}
        renderRow={(emp, index, page, rowsPerPage, renderStatusCell) => {
          const isLast = index === employees.length - 1;
          const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
          return (
            <tr
              key={emp.id}
              className="hover:bg-blue-gray-50 transition-colors cursor-pointer"
              onClick={() => navigate(`/employee/${emp.id}`)}
            >
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {emp.employeeCode || ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {emp.employeeName || ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {emp.departmentName || ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {emp.position || ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {genderLabels[emp.gender] || emp.gender || ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {emp.dateOfBirth || ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {emp.email || ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {emp.phoneNumber || ""}
                </Typography>
              </td>
              <td className={classes}>
                {renderStatusCell(
                  statusLabels[emp.status] || emp.status || "",
                  statusColorMap[emp.status]
                )}
              </td>
            </tr>
          );
        }}
      />
    </div>
  );
};

export default EmployeeInCompany;
