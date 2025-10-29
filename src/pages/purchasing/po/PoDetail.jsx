import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, TableRow, TableCell, Grid, Box, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import DataTable from "@/components/content-components/DataTable";
import PoForm from "@/components/purchasing/PoForm";
import { getPoById, updatePoStatus } from "@/services/purchasing/PoService";
import { getQuotationById } from "@/services/sale/QuotationService";
import { getInvoicePdf } from "@/services/sale/InvoiceService";
import { getSoByPoId } from "@/services/sale/SoService";
import { getDeliveryOrderBySoId } from "@/services/delivery/DoService";

const PoDetail = () => {
  const { poId } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [po, setPo] = useState(null);
  const [quotation, setQuotation] = useState(null);
  const [details, setDetails] = useState([]);
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
        const poData = await getPoById(poId, token);
        console.log("PO Data:", poData);
        setPo(poData);

        const quotationData = await getQuotationById(poData.quotationId, token);
        setQuotation(quotationData);
        setDetails(poData.purchaseOrderDetails || []);
      } catch (error) {
        alert(error.response?.poData?.message || "Không thể tải chi tiết đơn mua hàng!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [poId, token]);

  const handleCancel = async () => {
    const confirmCancel = window.confirm("Bạn có chắc chắn muốn hủy đơn mua hàng này không?");
    if (!confirmCancel) return;

    try {
      await updatePoStatus(po.poId, "Đã hủy", token);
      alert("Đã hủy đơn mua hàng!");

      setPo((prev) => ({
        ...prev,
        status: "Đã hủy",
      }));
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi khi hủy đơn mua hàng!");
    }
  };

  const handleViewDoProcess = async () => {
    try {
      const soData = await getSoByPoId(po.poId, token);
      const doData = await getDeliveryOrderBySoId(soData.soId, token);
      navigate(`/do-process/${doData.doId}`);
    } catch (error) {
      alert("Không thể tải thông tin vận chuyển");
    }
  };

  const handleViewInvoice = async () => {
    try {
      const soData = await getSoByPoId(po.poId, token);
      await getInvoicePdf(soData.soId, token);
    } catch (error) {
      alert("Không thể tải hóa đơn");
    }
  };

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

  const filteredDetails = Array.isArray(details)
    ? [...details].sort((a, b) => {
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

  const readOnlyFields = {
    paymentMethod: true,
    receiveWarehouseId: true,
    deliveryToAddress: true,
  };

  if (loading || !po) return <LoadingPaper title="CHI TIẾT ĐƠN MUA HÀNG" />;

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          CHI TIẾT ĐƠN MUA HÀNG
        </Typography>

        {po && po.status === "Chờ xác nhận" && (
          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" color="error" onClick={handleCancel}>
              Hủy
            </Button>
          </Box>
        )}
        {po && (po.status === "Đang vận chuyển" || po.status === "Chờ nhập kho") && (
          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" color="success" onClick={handleViewDoProcess}>
              Thông tin vận chuyển
            </Button>
          </Box>
        )}
        {po && po.status === "Đã hoàn thành" && (
          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" color="default" onClick={handleViewInvoice}>
              Xem hóa đơn
            </Button>
            <Button variant="contained" color="success" onClick={handleViewDoProcess}>
              Thông tin vận chuyển
            </Button>
          </Box>
        )}

        <PoForm po={po} quotation={quotation} readOnly setPo={[]} errors={[]} readOnlyFields={readOnlyFields} />

        <Typography variant="h5" mt={3} mb={3}>
          DANH SÁCH HÀNG HÓA:
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
              { label: "Tổng tiền hàng (VNĐ):", value: po?.subTotal.toLocaleString() },
              { label: "Thuế (%):", value: po?.taxRate },
              { label: "Tiền thuế (VNĐ):", value: po?.taxAmount.toLocaleString() },
              { label: "Tổng cộng (VNĐ):", value: po?.totalAmount.toLocaleString() },
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

export default PoDetail;
