import React, { useEffect, useState } from "react";
import {
  Container,
  TableRow,
  TableCell,
  Typography,
  Paper,
  Box,
  Button,
} from "@mui/material";
import DataTable from "@components/content-components/DataTable";
import { getAllEmployeesInCompany } from "@/services/general/EmployeeService";
import { useNavigate } from "react-router-dom";

const EmployeeInCompany = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("employeeCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employees = await getAllEmployeesInCompany(companyId, token);
        setEmployees(employees);
      } catch (error) {
        alert(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy danh sách nhân viên!"
        );
      }
    };

    fetchEmployees();
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
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          DANH SÁCH NHÂN VIÊN
        </Typography>
        <Box mt={3} mb={3}>
          <Button
            variant="contained"
            color="default"
            onClick={() => navigate("/create-employee")}
          >
            Thêm mới
          </Button>
        </Box>
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
          renderRow={(emp) => (
            <TableRow
              key={emp.id}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/employee/${emp.id}`)}
            >
              <TableCell>{emp.employeeCode || ""}</TableCell>
              <TableCell>{emp.employeeName || ""}</TableCell>
              <TableCell>{emp.departmentName || ""}</TableCell>
              <TableCell>{emp.position || ""}</TableCell>
              <TableCell>{emp.gender || ""}</TableCell>
              <TableCell>{emp.dateOfBirth || ""}</TableCell>
              <TableCell>{emp.email || ""}</TableCell>
              <TableCell>{emp.phoneNumber || ""}</TableCell>
              <TableCell>{emp.status || ""}</TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default EmployeeInCompany;
