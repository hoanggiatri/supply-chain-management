import FormPageLayout from "@/components/layout/FormPageLayout";
import { Button } from "@/components/ui/button";
import { createWarehouse } from "@/services/general/WarehouseService";
import toastrService from "@/services/toastrService";
import WarehouseForm from "@components/general/WarehouseForm";
import { Save, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateWarehouse = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  const [warehouse, setWarehouse] = useState({
    warehouseName: "",
    description: "",
    maxCapacity: 0,
    warehouseType: "",
    status: "Đang sử dụng",
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

    setWarehouse((prev) => ({ ...prev, [name]: newValue }));
  };

  const validate = () => {
    const newErrors = {};
    if (!warehouse.warehouseName.trim())
      newErrors.warehouseName = "Tên kho không được để trống";
    if (!warehouse.maxCapacity || warehouse.maxCapacity <= 0)
      newErrors.maxCapacity = "Sức chứa phải lớn hơn 0";
    if (!warehouse.warehouseType)
      newErrors.warehouseType = "Loại kho không được để trống";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createWarehouse(companyId, warehouse, token);
      toastrService.success("Tạo kho hàng thành công!");
      navigate("/warehouses");
    } catch (err) {
      toastrService.error(err.response?.data?.message || "Lỗi khi tạo kho!");
    }
  };

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Danh sách kho", path: "/warehouses" },
        { label: "Thêm mới" },
      ]}
      backLink="/warehouses"
      backLabel="Quay lại danh sách"
    >
      <WarehouseForm
        warehouse={warehouse}
        onChange={handleChange}
        errors={errors}
        readOnlyFields={{ status: true }}
        mode="create"
      />

      {/* Actions */}
      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/warehouses")}
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
          Lưu
        </Button>
      </div>
    </FormPageLayout>
  );
};

export default CreateWarehouse;
