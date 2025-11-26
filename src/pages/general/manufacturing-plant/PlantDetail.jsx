import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import PlantForm from "@components/general/PlantForm";
import { getPlantById } from "@/services/general/ManufacturePlantService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import toastrService from "@/services/toastrService";
import { Button } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";

const PlantDetail = () => {
  const { plantId } = useParams();
  const [plant, setPlant] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlant = async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await getPlantById(plantId, token);
        setPlant(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy thông tin xưởng!"
        );
      }
    };

    fetchPlant();
  }, [plantId]);

  const readOnlyFields = {
    plantCode: true,
    plantName: true,
    description: true,
  };

  if (!plant) {
    return <LoadingPaper title="THÔNG TIN XƯỞNG SẢN XUẤT" />;
  }

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          THÔNG TIN XƯỞNG SẢN XUẤT
        </Typography>

        <PlantForm
          plant={plant}
          onChange={() => {}}
          errors={{}}
          readOnlyFields={readOnlyFields}
        />

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            type="button"
            {...getButtonProps("primary")}
            onClick={() => navigate(`/plant/${plantId}/edit`)}
          >
            Sửa
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PlantDetail;
