import InventoryForm from "@/components/inventory/InventoryForm";
import { Button } from "@/components/ui/button";
import { createInventory } from "@/services/inventory/InventoryService";
import toastrService from "@/services/toastrService";
import { MoveLeft, Save, X } from "lucide-react";
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

      console.log(inv);

      await createInventory(inv, token);
      toastrService.success("Thêm mới tồn kho thành công!");
      navigate("/inventory-count");
    } catch (error) {
      console.log(error.response);
      toastrService.error(
        error.response?.data?.message || "Lỗi khi tạo tồn kho!"
      );
    }
  };

  const handleCancel = () => {
    navigate("/inventory-count");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleCancel}
        >
          <MoveLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Thêm mới tồn kho</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Tạo mới phiếu tồn kho cho kho hàng
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
        <InventoryForm
          inventory={inventory}
          onChange={handleChange}
          setInventory={setInventory}
          errors={errors}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
          >
            <X className="w-4 h-4 mr-2" />
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Lưu tồn kho
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateInventory;
