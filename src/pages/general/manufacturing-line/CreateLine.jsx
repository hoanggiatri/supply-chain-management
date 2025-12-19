import FormPageLayout from "@/components/layout/FormPageLayout";
import { Button } from "@/components/ui/button";
import { createLine } from "@/services/general/ManufactureLineService";
import toastrService from "@/services/toastrService";
import LineForm from "@components/general/LineForm";
import { Save, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateLine = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [line, setLine] = useState({
    plantId: "",
    lineName: "",
    capacity: 0,
    description: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    let newValue = value;
    if (type === "number") {
      const num = parseFloat(value);
      if (isNaN(num)) {
        newValue = "";
      } else {
        newValue = num < 0 ? 0 : num;
      }
    }

    setLine((prev) => ({ ...prev, [name]: newValue }));
  };

  const validate = () => {
    const newErrors = {};
    if (!line.plantId) newErrors.plantId = "Vui lòng chọn xưởng";
    if (!line.lineName.trim())
      newErrors.lineName = "Tên dây chuyền không được để trống";
    if (!line.capacity || line.capacity <= 0)
      newErrors.capacity = "Công suất phải lớn hơn 0";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { plantId, lineCode, ...payload } = line;
      await createLine(plantId, payload, token);
      toastrService.success("Tạo dây chuyền thành công!");
      navigate("/lines");
    } catch (err) {
      toastrService.error(
        err.response?.data?.message || "Lỗi khi tạo dây chuyền!"
      );
    }
  };

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Danh sách dây chuyền", path: "/lines" },
        { label: "Thêm mới" },
      ]}
      backLink="/lines"
      backLabel="Quay lại danh sách"
    >
      <LineForm
        line={line}
        onChange={handleChange}
        errors={errors}
        readOnlyFields={{}}
        requireLineCode={false}
      />

      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={() => navigate("/lines")}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 gap-2 min-w-[120px]"
        >
          <Save className="w-4 h-4" />
          Lưu
        </Button>
      </div>
    </FormPageLayout>
  );
};

export default CreateLine;
