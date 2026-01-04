import InventoryForm from "@/components/inventory/InventoryForm";
import FormPageLayout from "@/components/layout/FormPageLayout";
import { Button } from "@/components/ui/button";
import { createInventory } from "@/services/inventory/InventoryService";
import toastrService from "@/services/toastrService";
import { Save, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateInventory = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [errors, setErrors] = useState({});

  const [inventory, setInventory] = useState({
    warehouseId: "",
    warehouseCode: "",
    itemId: "",
    itemCode: "",
    quantity: 0,
    onDemandQuantity: 0,
  });

  const validateForm = () => {
    const formErrors = {};
    if (!inventory.warehouseId) formErrors.warehouseId = "Phải chọn kho";
    if (!inventory.itemId) formErrors.itemId = "Phải chọn hàng hóa";
    if (inventory.quantity === "" || inventory.quantity < 0)
      formErrors.quantity = "Số lượng phải >= 0";
    if (inventory.onDemandQuantity === "" || inventory.onDemandQuantity < 0)
      formErrors.onDemandQuantity = "Số lượng cần dùng phải >= 0";
    return formErrors;
  };

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

    setInventory((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const inv = {
        warehouseId: inventory.warehouseId,
        itemId: inventory.itemId,
        quantity: inventory.quantity,
        onDemandQuantity: inventory.onDemandQuantity,
      };

      const res = await createInventory(inv, token);
      
      if (res && res.statusCode === 400) {
        toastrService.error(res.message);
        return;
      }

      toastrService.success("Thêm mới tồn kho thành công!");
      navigate("/inventory-count");
    } catch (error) {
      if (error.response?.data?.statusCode == 400) {
        toastrService.error(error.response.data.message);
      } else {
        toastrService.error(
          error.response?.data?.message || "Lỗi khi tạo tồn kho!"
        );
      }
    }
  };

  const handleCancel = () => {
    navigate("/inventory-count");
  };

  const breadcrumbItems = [
    { label: "Kiểm kê kho", path: "/inventory-count" },
    { label: "Thêm tồn kho", path: "" }
  ];

  return (
    <FormPageLayout breadcrumbItems={breadcrumbItems} backLink="/inventory-count">
      <div className="h-[350px] flex flex-col gap-6">
        <div className="overflow-visible">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Thông tin tồn kho</h3>
          <InventoryForm
            inventory={inventory}
            onChange={handleChange}
            setInventory={setInventory}
            errors={errors}
            mode="create"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
          <Button
            variant="secondary"
            onClick={handleCancel}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 min-w-[120px]"
          >
            <Save className="w-4 h-4" />
            Lưu tồn kho
          </Button>
        </div>
      </div>
    </FormPageLayout>
  );
};

export default CreateInventory;
