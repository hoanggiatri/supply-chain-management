import React, { useState } from "react";
import { Container, Typography, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createPlant } from "@/services/general/ManufacturePlantService";
import PlantForm from "@components/general/PlantForm";
import toastrService from "@/services/toastrService";
import { Button } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";

const CreatePlant = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  const [plant, setPlant] = useState({
    plantCode: "",
    plantName: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlant((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!plant.plantName.trim())
      newErrors.plantName = "Tên xưởng không được để trống";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { companyId: _cid, plantCode, ...payload } = plant || {};
      await createPlant(companyId, payload, token);
      toastrService.success("Tạo xưởng thành công!");
      navigate("/plants");
    } catch (err) {
      toastrService.error(err.response?.data?.message || "Lỗi khi tạo xưởng!");
    }
  };

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          THÊM MỚI XƯỞNG
        </Typography>

        <PlantForm
          plant={plant}
          onChange={handleChange}
          errors={errors}
          readOnlyFields={{ plantCode: true }}
        />

        <Grid container spacing={2} justifyContent="flex-end" mt={2}>
          <Grid item>
            <Button
              type="button"
              {...getButtonProps("primary")}
              onClick={handleSubmit}
            >
              Lưu
            </Button>
          </Grid>
          <Grid item>
            <Button
              type="button"
              {...getButtonProps("outlinedSecondary")}
              onClick={() => navigate("/plants")}
            >
              Hủy
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CreatePlant;
