import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, TableRow, TableCell, Grid, Box, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import DataTable from "@/components/content-components/DataTable";
import { getQuotationByRfq, updateQuotationStatus } from "@/services/sale/QuotationService";
import { updateRfqStatus } from "@/services/purchasing/RfqService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import CustomerQuotationForm from "@/components/sale/CustomerQuotationForm";

const CustomerQuotationDetail = () => {
  const { rfqId } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [quotation, setQuotation] = useState(null);
  const [quotationDetails, setQuotationDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getQuotationByRfq(rfqId, token);
        setQuotation(data);
        setQuotationDetails(data.quotationDetails || []);
      } catch (e) {
        alert(e.response?.data?.message || "Không thể tải báo giá!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [rfqId, token]);

  const columns = [
    { id: "itemCode", label: "Mã hàng hóa" },
    { id: "itemName", label: "Tên hàng hóa" },
    { id: "quantity", label: "Số lượng" },
    { id: "note", label: "Ghi chú" },
    { id: "itemPrice", label: "Đơn giá (VNĐ)" },
    { id: "discount", label: "Chiết khấu (VNĐ)" },
    { id: "total", label: "Thành tiền (VNĐ)" },
  ];

  const handleDecline = async () => {
    const confirmDecline = window.confirm("Bạn có chắc chắn muốn từ chối báo giá này không?");
    if (!confirmDecline) return;

    try {
      await updateQuotationStatus(quotation.quotationId, "Đã từ chối", token);
      alert("Đã từ chối!");

      await updateRfqStatus(rfqId, "Đã từ chối", token);

      setQuotation((prev) => ({
        ...prev,
        status: "Đã từ chối",
      }));
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi khi từ chối báo giá!");
    }
  };

  const handleAccept = async () => {
    const confirmAccept = window.confirm("Bạn có chắc chắn muốn chấp nhận báo giá này không?");
    if (!confirmAccept) return;

    try {
      await updateQuotationStatus(quotation.quotationId, "Đã chấp nhận", token);
      alert("Đã chấp nhận!");

      await updateRfqStatus(rfqId, "Đã chấp nhận", token);

      setQuotation((prev) => ({
        ...prev,
        status: "Đã chấp nhận",
      }));
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi khi chấp nhận báo giá!");
    }
  };

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

  const filteredDetails = Array.isArray(quotationDetails)
    ? quotationDetails
      .sort((a, b) => {
        if (orderBy) {
          if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
          if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
        }
        return 0;
      })
    : [];

  const paginatedDetails = filteredDetails.slice(
    (page - 1) * rowsPerPage,
    (page - 1) * rowsPerPage + rowsPerPage
  );

  if (!quotation) return <LoadingPaper title="THÔNG TIN BÁO GIÁ" />;

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          THÔNG TIN BÁO GIÁ
        </Typography>

        {quotation.status === "Đã báo giá" && (
          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" color="success" onClick={handleAccept}>
              Chấp nhận
            </Button>
            <Button variant="contained" color="error" onClick={handleDecline}>
              Từ chối
            </Button>
          </Box>
        )}

        {quotation.status === "Đã chấp nhận" && (
          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" color="default" onClick={() => navigate(`/create-po/${quotation.quotationId}`)}>
              Mua hàng
            </Button>
          </Box>
        )}

        <CustomerQuotationForm quotation={quotation} />

        <Typography variant="h5" mt={3} mb={3}>
          DANH SÁCH HÀNG HÓA BÁO GIÁ:
        </Typography>

        <DataTable
          rows={paginatedDetails}
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
          isLoading={loading}
          renderRow={(detail, index) => (
            <TableRow key={index}>
              <TableCell>{detail.itemCode}</TableCell>
              <TableCell>{detail.itemName}</TableCell>
              <TableCell>{detail.quantity}</TableCell>
              <TableCell>{detail.note}</TableCell>
              <TableCell>{detail.itemPrice.toLocaleString()}</TableCell>
              <TableCell>{detail.discount.toLocaleString()}</TableCell>
              <TableCell>
                <Typography fontWeight="bold">
                  {(detail.itemPrice * detail.quantity - detail.discount).toLocaleString()}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        />
        <Grid container justifyContent="flex-end" mt={2}>
          <Grid item>
            {[
              { label: "Tổng tiền hàng (VNĐ):", value: quotation.subTotal.toLocaleString() },
              { label: "Thuế (%):", value: quotation.taxRate },
              { label: "Tiền thuế (VNĐ):", value: quotation.taxAmount.toLocaleString() },
              { label: "Tổng cộng (VNĐ):", value: quotation.totalAmount.toLocaleString() },
            ].map((item, index) => (
              <Grid container key={index} justifyContent="space-between" spacing={2}>
                <Grid item mb={3}>
                  <Typography fontWeight="bold">{item.label}</Typography>
                </Grid>
                <Grid item>
                  <Typography fontWeight="bold" align="right">
                    {item.value}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CustomerQuotationDetail;
