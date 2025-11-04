import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import PlantForm from "@components/general/PlantForm";
import {
  getPlantById,
  updatePlant,
} from "@/services/general/ManufacturePlantService";
import LoadingPaper from "@/components/content-components/LoadingPaper";

const EditPlant = () => {
  const { plantId } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [editedPlant, setEditedPlant] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    const { plantName, plantCode } = editedPlant;

    if (!plantName?.trim()) errors.plantName = "Tên xưởng không được để trống";
    if (!plantCode?.trim()) errors.plantCode = "Mã xưởng không được để trống";

    return errors;
  };

  useEffect(() => {
    const fetchPlant = async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await getPlantById(plantId, token);
        setPlant(data);
        setEditedPlant(data);
      } catch (error) {
        alert(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy thông tin xưởng!"
        );
      }
    };

    fetchPlant();
  }, [plantId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPlant((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setEditedPlant(plant);
    navigate(`/plant/${plantId}`);
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const { companyId, plantCode, plantId, ...payload } = editedPlant || {};
      const updatedPlant = await updatePlant(plantId, payload, token);
      setPlant(updatedPlant);
      setEditedPlant(updatedPlant);
      alert("Cập nhật xưởng thành công!");
      navigate(`/plant/${plantId}`);
    } catch (error) {
      alert(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật xưởng!"
      );
    }
  };

  const readOnlyFields = {
    plantCode: true,
  };

  if (!plant) {
    return <LoadingPaper title="CHỈNH SỬA THÔNG TIN XƯỞNG" />;
  }

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          CHỈNH SỬA THÔNG TIN XƯỞNG
        </Typography>

        <PlantForm
          plant={editedPlant}
          onChange={handleChange}
          errors={errors}
          readOnlyFields={readOnlyFields}
        />

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="contained" color="default" onClick={handleSave}>
            Lưu
          </Button>
          <Button variant="outlined" color="default" onClick={handleCancel}>
            Hủy
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditPlant;
