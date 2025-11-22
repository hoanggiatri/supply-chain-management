import React, { useEffect, useState } from "react";
import {
  Container,
  TableRow,
  TableCell,
  Typography,
  Paper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/content-components/DataTable";
import StatusSummaryCard from "@/components/content-components/StatusSummaryCard";
import { getAllQuotationsInCompany } from "@/services/sale/QuotationService";
import toastrService from "@/services/toastrService";

const QuotationInCompany = () => {
  const [quotations, setQuotations] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdOn");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  const theme = useTheme();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const data = await getAllQuotationsInCompany(companyId, token);
        setQuotations(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Không thể lấy danh sách báo giá!"
        );
      }
    };
    fetchQuotations();
  }, [companyId, token]);

  const filteredQuotations =
    !filterStatus || filterStatus === "Tất cả"
      ? quotations
      : quotations.filter((q) => q.status === filterStatus);

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
    { id: "quotationCode", label: "Mã báo giá" },
    { id: "rfqCode", label: "Mã yêu cầu" },
    { id: "createdBy", label: "Người báo giá" },
    { id: "createdOn", label: "Ngày báo giá" },
    { id: "status", label: "Trạng thái" },
  ];

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          DANH SÁCH BÁO GIÁ
        </Typography>

        <StatusSummaryCard
          data={quotations}
          statusLabels={["Tất cả", "Đã báo giá", "Đã chấp nhận", "Đã từ chối"]}
          getStatus={(quotation) => quotation.status}
          statusColors={{
            "Tất cả": "#000",
            "Đã báo giá": theme.palette.primary.main,
            "Đã từ chối": theme.palette.error.main,
            "Đã chấp nhận": theme.palette.success.main,
          }}
          onSelectStatus={setFilterStatus}
          selectedStatus={filterStatus}
        />

        <DataTable
          rows={filteredQuotations}
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
          height="calc(100vh - 380px)"
          renderRow={(q) => (
            <TableRow
              key={q.quotationId}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/quotation/${q.rfqId}`)}
            >
              <TableCell>{q.quotationCode}</TableCell>
              <TableCell>{q.rfqCode}</TableCell>
              <TableCell>{q.createdBy}</TableCell>
              <TableCell>
                {q.createdOn ? new Date(q.createdOn).toLocaleString() : ""}
              </TableCell>
              <TableCell>{q.status}</TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default QuotationInCompany;
