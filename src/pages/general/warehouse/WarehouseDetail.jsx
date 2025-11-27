import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import WarehouseForm from "@components/general/WarehouseForm";
import { getWarehouseById } from "@/services/general/WarehouseService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import toastrService from "@/services/toastrService";
import { Button } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";
import BackButton from "@components/common/BackButton";

const WarehouseDetail = () => {
  const { warehouseId } = useParams();
  const [warehouse, setWarehouse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWarehouse = async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await getWarehouseById(warehouseId, token);
        setWarehouse(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy thông tin kho!"
        );
      }
    };

    fetchWarehouse();
  }, [warehouseId]);

  const readOnlyFields = {
    warehouseCode: true,
    warehouseName: true,
    maxCapacity: true,
    warehouseType: true,
    description: true,
    status: true,
  };

  if (!warehouse) {
    return <LoadingPaper title="THÔNG TIN KHO HÀNG" />;
  }

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Typography className="page-title" variant="h4">
            THÔNG TIN KHO HÀNG
          </Typography>
          <BackButton to="/warehouses" label="Quay lại danh sách" />
        </Box>

        <WarehouseForm
          warehouse={warehouse}
          onChange={() => {}}
          errors={{}}
          readOnlyFields={readOnlyFields}
        />

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            type="button"
            {...getButtonProps("primary")}
            onClick={() => navigate(`/warehouse/${warehouseId}/edit`)}
          >
            Sửa
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default WarehouseDetail;
