import React, { useState } from "react";
import { Container, Typography, Button, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createLine } from "@/services/general/ManufactureLineService";
import LineForm from "@components/general/LineForm";

const CreateLine = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [line, setLine] = useState({
    plantId: "",
    lineCode: "",
    lineName: "",
    capacity: 0,
    description: "",
  });

  const [errors, setErrors] = useState({});

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

    setLine((prev) => ({ ...prev, [name]: newValue }));
  };

  const validate = () => {
    const newErrors = {};
    if (!line.plantId) newErrors.plantId = "Vui lòng chọn xưởng";
    if (!line.lineName.trim())
      newErrors.lineName = "Tên dây chuyền không được để trống";
    if (!line.capacity || line.capacity <= 0)
      newErrors.capacity = "Công suất phải lớn hơn 0";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { plantId, lineCode, ...payload } = line;
      await createLine(plantId, payload, token);
      alert("Tạo dây chuyền thành công!");
      navigate("/lines");
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi tạo dây chuyền!");
    }
  };

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          THÊM MỚI DÂY CHUYỀN
        </Typography>

        <LineForm
          line={line}
          onChange={handleChange}
          errors={errors}
          readOnlyFields={{}}
          requireLineCode={false}
        />

        <Grid container spacing={2} justifyContent="flex-end" mt={2}>
          <Grid item>
            <Button variant="contained" color="default" onClick={handleSubmit}>
              Lưu
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="default"
              onClick={() => navigate("/lines")}
            >
              Hủy
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CreateLine;
