import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import MoForm from "@/components/manufacturing/MoForm";
import { getMoById, updateMo } from "@/services/manufacturing/MoService";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import { getAllLinesInCompany } from "@/services/general/ManufactureLineService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import dayjs from "dayjs";

const EditMo = () => {
  const { moId } = useParams();
  const [mo, setMo] = useState(null);
  const [errors, setErrors] = useState({});
  const [items, setItems] = useState([]);
  const [lines, setLines] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMo = async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await getMoById(moId, token);
        setMo(data);
      } catch (error) {
        alert(error.response?.data?.message || "Có lỗi khi lấy công lệnh!");
      }
    };
    fetchMo();
  }, [moId]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyId");
      try {
        const itemsData = await getAllItemsInCompany(companyId, token);
        setItems(itemsData);

        const linesData = await getAllLinesInCompany(companyId, token);
        setLines(linesData);
      } catch (error) {
        alert(error.response?.data?.message || "Có lỗi khi lấy dữ liệu!");
      }
    };

    fetchData();
  }, []);

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

  const validateForm = () => {
    const formErrors = {};
    if (!mo.quantity || mo.quantity <= 0) formErrors.quantity = "Số lượng phải > 0";
    if (!mo.estimatedStartTime) formErrors.estimatedStartTime = "Vui lòng chọn thời gian bắt đầu!";
    if (!mo.estimatedEndTime) formErrors.estimatedEndTime = "Vui lòng chọn thời gian kết thúc!";
    if (mo.estimatedStartTime && mo.estimatedEndTime) {
      const start = new Date(mo.estimatedStartTime);
      const end = new Date(mo.estimatedEndTime);
      if (start >= end) formErrors.estimatedEndTime = "Ngày kết thúc phải sau ngày bắt đầu!";
    }
    return formErrors;
  };

  const handleSave = async () => {
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const token = localStorage.getItem("token");
    try {
      const request = {
        ...mo,
        estimatedStartTime: toLocalDateTimeString(mo.estimatedStartTime),
        estimatedEndTime: toLocalDateTimeString(mo.estimatedEndTime),
      };
      await updateMo(moId, request, token);
      alert("Cập nhật công lệnh thành công!");
      navigate(-1);
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi khi cập nhật!");
    }
  };

  if (!mo) {
    return <LoadingPaper title="CHỈNH SỬA CÔNG LỆNH" />;
  }

  const readOnlyFields = {
    moCode: true,
    status: true,
    itemId: true,
    lineId: true,
  };

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          CHỈNH SỬA CÔNG LỆNH
        </Typography>

        <MoForm mo={mo} onChange={handleChange} errors={errors} setMo={setMo} items={items} lines={lines} readOnlyFields={readOnlyFields} />

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="contained" color="default" onClick={handleSave}>
            Lưu
          </Button>
          <Button variant="outlined" color="default" onClick={() => navigate(-1)}>
            Hủy
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditMo;
