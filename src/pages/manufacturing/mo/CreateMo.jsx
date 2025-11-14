import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createMo } from "@/services/manufacturing/MoService";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import { getAllLinesInCompany } from "@/services/general/ManufactureLineService";
import MoForm from "@/components/manufacturing/MoForm";
import dayjs from "dayjs";
import toastrService from "@/services/toastrService";

const CreateMo = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const employeeName = localStorage.getItem("employeeName");

  const [errors, setErrors] = useState({});
  const [items, setItems] = useState([]);
  const [lines, setLines] = useState([]);

  const [mo, setMo] = useState({
    moCode: "",
    itemId: "",
    itemCode: "",
    lineId: "",
    lineCode: "",
    type: "",
    quantity: 0,
    estimatedStartTime: "",
    estimatedEndTime: "",
    createdBy: employeeName,
    status: "Chờ xác nhận",
  });

  useEffect(() => {
    const fetchItemsAndLines = async () => {
      try {
        const itemsData = await getAllItemsInCompany(companyId, token);
        setItems(itemsData);

        const linesData = await getAllLinesInCompany(companyId, token);
        setLines(linesData);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Có lỗi khi lấy dữ liệu!"
        );
      }
    };
    fetchItemsAndLines();
  }, [companyId, token]);

  const validateForm = () => {
    const formErrors = {};
    if (!mo.itemId) formErrors.itemCode = "Phải chọn hàng hóa";
    if (!mo.lineId) formErrors.lineCode = "Phải chọn dây chuyền sản xuất";
    if (!mo.type?.trim()) formErrors.type = "Loại không được để trống";
    if (mo.quantity === "" || mo.quantity <= 0)
      formErrors.quantity = "Số lượng phải > 0";
    if (!mo.status?.trim())
      formErrors.status = "Trạng thái không được để trống";
    if (!mo.estimatedStartTime)
      formErrors.estimatedStartTime = "Phải chọn ngày bắt đầu dự kiến";
    if (!mo.estimatedEndTime)
      formErrors.estimatedEndTime = "Phải chọn ngày kết thúc dự kiến";
    if (mo.estimatedStartTime && mo.estimatedEndTime) {
      const start = new Date(mo.estimatedStartTime);
      const end = new Date(mo.estimatedEndTime);
      if (start >= end) {
        formErrors.estimatedEndTime = "Ngày kết thúc phải sau ngày bắt đầu";
      }
    }
    return formErrors;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    let newValue = value;
    if (type === "number") {
      const num = parseFloat(value);
      if (isNaN(num)) {
        newValue = "";
      } else {
        newValue = num < 0 ? 0 : num;
      }
    }

    setMo((prev) => ({ ...prev, [name]: newValue }));
  };

  const toLocalDateTimeString = (localDateTimeString) => {
    if (!localDateTimeString) return null;
    return dayjs(localDateTimeString).format("YYYY-MM-DDTHH:mm:ss");
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const request = {
        itemId: mo.itemId,
        lineId: mo.lineId,
        type: mo.type,
        quantity: mo.quantity,
        estimatedStartTime: toLocalDateTimeString(mo.estimatedStartTime),
        estimatedEndTime: toLocalDateTimeString(mo.estimatedEndTime),
        status: mo.status,
        createdBy: employeeName,
      };

      console.log(mo.estimatedStartTime);

      await createMo(request, token);
      toastrService.success("Tạo công lệnh thành công!");
      navigate("/mos");
    } catch (error) {
      console.log(error.response);
      toastrService.error(error.response?.data?.message || "Lỗi khi tạo MO!");
    }
  };

  const handleCancel = () => {
    navigate("/mos");
  };

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          THÊM MỚI CÔNG LỆNH SẢN XUẤT
        </Typography>

        <MoForm
          mo={mo}
          onChange={handleChange}
          errors={errors}
          readOnlyFields={{ moCode: true, status: true }}
          setMo={setMo}
          items={items}
          lines={lines}
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

export default CreateMo;
