import React from "react";
import {
  Input,
  IconButton,
  Button,
  Typography,
} from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import SelectAutocomplete from "@components/content-components/SelectAutocomplete";
import { getButtonProps } from "@/utils/buttonStyles";

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

  return (
    <div className="mt-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Mã hàng hóa
                </Typography>
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Số lượng
                </Typography>
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Ghi chú
                </Typography>
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Hành động
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {(ticketDetails || []).map((detail, index) => {
              const isLast = index === ticketDetails.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";
              const itemError = errors?.find(
                (err) => err.index === index && err.field === "itemId"
              );
              const quantityError = errors?.find(
                (err) => err.index === index && err.field === "quantity"
              );
              return (
                <tr key={index}>
                  <td className={classes}>
                    <div className="w-full">
                      <SelectAutocomplete
                        options={itemOptions}
                        value={detail.itemId}
                        onChange={(selected) => {
                          handleDetailChange(
                            index,
                            "itemId",
                            selected?.value || ""
                          );
                        }}
                        placeholder="Chọn hàng hóa"
                        error={!!itemError}
                        helperText={itemError?.message}
                        size="small"
                      />
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="w-full">
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
                        color="blue"
                        className="w-full placeholder:opacity-100"
                        min={0}
                      />
                      {quantityError && (
                        <Typography
                          variant="small"
                          color="red"
                          className="mt-1"
                        >
                          {quantityError.message}
                        </Typography>
                      )}
                    </div>
                  </td>
                  <td className={classes}>
                    <Input
                      value={detail.note || ""}
                      onChange={(e) =>
                        handleDetailChange(index, "note", e.target.value)
                      }
                      color="blue"
                      className="w-full placeholder:opacity-100"
                    />
                  </td>
                  <td className={classes}>
                    <IconButton
                      variant="text"
                      color="red"
                      onClick={() => handleDeleteRow(index)}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </IconButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <Button {...getButtonProps("primary")} onClick={handleAddRow}>
          Thêm hàng
        </Button>
      </div>
    </div>
  );
};

export default TtDetailTable;
