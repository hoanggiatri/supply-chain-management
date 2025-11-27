import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  updateStage,
  getStageById,
} from "@/services/manufacturing/StageService";
import StageForm from "@/components/manufacturing/StageForm";
import StageDetailTable from "@/components/manufacturing/StageDetailTable";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import toastrService from "@/services/toastrService";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";
import BackButton from "@/components/common/BackButton";

const EditStage = () => {
  const { stageId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [stage, setStage] = useState(null);
  const [stageDetails, setStageDetails] = useState([]);
  const [errors, setErrors] = useState({ stageDetailErrors: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stageData = await getStageById(stageId, token);
        setStage({
          ...stageData,
          stageCode: stageData.stageCode || "",
          description: stageData.description || "",
          status: stageData.status || "",
        });
        setStageDetails(stageData.stageDetails || []);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Có lỗi khi tải dữ liệu!"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [stageId, token]);

  const validateForm = () => {
    const formErrors = {};
    if (!stage.stageCode) formErrors.stageCode = "Phải nhập mã công đoạn";
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
          message: "Tên công đoạn không được để trống",
        });
      }
      if (detail.estimatedTime < 0) {
        tableErrors.push({ index, field: "estimatedTime", message: ">= 0" });
      }
    });

    return tableErrors;
  };

  const readOnlyFields = {
    stageCode: true,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStage((prev) => ({ ...prev, [name]: value }));
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
      const request = {
        description: stage.description,
        status: stage.status,
      };

      await updateStage(stageId, request, token);
      toastrService.success("Cập nhật công đoạn thành công!");
      navigate(-1);
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Lỗi khi cập nhật công đoạn!"
      );
    }
  };

  if (loading) {
    return <LoadingPaper title="CẬP NHẬT QUY TRÌNH SẢN XUẤT" />;
  }

  return (
    <div className="p-6">
      <Card className="shadow-lg max-w-6xl mx-auto">
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              CẬP NHẬT QUY TRÌNH SẢN XUẤT
            </Typography>
            <BackButton to="/stages" label="Quay lại danh sách" />
          </div>

          <StageForm
            stage={stage}
            onChange={handleChange}
            errors={errors}
            readOnlyFields={readOnlyFields}
            setStage={setStage}
          />

          <Typography variant="h5" color="blue-gray" className="mt-6 mb-4">
            DANH SÁCH CÔNG ĐOẠN
          </Typography>

          <StageDetailTable
            stageDetails={stageDetails}
            errors={errors.stageDetailErrors}
            readOnly
          />

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              {...getButtonProps("primary")}
              onClick={handleSubmit}
            >
              Lưu
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

export default EditStage;
