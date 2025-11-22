import React, { useEffect, useState } from "react";
import {
  Container,
  TableRow,
  TableCell,
  Typography,
  Paper,
} from "@mui/material";
import DataTable from "@components/content-components/DataTable";
import StatusSummaryCard from "@/components/content-components/StatusSummaryCard";
import { getAllRfqsInRequestedCompany } from "@/services/purchasing/RfqService";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import toastrService from "@/services/toastrService";

const RfqInSupplierCompany = () => {
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
        const data = await getAllRfqsInRequestedCompany(companyId, token);
        const filteredData = data.filter(
          (rfq) => rfq.status === "Chưa báo giá"
        );
        setRfqs(filteredData);
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
    { id: "companyName", label: "Công ty yêu cầu" },
    { id: "needByDate", label: "Hạn báo giá" },
    { id: "createdOn", label: "Ngày yêu cầu" },
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
          statusLabels={["Tất cả", "Chưa báo giá", "Đã báo giá"]}
          getStatus={(rfq) => rfq.status}
          statusColors={{
            "Tất cả": "#000",
            "Chưa báo giá": theme.palette.warning.main,
            "Đã báo giá": theme.palette.success.main,
          }}
          onSelectStatus={(status) => setFilterStatus(status)}
          selectedStatus={filterStatus}
        />

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
          height="calc(100vh - 380px)"
          setSearch={setSearch}
          renderRow={(rfq) => (
            <TableRow
              key={rfq.rfqCode}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/supplier-rfq/${rfq.rfqId}`)}
            >
              <TableCell>{rfq.rfqCode || ""}</TableCell>
              <TableCell>{rfq.companyName || ""}</TableCell>
              <TableCell>
                {rfq.needByDate
                  ? new Date(rfq.needByDate).toLocaleString()
                  : ""}
              </TableCell>
              <TableCell>
                {rfq.createdOn ? new Date(rfq.createdOn).toLocaleString() : ""}
              </TableCell>
              <TableCell>{rfq.status || ""}</TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default RfqInSupplierCompany;
