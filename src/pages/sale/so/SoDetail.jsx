import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Paper, Typography, TableRow, TableCell, Grid, Box, Button } from "@mui/material";
import { getSoById } from "@/services/sale/SoService";
import SoForm from "@/components/sale/SoForm";
import DataTable from "@/components/content-components/DataTable";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import { getPoById } from "@/services/purchasing/PoService";
import { getInvoicePdf } from "@/services/sale/InvoiceService";
import { getDeliveryOrderBySoId } from "@/services/delivery/DoService";

const SoDetail = () => {
  const { soId } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [so, setSo] = useState(null);
  const [po, setPo] = useState(null);
  const [deliveryOrder, setDeliveryOrder] = useState(null);
  const [soDetails, setSoDetails] = useState([]);

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchSo = async () => {
      setLoading(true);
      try {
        const soData = await getSoById(soId, token);
        setSo(soData);

        const poData = await getPoById(soData.poId, token);
        setPo(poData);

        const doData = await getDeliveryOrderBySoId(soId, token);
        setDeliveryOrder(doData);

        const details = soData.salesOrderDetails.map((d) => ({
          itemId: d.itemId,
          itemCode: d.itemCode,
          itemName: d.itemName,
          quantity: d.quantity,
          itemPrice: d.itemPrice,
          discount: d.discount,
          note: d.note,
        }));
        setSoDetails(details);
      } catch (err) {
        alert(err.response?.data?.message || "Không thể tải dữ liệu đơn bán hàng!");
      } finally {
        setLoading(false);
      }
    };

    fetchSo();
  }, [soId, token]);

  const columns = [
    { id: "itemCode", label: "Mã hàng hóa" },
    { id: "itemName", label: "Tên hàng hóa" },
    { id: "quantity", label: "Số lượng" },
    { id: "note", label: "Ghi chú" },
    { id: "itemPrice", label: "Đơn giá (VNĐ)" },
    { id: "discount", label: "Chiết khấu (VNĐ)" },
    { id: "total", label: "Thành tiền (VNĐ)" },
  ];

  const sortedDetails = [...soDetails].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedDetails = sortedDetails.slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage);

  if (!so || !po) return <LoadingPaper title="CHI TIẾT ĐƠN BÁN HÀNG" />;

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">CHI TIẾT ĐƠN BÁN HÀNG</Typography>

        {so && (so.status === "Đang vận chuyển") && (
          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" color="success" onClick={() => navigate(`/do-process/${deliveryOrder.doId}`)}>
              Thông tin vận chuyển
            </Button>
          </Box>
        )}
        {so && so.status === "Đã hoàn thành" && (
          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" color="default" onClick={() => getInvoicePdf(so.soId, token)}>
              Xem hóa đơn
            </Button>
            <Button variant="contained" color="success" onClick={() => navigate(`/do-process/${deliveryOrder.doId}`)}>
              Thông tin vận chuyển
            </Button>
          </Box>
        )}

        <SoForm po={po} so={so} readOnly />

        <Typography variant="h5" mt={3} mb={3}>DANH SÁCH HÀNG HÓA:</Typography>

        <DataTable
          rows={paginatedDetails}
          columns={columns}
          order={order}
          orderBy={orderBy}
          onRequestSort={(property) => {
            const isAsc = orderBy === property && order === "asc";
            setOrder(isAsc ? "desc" : "asc");
            setOrderBy(property);
          }}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
          }}
          isLoading={loading}
          renderRow={(row, index) => (
            <TableRow key={index}>
              <TableCell>{row.itemCode}</TableCell>
              <TableCell>{row.itemName}</TableCell>
              <TableCell>{row.quantity}</TableCell>
              <TableCell>{row.note}</TableCell>
              <TableCell>{row.itemPrice.toLocaleString()}</TableCell>
              <TableCell>{row.discount.toLocaleString()}</TableCell>
              <TableCell>
                <Typography fontWeight="bold">
                  {(row.itemPrice * row.quantity - row.discount).toLocaleString()}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        />

        <Grid container justifyContent="flex-end" mt={3}>
          <Grid item>
            {[
              { label: "Tổng tiền hàng (VNĐ):", value: so.subTotal.toLocaleString() },
              { label: "Thuế (%):", value: so.taxRate },
              { label: "Tiền thuế (VNĐ):", value: so.taxAmount.toLocaleString() },
              { label: "Tổng cộng (VNĐ):", value: so.totalAmount.toLocaleString() },
            ].map((item, index) => (
              <Grid container key={index} justifyContent="space-between" spacing={2}>
                <Grid item mb={2}>
                  <Typography fontWeight="bold">{item.label}</Typography>
                </Grid>
                <Grid item>
                  <Typography fontWeight="bold">{item.value}</Typography>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SoDetail;
