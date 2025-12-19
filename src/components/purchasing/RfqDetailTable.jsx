import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import toastrService from "@/services/toastrService";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const RfqDetailTable = ({
  rfqDetails,
  setRfqDetails,
  requestedCompanyId,
  errors,
}) => {
  const [myItems, setMyItems] = useState([]);
  const [supplierItems, setSupplierItems] = useState([]);
  const companyId = localStorage.getItem("companyId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const data = await getAllItemsInCompany(companyId, token);
        setMyItems(data);
      } catch (err) {
        toastrService.error("Lỗi khi tải danh sách hàng hóa công ty mình.");
      }
    };
    fetchMyItems();
  }, [companyId, token]);

  useEffect(() => {
    const fetchSupplierItems = async () => {
      if (!requestedCompanyId) return setSupplierItems([]);
      try {
        const data = await getAllItemsInCompany(requestedCompanyId, token);
        const sellableItems = data.filter((item) => item.isSellable);
        setSupplierItems(sellableItems);
      } catch (err) {
        toastrService.error(
          "Lỗi khi tải danh sách hàng hóa của công ty cung cấp."
        );
      }
    };
    fetchSupplierItems();
  }, [requestedCompanyId, token]);

  const handleDetailChange = (index, field, value, type) => {
    let newValue = value;
    if (type === "number") {
      const num = parseFloat(value);
      newValue = isNaN(num) ? "" : Math.max(num, 0);
    }
    setRfqDetails((prev) =>
      prev.map((detail, i) =>
        i === index ? { ...detail, [field]: newValue } : detail
      )
    );
  };

  const handleAddRow = () => {
    setRfqDetails((prev) => [
      ...prev,
      {
        itemId: "",
        itemName: "",
        quantity: 0,
        note: "",
        supplierItemId: "",
        supplierItemName: "",
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    setRfqDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const itemOptions = myItems.map((item) => ({
    value: String(item.itemId),
    label: item.itemCode + " - " + item.itemName,
  }));

  const supplierItemOptions = supplierItems.map((item) => ({
    value: String(item.itemId),
    label: item.itemCode + " - " + item.itemName,
  }));

  const getError = (index, field) => {
    return errors?.find((err) => err.index === index && err.field === field);
  };

  return (
    <div className="overflow-visible">
      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-2 px-2 py-3 bg-gray-50 border-b font-medium text-sm text-gray-700">
        <div className="col-span-4">Hàng hóa của mình</div>
        <div className="col-span-4">Hàng hóa NCC</div>
        <div className="col-span-2">Số lượng</div>
        <div className="col-span-1">Ghi chú</div>
        <div className="col-span-1"></div>
      </div>

      {/* Table Body */}
      <div className="divide-y">
        {rfqDetails.map((detail, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-12 gap-2 p-2 hover:bg-gray-50"
          >
            {/* Hàng hóa của mình */}
            <div className="col-span-1 md:col-span-4">
              <span className="md:hidden text-xs text-gray-500 mb-1 block">Hàng hóa của mình</span>
              <Combobox
                options={itemOptions}
                value={String(detail.itemId || "")}
                onChange={(option) =>
                  handleDetailChange(index, "itemId", option?.value)
                }
                placeholder="Chọn hàng hóa"
                searchPlaceholder="Tìm hàng hóa..."
                emptyText="Không tìm thấy"
                position="top"
                className={getError(index, "itemId") ? "border-red-500" : ""}
              />
              {getError(index, "itemId") && (
                <p className="text-xs text-red-500 mt-1">
                  {getError(index, "itemId").message}
                </p>
              )}
            </div>

            {/* Hàng hóa NCC */}
            <div className="col-span-1 md:col-span-4">
              <span className="md:hidden text-xs text-gray-500 mb-1 block">Hàng hóa NCC</span>
              <Combobox
                options={supplierItemOptions}
                value={String(detail.supplierItemId || "")}
                onChange={(option) =>
                  handleDetailChange(index, "supplierItemId", option?.value)
                }
                placeholder="Chọn hàng hóa NCC"
                searchPlaceholder="Tìm hàng hóa NCC..."
                emptyText="Không tìm thấy"
                disabled={!requestedCompanyId}
                position="top"
                className={getError(index, "supplierItemId") ? "border-red-500" : ""}
              />
              {getError(index, "supplierItemId") && (
                <p className="text-xs text-red-500 mt-1">
                  {getError(index, "supplierItemId").message}
                </p>
              )}
            </div>

            {/* Số lượng */}
            <div className="col-span-1 md:col-span-2">
              <span className="md:hidden text-xs text-gray-500 mb-1 block">Số lượng</span>
              <Input
                type="number"
                value={detail.quantity}
                onChange={(e) =>
                  handleDetailChange(index, "quantity", e.target.value, "number")
                }
                min={0}
                error={!!getError(index, "quantity")}
              />
              {getError(index, "quantity") && (
                <p className="text-xs text-red-500 mt-1">
                  {getError(index, "quantity").message}
                </p>
              )}
            </div>

            {/* Ghi chú */}
            <div className="col-span-1 md:col-span-1">
              <span className="md:hidden text-xs text-gray-500 mb-1 block">Ghi chú</span>
              <Input
                value={detail.note || ""}
                onChange={(e) =>
                  handleDetailChange(index, "note", e.target.value)
                }
              />
            </div>

            {/* Actions */}
            <div className="col-span-1 md:col-span-1 flex items-center justify-end md:justify-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteRow(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <div className="mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleAddRow}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Thêm hàng
        </Button>
      </div>
    </div>
  );
};

export default RfqDetailTable;
