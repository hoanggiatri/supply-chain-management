import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TableRow,
  TableCell,
  Grid,
  Box,
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import DataTable from "@/components/content-components/DataTable";
import QuotationForm from "@/components/sale/QuotationForm";
import { getQuotationByRfq } from "@/services/sale/QuotationService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import { getRfqById } from "@/services/purchasing/RfqService";
import toastrService from "@/services/toastrService";

const QuotationDetail = () => {
  const { rfqId } = useParams();
  const token = localStorage.getItem("token");

  const [rfq, setRfq] = useState(null);
  const [quotation, setQuotation] = useState(null);
  const [quotationDetails, setQuotationDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const Rfqdata = await getRfqById(rfqId, token);
        setRfq(Rfqdata);
        const data = await getQuotationByRfq(rfqId, token);
        setQuotation(data);
        setQuotationDetails(data.quotationDetails || []);
      } catch (e) {
        toastrService.error(
          e.response?.data?.message || "Không thể tải báo giá!"
        );
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
    ? quotationDetails.sort((a, b) => {
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

  if (!quotation) return <LoadingPaper title="CHI TIẾT BÁO GIÁ" />;

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          CHI TIẾT BÁO GIÁ
        </Typography>

        <Box mt={3} display="flex" justifyContent="flex-start" gap={2}>
          <Button
            variant="contained"
            color="info"
            onClick={() => navigate(`/supplier-rfq/${rfqId}`)}
          >
            Xem yêu cầu báo giá
          </Button>
        </Box>

        <QuotationForm rfq={rfq} quotation={quotation} />

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
                  {(
                    detail.itemPrice * detail.quantity -
                    detail.discount
                  ).toLocaleString()}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        />
        <Grid container justifyContent="flex-end" mt={2}>
          <Grid item>
            {[
              {
                label: "Tổng tiền hàng (VNĐ):",
                value: quotation.subTotal.toLocaleString(),
              },
              { label: "Thuế (%):", value: quotation.taxRate },
              {
                label: "Tiền thuế (VNĐ):",
                value: quotation.taxAmount.toLocaleString(),
              },
              {
                label: "Tổng cộng (VNĐ):",
                value: quotation.totalAmount.toLocaleString(),
              },
            ].map((item, index) => (
              <Grid
                container
                key={index}
                justifyContent="space-between"
                spacing={2}
              >
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

export default QuotationDetail;
