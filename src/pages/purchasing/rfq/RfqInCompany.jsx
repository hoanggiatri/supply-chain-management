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
import StatusSummaryCard from "@/components/content-components/StatusSummaryCard";
import { getAllRfqsInCompany } from "@/services/purchasing/RfqService";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import toastrService from "@/services/toastrService";

const RfqInCompany = () => {
  const [rfqs, setRfqs] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdOn");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const navigate = useNavigate();
  const theme = useTheme();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchRfqs = async () => {
      try {
        const data = await getAllRfqsInCompany(companyId, token);
        setRfqs(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi khi lấy danh sách yêu cầu báo giá!"
        );
      }
    };

    fetchRfqs();
  }, [companyId, token]);

  const filteredRfqs =
    !filterStatus || filterStatus === "Tất cả"
      ? rfqs
      : rfqs.filter((rfq) => rfq.status === filterStatus);

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
    { id: "rfqCode", label: "Mã yêu cầu" },
    { id: "requestedCompanyName", label: "Công ty báo giá" },
    { id: "needByDate", label: "Hạn báo giá" },
    { id: "createdBy", label: "Người tạo" },
    { id: "createdOn", label: "Ngày tạo" },
    { id: "lastUpdatedOn", label: "Cập nhật" },
    { id: "status", label: "Trạng thái" },
  ];

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          DANH SÁCH YÊU CẦU BÁO GIÁ
        </Typography>
        <StatusSummaryCard
          data={rfqs}
          statusLabels={[
            "Tất cả",
            "Chưa báo giá",
            "Đã báo giá",
            "Quá hạn báo giá",
            "Đã chấp nhận",
            "Đã từ chối",
            "Đã hủy",
          ]}
          getStatus={(rfq) => rfq.status}
          statusColors={{
            "Tất cả": "#000",
            "Chưa báo giá": theme.palette.secondary.main,
            "Đã báo giá": theme.palette.primary.main,
            "Quá hạn báo giá": theme.palette.error.main,
            "Đã chấp nhận": theme.palette.success.main,
            "Đã từ chối": theme.palette.warning.main,
            "Đã hủy": theme.palette.error.main,
          }}
          onSelectStatus={(status) => setFilterStatus(status)}
          selectedStatus={filterStatus}
        />
        <Box mb={3}>
          <Button
            variant="contained"
            color="default"
            onClick={() => navigate("/create-rfq")}
          >
            Thêm mới
          </Button>
        </Box>
        <DataTable
          rows={filteredRfqs}
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
          height="calc(100vh - 450px)"
          renderRow={(rfq) => (
            <TableRow
              key={rfq.rfqCode}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/rfq/${rfq.rfqId}`)}
            >
              <TableCell>{rfq.rfqCode || ""}</TableCell>
              <TableCell>{rfq.requestedCompanyName || ""}</TableCell>
              <TableCell>
                {rfq.needByDate
                  ? new Date(rfq.needByDate).toLocaleDateString()
                  : ""}
              </TableCell>
              <TableCell>{rfq.createdBy || ""}</TableCell>
              <TableCell>
                {rfq.createdOn ? new Date(rfq.createdOn).toLocaleString() : ""}
              </TableCell>
              <TableCell>
                {rfq.lastUpdatedOn
                  ? new Date(rfq.lastUpdatedOn).toLocaleString()
                  : ""}
              </TableCell>
              <TableCell>{rfq.status || ""}</TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default RfqInCompany;
