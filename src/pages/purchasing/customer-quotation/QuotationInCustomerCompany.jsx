import React, { useEffect, useState } from "react";
import {
  Container,
  TableRow,
  TableCell,
  Typography,
  Paper,
} from "@mui/material";
import DataTable from "@components/content-components/DataTable";
import { getAllQuotationsInRequestCompany } from "@/services/sale/QuotationService";
import { useNavigate } from "react-router-dom";
import StatusSummaryCard from "@/components/content-components/StatusSummaryCard";
import { useTheme } from "@mui/material/styles";
import toastrService from "@/services/toastrService";

const QuotationInCustomerCompany = () => {
  const [quotations, setQuotations] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdOn");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const theme = useTheme();
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const data = await getAllQuotationsInRequestCompany(companyId, token);
        const filteredData = data.filter(
          (quotation) =>
            quotation.status === "Đã chấp nhận" ||
            quotation.status === "Đã báo giá" ||
            quotation.status === "Đã từ chối"
        );
        setQuotations(filteredData);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Có lỗi khi lấy danh sách báo giá!"
        );
      }
    };

    fetchQuotations();
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

  const filteredQuotations =
    filterStatus === "Tất cả"
      ? quotations
      : quotations.filter((quotation) => quotation.status === filterStatus);

  const columns = [
    { id: "rfqCode", label: "Mã yêu cầu" },
    { id: "quotationCode", label: "Mã báo giá" },
    { id: "companyCode", label: "Mã công ty báo giá" },
    { id: "companyName", label: "Công ty báo giá" },
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
            "Đã chấp nhận": theme.palette.success.main,
            "Đã từ chối": theme.palette.error.main,
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
          renderRow={(quotation) => (
            <TableRow
              key={quotation.quotationCode}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/customer-quotation/${quotation.rfqId}`)}
            >
              <TableCell>{quotation.rfqCode || ""}</TableCell>
              <TableCell>{quotation.quotationCode || ""}</TableCell>
              <TableCell>{quotation.companyCode || ""}</TableCell>
              <TableCell>{quotation.companyName || ""}</TableCell>
              <TableCell>
                {quotation.createdOn
                  ? new Date(quotation.createdOn).toLocaleString()
                  : ""}
              </TableCell>
              <TableCell>{quotation.status || ""}</TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default QuotationInCustomerCompany;
