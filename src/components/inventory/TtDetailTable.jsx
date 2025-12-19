import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

const TtDetailTable = ({ ticketDetails, setTicketDetails, items, errors }) => {
  const handleDetailChange = (index, field, value, type) => {
    let newValue = value;

    if (type === "number") {
      const num = parseFloat(value);
      if (isNaN(num)) {
        newValue = "";
      } else {
        newValue = num < 0 ? 0 : num;
      }
    }

    setTicketDetails((prev) =>
      prev.map((detail, i) =>
        i === index ? { ...detail, [field]: newValue } : detail
      )
    );
  };

  const handleAddRow = () => {
    setTicketDetails((prev) => [
      ...prev,
      { itemId: "", itemName: "", toWarehouseId: "", quantity: 0, note: "" },
    ]);
  };

  const handleDeleteRow = (index) => {
    setTicketDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const itemOptions = (items || []).map((item) => ({
    value: item.itemId,
    label: item.itemCode + " - " + item.itemName,
  }));

  const getError = (index, field) => {
    return errors?.find((err) => err.index === index && err.field === field);
  };

  return (
    <div className="overflow-visible mt-4">
      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-2 px-2 py-3 bg-gray-50 border-b font-medium text-sm text-gray-700">
        <div className="col-span-5">Mã hàng hóa</div>
        <div className="col-span-2">Số lượng</div>
        <div className="col-span-4">Ghi chú</div>
        <div className="col-span-1"></div>
      </div>

      {/* Table Body */}
      <div className="divide-y">
        {(ticketDetails || []).map((detail, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-12 gap-2 p-2 hover:bg-gray-50"
          >
            {/* Mã hàng hóa */}
            <div className="col-span-1 md:col-span-5">
              <span className="md:hidden text-xs text-gray-500 mb-1 block">Mã hàng hóa</span>
              <Combobox
                options={itemOptions}
                value={detail.itemId}
                onChange={(option) =>
                  handleDetailChange(index, "itemId", option?.value || "")
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

            {/* Số lượng */}
            <div className="col-span-1 md:col-span-2">
              <span className="md:hidden text-xs text-gray-500 mb-1 block">Số lượng</span>
              <Input
                type="number"
                value={detail.quantity || ""}
                onChange={(e) =>
                  handleDetailChange(
                    index,
                    "quantity",
                    e.target.value,
                    "number"
                  )
                }
                min={0}
                className={getError(index, "quantity") ? "border-red-500" : ""}
              />
              {getError(index, "quantity") && (
                <p className="text-xs text-red-500 mt-1">
                  {getError(index, "quantity").message}
                </p>
              )}
            </div>

            {/* Ghi chú */}
            <div className="col-span-1 md:col-span-4">
              <span className="md:hidden text-xs text-gray-500 mb-1 block">Ghi chú</span>
              <Input
                value={detail.note || ""}
                onChange={(e) =>
                  handleDetailChange(index, "note", e.target.value)
                }
                placeholder="Ghi chú"
              />
            </div>

            {/* Actions */}
            <div className="col-span-1 md:col-span-1 flex items-center justify-end md:justify-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDeleteRow(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleAddRow}
          className="gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          <Plus className="h-4 w-4" />
          Thêm hàng
        </Button>
      </div>
    </div>
  );
};

export default TtDetailTable;
