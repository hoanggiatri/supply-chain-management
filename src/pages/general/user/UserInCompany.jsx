import React, { useEffect, useState } from "react";
import { Container, TableRow, TableCell, Typography, Paper, } from "@mui/material";
import DataTable from "@components/content-components/DataTable";
import { getAllUsersInCompany } from "@/services/general/UserService";
import { useNavigate } from "react-router-dom";

const UserInCompany = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("employeeCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsersInCompany(companyId, token);
        setUsers(users);
      } catch (error) {
        alert(error.response?.data?.message || "Lỗi khi tải danh sách người dùng!");
      }
    };

    fetchUsers();
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

  const columns = [
    { id: "employeeCode", label: "Mã nhân viên" },
    { id: "email", label: "Email" },
    { id: "role", label: "Vai trò" },
    { id: "status", label: "Trạng thái" },
  ];

  return (
    <Container>
      <Paper className="paper-container" elevation={3} >
        <Typography className="page-title" variant="h4" >
          DÁNH SÁCH TÀI KHOẢN
        </Typography>

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
          renderRow={(user) => (
            <TableRow key={user.employeeId} hover sx={{ cursor: "pointer" }} onClick={() => navigate(`/user/${user.userId}`)}>
              <TableCell>{user.employeeCode || ""}</TableCell>
              <TableCell>{user.email || ""}</TableCell>
              <TableCell>{user.role || ""}</TableCell>
              <TableCell>{user.status || ""}</TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default UserInCompany;
