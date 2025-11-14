import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  TableRow,
  TableCell,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import DataTable from "@/components/content-components/DataTable";
import StatusSummaryCard from "@/components/content-components/StatusSummaryCard";
import { getAllPosInSupplierCompany } from "@/services/purchasing/PoService";
import toastrService from "@/services/toastrService";

const PoInSupplierCompany = () => {
  const [pos, setPos] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdOn");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchPos = async () => {
      try {
        const data = await getAllPosInSupplierCompany(companyId, token);
        const filteredData = data.filter(
          (po) => po.status === "Chờ xác nhận" || po.status === "Đã xác nhận"
        );
        setPos(filteredData);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Không thể lấy danh sách đơn mua hàng!"
        );
      }
    };
    fetchPos();
  }, [companyId, token]);

  const filteredPos =
    filterStatus === "Tất cả"
      ? pos
      : pos.filter((po) => po.status === filterStatus);

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
    { id: "poCode", label: "Mã đơn hàng" },
    { id: "quotationCode", label: "Mã báo giá" },
    { id: "companyCode", label: "Mã khách hàng" },
    { id: "companyName", label: "Tên khách hàng" },
    { id: "paymentMethod", label: "Phương thức thanh toán" },
    { id: "createdOn", label: "Ngày đặt hàng" },
    { id: "status", label: "Trạng thái" },
  ];

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          DANH SÁCH ĐƠN ĐẶT HÀNG
        </Typography>

        <StatusSummaryCard
          data={pos}
          statusLabels={["Tất cả", "Chờ xác nhận", "Đã xác nhận"]}
          getStatus={(po) => po.status}
          statusColors={{
            "Tất cả": "#000",
            "Chờ xác nhận": theme.palette.primary.main,
            "Đã xác nhận": theme.palette.success.main,
          }}
          onSelectStatus={setFilterStatus}
          selectedStatus={filterStatus}
        />

        <DataTable
          rows={filteredPos}
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
          renderRow={(po) => (
            <TableRow
              key={po.poId}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/supplier-po/${po.poId}`)}
            >
              <TableCell>{po.poCode}</TableCell>
              <TableCell>{po.quotationCode}</TableCell>
              <TableCell>{po.companyCode}</TableCell>
              <TableCell>{po.companyName}</TableCell>
              <TableCell>{po.paymentMethod}</TableCell>
              <TableCell>
                {po.createdOn ? new Date(po.createdOn).toLocaleString() : ""}
              </TableCell>
              <TableCell>{po.status}</TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default PoInSupplierCompany;
