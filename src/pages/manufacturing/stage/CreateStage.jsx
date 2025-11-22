import React, { useState } from "react";
import { Container, Typography, Button, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  createStage,
  checkIsItemCreatedStage,
} from "@/services/manufacturing/StageService";
import StageForm from "@/components/manufacturing/StageForm";
import StageDetailTable from "@/components/manufacturing/StageDetailTable";
import toastrService from "@/services/toastrService";

const CreateStage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  const [errors, setErrors] = useState({ stageDetailErrors: [] });
  const [stageDetails, setStageDetails] = useState([]);

  const [stage, setStage] = useState({
    companyId,
    stageCode: "",
    itemId: "",
    itemCode: "",
    itemName: "",
    description: "",
    status: "",
  });

  const validateForm = () => {
    const formErrors = {};
    if (!stage.itemCode) formErrors.itemCode = "Phải chọn hàng hóa";
    if (!stage.itemName) formErrors.itemName = "Chưa có tên hàng hóa";
    if (!stage.status?.trim())
      formErrors.status = "Trạng thái không được để trống";
    return formErrors;
  };

  const validateStageDetails = () => {
    const tableErrors = [];

    stageDetails.forEach((detail, index) => {
      if (!detail.stageName?.trim()) {
        tableErrors.push({
          index,
          field: "stageName",
          message: "Phải nhập tên công đoạn",
        });
      }
      if (detail.estimatedTime < 0) {
        tableErrors.push({ index, field: "estimatedTime", message: ">= 0" });
      }
    });

    return tableErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStage((prev) => ({ ...prev, [name]: value }));
  };

  const performCreateStage = async () => {
    const request = {
      itemId: stage.itemId,
      description: stage.description,
      status: stage.status,
      stageDetails: stageDetails.map((detail) => ({
        stageName: detail.stageName,
        stageOrder: detail.stageOrder,
        estimatedTime: detail.estimatedTime,
        description: detail.description,
      })),
    };

    try {
      await createStage(request, token);
      toastrService.success("Tạo công đoạn sản xuất thành công!");
      navigate("/stages");
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Lỗi khi tạo Stage!"
      );
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    const stageDetailErrors = validateStageDetails();

    if (
      Object.keys(validationErrors).length > 0 ||
      stageDetailErrors.length > 0
    ) {
      setErrors({ ...validationErrors, stageDetailErrors });
      return;
    }

    try {
      // Kiểm tra item đã có stage chưa
      const checkResult = await checkIsItemCreatedStage(stage.itemId, token);
      // API trả về boolean (true/false)
      const isCreated = checkResult === true || checkResult === "true";

      if (isCreated) {
        // Hiển thị dialog xác nhận
        const result = await toastrService.confirm(
          "Hàng hóa đã được tạo. Nếu tiếp tục tạo sẽ vô hiệu quy trình sản xuất đã có.",
          "Xác nhận",
          {
            confirmButtonText: "Yes",
            cancelButtonText: "No",
          }
        );

        if (result.isConfirmed) {
          // Người dùng chọn Yes => tiếp tục tạo
          await performCreateStage();
        }
        // Người dùng chọn No => không làm gì
      } else {
        // Item chưa có stage => tạo bình thường
        await performCreateStage();
      }
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Lỗi khi kiểm tra hoặc tạo Stage!"
      );
    }
  };

  const handleCancel = () => {
    navigate("/stages");
  };

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          THÊM MỚI QUY TRÌNH SẢN XUẤT
        </Typography>

        <StageForm
          stage={stage}
          onChange={handleChange}
          errors={errors}
          readOnlyFields={{ stageCode: true }}
          setStage={setStage}
        />

        <Typography variant="h5" mt={3} mb={3}>
          DANH SÁCH CÔNG ĐOẠN:
        </Typography>

        <StageDetailTable
          stageDetails={stageDetails}
          setStageDetails={setStageDetails}
          errors={errors.stageDetailErrors}
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

export default CreateStage;
