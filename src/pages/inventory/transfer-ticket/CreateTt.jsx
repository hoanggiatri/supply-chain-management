import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import { createTransferTicket } from "@/services/inventory/TransferTicketService";
import TtForm from "@/components/inventory/TtForm";
import TtDetailTable from "@/components/inventory/TtDetailTable";
import toastrService from "@/services/toastrService";

const CreateTt = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = parseInt(localStorage.getItem("companyId"));
  const employeeName = localStorage.getItem("employeeName");

  const [errors, setErrors] = useState({ transferDetailErrors: [] });
  const [details, setDetails] = useState([]);
  const [items, setItems] = useState([]);

  const [ticket, setTicket] = useState({
    companyId,
    ticketCode: "",
    reason: "",
    fromWarehouseId: "",
    toWarehouseId: "",
    fromWarehouseCode: "",
    toWarehouseCode: "",
    fromWarehouseName: "",
    toWarehouseName: "",
    status: "Chờ xác nhận",
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getAllItemsInCompany(companyId, token);
        setItems(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Lỗi khi tải danh sách hàng hóa!"
        );
      }
    };
    fetchItems();
  }, [companyId, token]);

  const validateForm = () => {
    const formErrors = {};
    if (!ticket.reason?.trim()) formErrors.reason = "Lý do không được để trống";
    if (!ticket.fromWarehouseCode)
      formErrors.fromWarehouseCode = "Chưa chọn kho xuất";
    if (!ticket.toWarehouseCode)
      formErrors.toWarehouseCode = "Chưa chọn kho nhập";
    if (ticket.fromWarehouseCode === ticket.toWarehouseCode)
      formErrors.toWarehouseCode = "Kho xuất và kho nhập không được giống nhau";
    return formErrors;
  };

  const validateDetails = () => {
    const tableErrors = [];

    details.forEach((detail, index) => {
      if (!detail.itemId) {
        tableErrors.push({
          index,
          field: "itemId",
          message: "Phải chọn hàng hóa",
        });
      }
      if (detail.quantity < 0) {
        tableErrors.push({ index, field: "quantity", message: ">=0" });
      }
    });

    return tableErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    const transferDetailErrors = validateDetails();

    if (Object.keys(formErrors).length > 0 || transferDetailErrors.length > 0) {
      setErrors({ ...formErrors, transferDetailErrors });
      return;
    }

    try {
      const request = {
        companyId: companyId,
        fromWarehouseId: parseInt(ticket.fromWarehouseId),
        toWarehouseId: parseInt(ticket.toWarehouseId),
        reason: ticket.reason,
        createdBy: employeeName,
        status: ticket.status,
        file: ticket.file,
        transferTicketDetails: details.map((detail) => ({
          itemId: parseInt(detail.itemId),
          quantity: parseFloat(detail.quantity),
          note: detail.note,
        })),
      };
      console.log("Request", request);

      await createTransferTicket(request, token);
      toastrService.success("Tạo phiếu chuyển kho thành công!");
      navigate("/transfer-tickets");
    } catch (error) {
      console.log(error.response);
      toastrService.error(
        error.response?.data?.message || "Lỗi khi tạo phiếu chuyển kho!"
      );
    }
  };

  const handleCancel = () => {
    navigate("/transfer-tickets");
  };

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          TẠO PHIẾU CHUYỂN KHO
        </Typography>

        <TtForm
          ticket={ticket}
          onChange={handleChange}
          readOnlyFields={{ ticketCode: true, status: true }}
          setTicket={setTicket}
          errors={errors}
        />

        <Typography variant="h5" mt={3} mb={3}>
          DANH SÁCH HÀNG HÓA:
        </Typography>

        <TtDetailTable
          ticketDetails={details}
          setTicketDetails={setDetails}
          items={items}
          errors={errors.transferDetailErrors}
        />

        <Grid container spacing={2} mt={3} justifyContent="flex-end">
          <Grid item>
            <Button variant="contained" color="default" onClick={handleSubmit}>
              Thêm
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="default" onClick={handleCancel}>
              Hủy
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CreateTt;
