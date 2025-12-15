import FormPageLayout from "@/components/layout/FormPageLayout";
import MoForm from "@/components/manufacturing/MoForm";
import { Button } from "@/components/ui/button";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import { getAllLinesInCompany } from "@/services/general/ManufactureLineService";
import { createMo } from "@/services/manufacturing/MoService";
import toastrService from "@/services/toastrService";
import dayjs from "dayjs";
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <FormPageLayout
      breadcrumbItems={[
        { label: "Danh sách công lệnh", path: "/mos" },
        { label: "Thêm mới" },
      ]}
      backLink="/mos"
      backLabel="Quay lại danh sách"
    >
      <MoForm
        mo={mo}
        onChange={handleChange}
        errors={errors}
        readOnlyFields={{ moCode: true, status: true }}
        setMo={setMo}
        items={items}
        lines={lines}
      />

      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/mos")}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Hủy
        </Button>
        <Button
          type="button"
          variant="default"
          onClick={handleSubmit}
          className="gap-2 bg-blue-600 hover:bg-blue-700 min-w-[120px]"
        >
          <Save className="w-4 h-4" />
          Thêm
        </Button>
      </div>
    </FormPageLayout>
  );
};

export default CreateMo;
