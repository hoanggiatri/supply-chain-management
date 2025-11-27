import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import MoForm from "@/components/manufacturing/MoForm";
import { getMoById, updateMo } from "@/services/manufacturing/MoService";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import { getAllLinesInCompany } from "@/services/general/ManufactureLineService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import dayjs from "dayjs";
import toastrService from "@/services/toastrService";
import BackButton from "@/components/common/BackButton";
import { getButtonProps } from "@/utils/buttonStyles";

const EditMo = () => {
  const { moId } = useParams();
  const [mo, setMo] = useState(null);
  const [errors, setErrors] = useState({});
  const [items, setItems] = useState([]);
  const [lines, setLines] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchMo = async () => {
      try {
        const data = await getMoById(moId, token);
        setMo(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Có lỗi khi lấy công lệnh!"
        );
      }
    };
    fetchMo();
  }, [moId, token]);

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, [companyId, token]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let newValue = value;
    if (type === "number") {
      const num = Number.parseFloat(value);
      if (Number.isNaN(num)) {
        newValue = "";
      } else {
        newValue = Math.max(0, num);
      }
    }

    setMo((prev) => ({ ...prev, [name]: newValue }));
  };

  const toISO8601String = (dateString) => {
    if (!dateString) return null;
    return dayjs(dateString).toISOString();
  };

  const validateForm = () => {
    const formErrors = {};
    if (!mo.quantity || mo.quantity <= 0)
      formErrors.quantity = "Số lượng phải > 0";
    if (!mo.estimatedStartTime)
      formErrors.estimatedStartTime = "Vui lòng chọn thời gian bắt đầu!";
    if (!mo.estimatedEndTime)
      formErrors.estimatedEndTime = "Vui lòng chọn thời gian kết thúc!";
    if (mo.estimatedStartTime && mo.estimatedEndTime) {
      const start = new Date(mo.estimatedStartTime);
      const end = new Date(mo.estimatedEndTime);
      if (start >= end)
        formErrors.estimatedEndTime = "Ngày kết thúc phải sau ngày bắt đầu!";
    }
    return formErrors;
  };

  const handleSave = async () => {
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const request = {
        itemId: Number(mo.itemId),
        lineId: Number(mo.lineId),
        type: mo.type,
        quantity: mo.quantity,
        estimatedStartTime: toISO8601String(mo.estimatedStartTime),
        estimatedEndTime: toISO8601String(mo.estimatedEndTime),
        status: mo.status,
      };
      await updateMo(moId, request, token);
      toastrService.success("Cập nhật công lệnh thành công!");
      navigate(-1);
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi khi cập nhật!"
      );
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
    <div className="p-6">
      <Card className="shadow-lg max-w-5xl mx-auto">
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              CHỈNH SỬA CÔNG LỆNH
            </Typography>
            <BackButton to="/mos" label="Quay lại danh sách" />
          </div>

          <MoForm
            mo={mo}
            onChange={handleChange}
            errors={errors}
            setMo={setMo}
            items={items}
            lines={lines}
            readOnlyFields={readOnlyFields}
          />

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              {...getButtonProps("primary")}
              onClick={handleSave}
            >
              Lưu
            </Button>
            <Button
              type="button"
              {...getButtonProps("outlinedSecondary")}
              onClick={() => navigate(-1)}
            >
              Hủy
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditMo;
