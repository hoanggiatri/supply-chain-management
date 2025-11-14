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
import { getAllCompanies } from "@/services/general/CompanyService";
import toastrService from "@/services/toastrService";

const AllCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("companyCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getAllCompanies(token, {
          page,
          pageSize: rowsPerPage,
        });
        setCompanies(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy danh sách công ty!"
        );
      }
    };

    if (token) fetchCompanies();
  }, [token, page, rowsPerPage]);

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
    { id: "companyCode", label: "Mã công ty" },
    { id: "companyName", label: "Tên công ty" },
    { id: "taxCode", label: "Mã số thuế" },
    { id: "representativeName", label: "Người đại diện" },
    { id: "companyType", label: "Loại hình" },
    { id: "startDate", label: "Ngày thành lập" },
    { id: "joinDate", label: "Ngày tham gia" },
    { id: "status", label: "Trạng thái" },
  ];

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          DANH SÁCH CÔNG TY
        </Typography>
        <DataTable
          rows={companies}
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
          renderRow={(company) => (
            <TableRow
              key={company.companyId}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/admin/company/${company.companyId}`)}
            >
              <TableCell>{company.companyCode || ""}</TableCell>
              <TableCell>{company.companyName || ""}</TableCell>
              <TableCell>{company.taxCode || ""}</TableCell>
              <TableCell>{company.representativeName || ""}</TableCell>
              <TableCell>{company.companyType || ""}</TableCell>
              <TableCell>
                {new Date(company.startDate).toLocaleString() || ""}
              </TableCell>
              <TableCell>
                {new Date(company.joinDate).toLocaleString() || ""}
              </TableCell>
              <TableCell>{company.status || ""}</TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default AllCompanies;
