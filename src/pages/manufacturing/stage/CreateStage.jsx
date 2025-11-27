import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createStage,
  checkIsItemCreatedStage,
} from "@/services/manufacturing/StageService";
import StageForm from "@/components/manufacturing/StageForm";
import StageDetailTable from "@/components/manufacturing/StageDetailTable";
import toastrService from "@/services/toastrService";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";
import BackButton from "@/components/common/BackButton";

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
      const checkResult = await checkIsItemCreatedStage(stage.itemId, token);
      const isCreated = checkResult === true || checkResult === "true";

      if (isCreated) {
        const result = await toastrService.confirm(
          "Hàng hóa đã được tạo. Nếu tiếp tục tạo sẽ vô hiệu quy trình sản xuất đã có.",
          "Xác nhận",
          {
            confirmButtonText: "Yes",
            cancelButtonText: "No",
          }
        );

        if (result.isConfirmed) {
          await performCreateStage();
        }
      } else {
        await performCreateStage();
      }
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Lỗi khi kiểm tra hoặc tạo Stage!"
      );
    }
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg max-w-6xl mx-auto">
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              THÊM MỚI QUY TRÌNH SẢN XUẤT
            </Typography>
            <BackButton to="/stages" label="Quay lại danh sách" />
          </div>

          <StageForm
            stage={stage}
            onChange={handleChange}
            errors={errors}
            readOnlyFields={{ stageCode: true }}
            setStage={setStage}
          />

          <Typography variant="h5" color="blue-gray" className="mt-6 mb-4">
            DANH SÁCH CÔNG ĐOẠN
          </Typography>

          <StageDetailTable
            stageDetails={stageDetails}
            setStageDetails={setStageDetails}
            errors={errors.stageDetailErrors}
          />

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              {...getButtonProps("primary")}
              onClick={handleSubmit}
            >
              Thêm
            </Button>
            <Button
              type="button"
              {...getButtonProps("outlinedSecondary")}
              onClick={() => navigate("/stages")}
            >
              Hủy
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreateStage;
