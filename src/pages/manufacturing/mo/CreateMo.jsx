import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { createMo } from "@/services/manufacturing/MoService";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import { getAllLinesInCompany } from "@/services/general/ManufactureLineService";
import MoForm from "@/components/manufacturing/MoForm";
import dayjs from "dayjs";
import toastrService from "@/services/toastrService";
import BackButton from "@/components/common/BackButton";
import { getButtonProps } from "@/utils/buttonStyles";

const CreateMo = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const employeeName = localStorage.getItem("employeeName");

  const [errors, setErrors] = useState({});
  const [items, setItems] = useState([]);
  const [lines, setLines] = useState([]);

  const [mo, setMo] = useState({
    moCode: "",
    itemId: "",
    itemCode: "",
    lineId: "",
    lineCode: "",
    type: "",
    quantity: 0,
    estimatedStartTime: "",
    estimatedEndTime: "",
    createdBy: employeeName,
    status: "Chờ xác nhận",
  });

  useEffect(() => {
    const fetchItemsAndLines = async () => {
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
    fetchItemsAndLines();
  }, [companyId, token]);

  const validateForm = () => {
    const formErrors = {};
    if (!mo.itemId) formErrors.itemId = "Phải chọn hàng hóa";
    if (!mo.lineId) formErrors.lineId = "Phải chọn dây chuyền sản xuất";
    if (!mo.type?.trim()) formErrors.type = "Loại không được để trống";
    if (!mo.quantity || Number(mo.quantity) <= 0)
      formErrors.quantity = "Số lượng phải > 0";
    if (!mo.status?.trim())
      formErrors.status = "Trạng thái không được để trống";
    if (!mo.estimatedStartTime)
      formErrors.estimatedStartTime = "Phải chọn ngày bắt đầu dự kiến";
    if (!mo.estimatedEndTime)
      formErrors.estimatedEndTime = "Phải chọn ngày kết thúc dự kiến";
    if (mo.estimatedStartTime && mo.estimatedEndTime) {
      const start = new Date(mo.estimatedStartTime);
      const end = new Date(mo.estimatedEndTime);
      if (start >= end) {
        formErrors.estimatedEndTime = "Ngày kết thúc phải sau ngày bắt đầu";
      }
    }
    return formErrors;
  };

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

  const toLocalDateTimeString = (localDateTimeString) => {
    if (!localDateTimeString) return null;
    return dayjs(localDateTimeString).format("YYYY-MM-DDTHH:mm:ss");
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const request = {
        itemId: mo.itemId,
        lineId: mo.lineId,
        type: mo.type,
        quantity: mo.quantity,
        estimatedStartTime: toLocalDateTimeString(mo.estimatedStartTime),
        estimatedEndTime: toLocalDateTimeString(mo.estimatedEndTime),
        status: mo.status,
        createdBy: employeeName,
      };

      const response = await createMo(request, token);

      if (response?.statusCode === 404) {
        toastrService.error(response?.message || "Hàng hóa chưa có BOM!");
        return;
      }

      toastrService.success("Tạo công lệnh thành công!");
      navigate("/mos");
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.statusCode === 404) {
        toastrService.error(errorData?.message || "Hàng hóa chưa có BOM!");
      } else {
        toastrService.error(errorData?.message || "Lỗi khi tạo MO!");
      }
    }
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg max-w-5xl mx-auto">
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              THÊM MỚI CÔNG LỆNH SẢN XUẤT
            </Typography>
            <BackButton to="/mos" label="Quay lại danh sách" />
          </div>

          <MoForm
            mo={mo}
            onChange={handleChange}
            errors={errors}
            readOnlyFields={{ moCode: true, status: true }}
            setMo={setMo}
            items={items}
            lines={lines}
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
              onClick={() => navigate("/mos")}
            >
              Hủy
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreateMo;
