import { Combobox } from "@/components/ui/combobox";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  Button,
  IconButton,
  Input,
  Typography,
} from "@material-tailwind/react";
import PropTypes from "prop-types";

const BomDetailRow = ({
  detail,
  index,
  materialOptions,
  errors,
  handleDetailChange,
  handleDeleteRow,
  handleItemSelect,
  isLast,
}) => {
  const classes = isLast
    ? "p-3 align-top"
    : "p-3 align-top border-b border-blue-gray-50";

  const getFieldError = (field) =>
    errors?.find((err) => err.index === index && err.field === field);

  return (
    <tr key={`bom-detail-${index}-${detail.itemId || "new"}`}>
      <td className={classes}>
        <Combobox
          options={materialOptions}
          value={detail.itemId ? String(detail.itemId) : ""}
          onChange={(option) => handleItemSelect(index, option?.value)}
          placeholder="Chọn nguyên vật liệu"
          searchPlaceholder="Tìm kiếm..."
          emptyText="Không tìm thấy"
          position="top"
          className={getFieldError("itemId") ? "border-red-500" : "w-full"}
        />
        {getFieldError("itemId") && (
          <Typography variant="small" color="red" className="mt-1">
            {getFieldError("itemId")?.message}
          </Typography>
        )}
      </td>
      <td className={classes}>
        <Input
          label="Số lượng"
          type="number"
          min={0}
          value={detail.quantity ?? ""}
          onChange={(e) =>
            handleDetailChange(index, "quantity", e.target.value, "number")
          }
          color="blue"
          className="w-full placeholder:opacity-100"
        />
        {getFieldError("quantity") && (
          <Typography variant="small" color="red" className="mt-1">
            {getFieldError("quantity")?.message}
          </Typography>
        )}
      </td>
      <td className={classes}>
        <Input
          label="Ghi chú"
          value={detail.note || ""}
          onChange={(e) => handleDetailChange(index, "note", e.target.value)}
          color="blue"
          className="w-full placeholder:opacity-100"
        />
      </td>
      <td className="p-3 align-top text-center">
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
};

BomDetailRow.propTypes = {
  detail: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  materialOptions: PropTypes.array.isRequired,
  errors: PropTypes.array,
  handleDetailChange: PropTypes.func.isRequired,
  handleDeleteRow: PropTypes.func.isRequired,
  handleItemSelect: PropTypes.func.isRequired,
  isLast: PropTypes.bool.isRequired,
};

const BomDetailTable = ({
  bomDetails = [],
  setBomDetails,
  items = [],
  errors = [],
}) => {
  const handleDetailChange = (index, field, value, type) => {
    let newValue = value;

    if (type === "number") {
      const num = Number.parseFloat(value);
      if (Number.isNaN(num)) {
        newValue = "";
      } else {
        newValue = Math.max(0, num);
      }
    }

    setBomDetails?.((prev) =>
      prev.map((detail, i) =>
        i === index ? { ...detail, [field]: newValue } : detail
      )
    );
  };

  const handleAddRow = () => {
    setBomDetails?.((prev) => [
      ...prev,
      { itemId: "", itemName: "", quantity: 0, note: "" },
    ]);
  };

  const handleDeleteRow = (index) => {
    setBomDetails?.((prev) => prev.filter((_, i) => i !== index));
  };

  const materialOptions = items
    .filter(
      (item) =>
        item.itemType === "Nguyên vật liệu" ||
        item.itemType === "Bán thành phẩm"
    )
    .map((item) => ({
      value: String(item.itemId),
      label: `${item.itemCode} - ${item.itemName}`,
    }));

  const updateDetailItemName = (targetIndex, name) => {
    setBomDetails?.((prev) =>
      prev.map((detail, i) =>
        i === targetIndex ? { ...detail, itemName: name } : detail
      )
    );
  };

  const handleItemSelect = (index, value) => {
    handleDetailChange(index, "itemId", value);
    const selected = items.find(
      (item) => String(item.itemId) === String(value)
    );
    updateDetailItemName(index, selected?.itemName || "");
  };

  return (
    <>
      <div className="overflow-visible rounded-lg border border-blue-gray-100">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="bg-blue-gray-50/50 p-3 text-sm font-semibold text-blue-gray-700">
                Nguyên vật liệu
              </th>
              <th className="bg-blue-gray-50/50 p-3 text-sm font-semibold text-blue-gray-700 w-32">
                Số lượng
              </th>
              <th className="bg-blue-gray-50/50 p-3 text-sm font-semibold text-blue-gray-700">
                Ghi chú
              </th>
              <th className="bg-blue-gray-50/50 p-3 text-sm font-semibold text-blue-gray-700 text-center w-16">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {bomDetails.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-blue-gray-500">
                  Chưa có nguyên vật liệu nào
                </td>
              </tr>
            ) : (
              bomDetails.map((detail, index) => (
                <BomDetailRow
                  key={`detail-${index}-${detail.itemId || "new"}`}
                  detail={detail}
                  index={index}
                  materialOptions={materialOptions}
                  errors={errors}
                  handleDetailChange={handleDetailChange}
                  handleDeleteRow={handleDeleteRow}
                  handleItemSelect={handleItemSelect}
                  isLast={index === bomDetails.length - 1}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Button
        type="button"
        variant="outlined"
        color="blue"
        className="mt-6 border-blue-500 text-blue-500 hover:bg-blue-50"
        onClick={handleAddRow}
      >
        + Thêm nguyên vật liệu
      </Button>
    </>
  );
};

BomDetailTable.propTypes = {
  bomDetails: PropTypes.array,
  setBomDetails: PropTypes.func,
  items: PropTypes.array,
  errors: PropTypes.array,
};

export default BomDetailTable;
