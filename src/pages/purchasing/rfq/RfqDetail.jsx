import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, TableRow, TableCell, Box, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import DataTable from "@/components/content-components/DataTable";
import { getRfqById, updateRfqStatus } from "@/services/purchasing/RfqService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import RfqForm from "@/components/purchasing/RfqForm";

const RfqDetail = () => {
  const { rfqId } = useParams();
  const [rfq, setRfq] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchRfq = async () => {
      setLoading(true);
      try {
        const data = await getRfqById(rfqId, token);
        setRfq(data);
      } catch (error) {
        alert(error.response?.data?.message || "Lỗi khi tải RFQ");
      } finally {
        setLoading(false);
      }
    };
    fetchRfq();
  }, [rfqId, token]);

  const readOnlyFields = {
    rfqCode: true,
    requestedCompanyCode: true,
    needByDate: true,
    createdBy: true,
    status: true,
  };

  const columns = [
    { id: "itemCode", label: "Mã hàng hóa" },
    { id: "itemName", label: "Tên hàng hóa" },
    { id: "supplierItemCode", label: "Mã hàng hóa NCC" },
    { id: "supplierItemName", label: "Tên hàng hóa NCC" },
    { id: "quantity", label: "Số lượng" },
    { id: "note", label: "Ghi chú" },
  ];

  const filteredDetails = rfq?.rfqDetails?.sort((a, b) => {
    if (orderBy && a[orderBy] !== undefined && b[orderBy] !== undefined) {
      if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    }
    return 0;
  }) || [];

  const paginatedDetails = filteredDetails.slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleCancel = async () => {
    const confirmCancel = window.confirm("Bạn có chắc chắn muốn hủy yêu cầu báo giá này không?");
    if (!confirmCancel) return;

    try {
      await updateRfqStatus(rfq.rfqId, "Đã hủy", token);
      alert("Đã hủy yêu cầu báo giá!");

      setRfq((prev) => ({
        ...prev,
        status: "Đã hủy",
      }));
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi khi hủy yêu cầu báo giá!");
    }
  };

  if (!rfq) return <LoadingPaper title="THÔNG TIN YÊU CẦU BÁO GIÁ" />;

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          THÔNG TIN YÊU CẦU BÁO GIÁ
        </Typography>

        <Box mt={3} mb={3} display="flex" justifyContent="flex-end" gap={2}>
          {rfq.status === "Chưa báo giá" && (
            <Button variant="contained" color="error" onClick={handleCancel}>
              Hủy
            </Button>
          )}
          {rfq.status === "Đã báo giá" && (
            <Button variant="contained" color="default" onClick={() => navigate(`/customer-quotation/${rfq.rfqId}`)}>
              Xem báo giá
            </Button>
          )}
        </Box>

        <RfqForm rfq={rfq} onChange={() => { }} errors={{}} readOnlyFields={readOnlyFields} setRfq={setRfq} />

        <Typography variant="h5" mt={3} mb={3}>
          DANH SÁCH HÀNG HÓA YÊU CẦU BÁO GIÁ:
        </Typography>

        <DataTable
          rows={paginatedDetails}
          columns={columns}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(1); }}
          search={search}
          setSearch={setSearch}
          isLoading={loading}
          renderRow={(detail, index) => (
            <TableRow key={index}>
              <TableCell>{detail.itemCode}</TableCell>
              <TableCell>{detail.itemName}</TableCell>
              <TableCell>{detail.supplierItemCode}</TableCell>
              <TableCell>{detail.supplierItemName}</TableCell>
              <TableCell>{detail.quantity}</TableCell>
              <TableCell>{detail.note}</TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default RfqDetail;
