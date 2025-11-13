import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TableRow,
  TableCell,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DataTable from "@components/content-components/DataTable";
import { getAllUsers } from "@/services/general/UserService";
import toastrService from "@/services/toastrService";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("username");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers(token);
        setUsers(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy danh sách người dùng!"
        );
      }
    };

    if (token) fetchUsers();
  }, [token]);

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
    { id: "username", label: "Tên đăng nhập" },
    { id: "email", label: "Email" },
    { id: "role", label: "Vai trò" },
    { id: "status", label: "Trạng thái" },
  ];

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          DANH SÁCH NGƯỜI DÙNG
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
            <TableRow
              key={user.username}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/admin/user/${user.userId}`)}
            >
              <TableCell>{user.username || ""}</TableCell>
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

export default AllUsers;
