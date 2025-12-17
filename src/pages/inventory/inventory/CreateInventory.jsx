import React, { useState } from "react";
import { Typography, Button, Card, CardBody } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { createInventory } from "@/services/inventory/InventoryService";
import InventoryForm from "@/components/inventory/InventoryForm";
import toastrService from "@/services/toastrService";
import { getButtonProps } from "@/utils/buttonStyles";
import BackButton from "@/components/common/BackButton";

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
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h4" className="font-bold">
          THÊM MỚI TỒN KHO
        </Typography>
        <BackButton to="/inventory-count" label="Quay lại tồn kho" />
      </div>

      <Card className="shadow-sm">
        <CardBody>
          <InventoryForm
            inventory={inventory}
            onChange={handleChange}
            setInventory={setInventory}
            errors={errors}
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
              onClick={handleCancel}
            >
              Hủy
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreateInventory;
