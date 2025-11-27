import React, { useEffect, useRef, useState } from "react";
import DataTable from "@components/content-components/DataTable";
import { getAllUsersInCompany } from "@/services/general/UserService";
import { useNavigate } from "react-router-dom";
import toastrService from "@/services/toastrService";
import { Typography, Card, CardBody } from "@material-tailwind/react";

const UserInCompany = () => {
  const [users, setUsers] = useState([]);
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

    const scheduleFetchUsers = () => {
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
          const users = await getAllUsersInCompany(companyId, token, {
            signal: controller.signal,
          });
          if (!isMounted) return;
          setUsers(users.data);
          lastFetchRef.current = Date.now();
        } catch (error) {
          if (error?.code === "ERR_CANCELED") {
            return;
          }
          toastrService.error(
            error.response?.data?.message || "Lỗi khi tải danh sách người dùng!"
          );
        }
      }, delay);
    };

    scheduleFetchUsers();

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

  const roleLabels = {
    c_admin: "Quản trị công ty",
    s_admin: "Quản trị hệ thống",
    user: "Nhân viên",
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

  const columns = [
    { id: "employeeCode", label: "Mã nhân viên" },
    { id: "email", label: "Email" },
    { id: "role", label: "Vai trò" },
    { id: "status", label: "Trạng thái" },
  ];

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              DANH SÁCH TÀI KHOẢN
            </Typography>
          </div>

          <DataTable
            rows={users}
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
            renderRow={(user, index, page, rowsPerPage, renderStatusCell) => {
              const isLast = index === users.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";
              return (
                <tr
                  key={user.employeeId}
                  className="hover:bg-blue-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/user/${user.userId}`)}
                >
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {user.employeeCode || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {user.email || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {roleLabels[user.role] || user.role || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    {renderStatusCell(
                      statusLabels[user.status] || user.status || "",
                      statusColorMap[user.status]
                    )}
                  </td>
                </tr>
              );
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default UserInCompany;
