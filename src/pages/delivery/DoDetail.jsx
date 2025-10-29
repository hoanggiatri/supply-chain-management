import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Paper, Typography, TableRow, TableCell, Box, Button } from "@mui/material";
import { getDeliveryOrderById, updateDeliveryOrder } from "@/services/delivery/DoService";
import DoForm from "@/components/delivery/DoForm";
import DataTable from "@/components/content-components/DataTable";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import { getSoById, updateSoStatus } from "@/services/sale/SoService";
import { getPoById, updatePoStatus } from "@/services/purchasing/PoService";
import { createDeliveryProcess } from "@/services/delivery/DoProcessService";
import { createReceiveTicket } from "@/services/inventory/ReceiveTicketService";
import dayjs from "dayjs";

const DoDetail = () => {
  const { doId } = useParams();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [deliveryOrder, setDeliveryOrder] = useState(null);
  const [so, setSo] = useState(null);
  const [details, setDetails] = useState([]);
  const navigate = useNavigate();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const doData = await getDeliveryOrderById(doId, token);
        setDeliveryOrder(doData);

        const soData = await getSoById(doData.soId, token);
        setSo(soData);

        setDetails(doData.deliveryOrderDetails || []);
      } catch (err) {
        alert(err.response?.data?.message || "Không thể tải dữ liệu đơn giao hàng!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doId, token]);

  const toLocalDateTimeString = (localDateTimeString = dayjs()) => {
    return dayjs(localDateTimeString).format("YYYY-MM-DDTHH:mm:ss");
  };


  const handleConfirm = async () => {
    if (!window.confirm("Bạn có chắc muốn xác nhận đơn vận chuyển này không?")) return;

    const employeeName = localStorage.getItem("employeeName");
    try {
      const request = {
        createdBy: employeeName,
        status: "Chờ lấy hàng"
      }
      await updateDeliveryOrder(deliveryOrder.doId, request, token);
      setDeliveryOrder((prev) => ({ ...prev, status: "Chờ lấy hàng", createdBy: employeeName }));

      await updateSoStatus(so.soId, "Đang vận chuyển", token);
      await updatePoStatus(so.poId, "Đang vận chuyển", token);

      alert("Xác nhận đơn vận chuyển thành công!");
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra khi xác nhận phiếu!");
    }
  };

  const handlePickup = async () => {
    if (!window.confirm("Đã lấy hàng cho đơn vận chuyển này?")) return;

    try {
      const fromProcess = {
        doId: deliveryOrder.doId,
        location: so.deliveryFromAddress,
        arrivalTime: toLocalDateTimeString(),
        note: "from",
      }
      await createDeliveryProcess(fromProcess, token);

      await updateDeliveryOrder(deliveryOrder.doId, { ...deliveryOrder, status: "Đang vận chuyển" }, token);
      setDeliveryOrder((prev) => ({ ...prev, status: "Đang vận chuyển" }));

      alert("Lấy hàng thành công!");

    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra khi lấy hàng!");
    }
  }

  const handleComplete = async () => {
    if (!window.confirm("Bạn có chắc muốn hoàn thành đơn vận chuyển này không?")) return;

    try {
      const toProcess = {
        doId: deliveryOrder.doId,
        location: so.deliveryToAddress,
        arrivalTime: toLocalDateTimeString(),
        note: "to",
      }

      await createDeliveryProcess(toProcess, token);

      await updateDeliveryOrder(deliveryOrder.doId, { ...deliveryOrder, status: "Đã hoàn thành" }, token);
      setDeliveryOrder((prev) => ({ ...prev, status: "Đã hoàn thành" }));

      await updateSoStatus(so.soId, "Đã hoàn thành", token);
      await updatePoStatus(so.poId, "Chờ nhập kho", token);

      const po = await getPoById(so.poId, token);

      const receiveTicketRequest = {
        companyId: so.customerCompanyId,
        warehouseId: po.receiveWarehouseId,
        reason: "Nhập hàng mua về",
        receiveType: "Mua hàng",
        referenceCode: so.poCode,
        status: "Chờ xác nhận",
      };

      await createReceiveTicket(receiveTicketRequest, token);
      alert("Đã hoàn thành đơn vận chuyển!");

    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra khi hoàn thành đơn vận chuyển!");
    }
  }

  const columns = [
    { id: "itemCode", label: "Mã hàng hóa" },
    { id: "itemName", label: "Tên hàng hóa" },
    { id: "quantity", label: "Số lượng" },
    { id: "note", label: "Ghi chú" },
  ];

  const sortedDetails = [...details].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedDetails = sortedDetails.slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage);

  if (!deliveryOrder) return <LoadingPaper title="CHI TIẾT ĐƠN VẬN CHUYỂN" />;

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          CHI TIẾT ĐƠN VẬN CHUYỂN
        </Typography>

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          {deliveryOrder.status === "Chờ xác nhận" && (
            <Button variant="contained" color="default" onClick={handleConfirm}>
              Xác nhận
            </Button>
          )}
          {deliveryOrder.status === "Chờ lấy hàng" && (
            <Button variant="contained" color="default" onClick={handlePickup}>
              Lấy hàng
            </Button>
          )}
          {deliveryOrder.status === "Đang vận chuyển" && (
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="contained" color="success" onClick={() => navigate(`/update-do-process/${deliveryOrder.doId}`)}>
                Thông tin vận chuyển
              </Button>
              <Button variant="contained" color="default" onClick={handleComplete}>
                Hoàn thành
              </Button>
            </Box>
          )}
          {deliveryOrder.status === "Đã hoàn thành" && (
            <Button variant="contained" color="success" onClick={() => navigate(`/do-process/${deliveryOrder.doId}`)}>
              Thông tin vận chuyển
            </Button>
          )}
        </Box>

        <DoForm deliveryOrder={deliveryOrder} />

        <Typography variant="h5" mt={3} mb={3}>
          DANH SÁCH HÀNG HÓA:
        </Typography>

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
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default DoDetail;
