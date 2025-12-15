import { Input } from "@/components/ui/input";

const QuotationDetailTable = ({ quotationDetails, setQuotationDetails }) => {
  const handleDetailChange = (index, field, value, type, maxValue) => {
    let newValue = value;

    if (type === "number") {
      const num = parseFloat(value);
      if (isNaN(num)) {
        newValue = "";
      } else if (num < 0) {
        newValue = 0;
      } else if (maxValue && num > maxValue) {
        newValue = maxValue;
      }
    }

    setQuotationDetails((prev) =>
      prev.map((detail, i) =>
        i === index ? { ...detail, [field]: newValue } : detail
      )
    );
  };

  return (
    <div className="overflow-x-auto">
      {/* Table Header */}
      <div className="hidden md:grid grid-cols-7 gap-2 px-3 py-3 bg-gray-50 border-b font-medium text-sm text-gray-700 rounded-t-lg">
        <div>Mã hàng hóa</div>
        <div>Tên hàng hóa</div>
        <div>Số lượng</div>
        <div>Ghi chú</div>
        <div>Đơn giá (VNĐ)</div>
        <div>Chiết khấu (VNĐ)</div>
        <div>Thành tiền (VNĐ)</div>
      </div>

      {/* Table Body */}
      <div className="divide-y">
        {quotationDetails.map((d, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-7 gap-2 p-3 hover:bg-gray-50"
          >
            {/* Mã hàng hóa */}
            <div>
              <span className="md:hidden text-xs text-gray-500 mb-1 block">
                Mã hàng hóa
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                {d.itemCode}
              </span>
            </div>

            {/* Tên hàng hóa */}
            <div>
              <span className="md:hidden text-xs text-gray-500 mb-1 block">
                Tên hàng hóa
              </span>
              <span className="text-sm">{d.itemName}</span>
            </div>

            {/* Số lượng */}
            <div>
              <span className="md:hidden text-xs text-gray-500 mb-1 block">
                Số lượng
              </span>
              <span className="text-sm">{d.quantity}</span>
            </div>

            {/* Ghi chú */}
            <div>
              <span className="md:hidden text-xs text-gray-500 mb-1 block">
                Ghi chú
              </span>
              <span className="text-sm text-gray-600">{d.note || "—"}</span>
            </div>

            {/* Đơn giá */}
            <div>
              <span className="md:hidden text-xs text-gray-500 mb-1 block">
                Đơn giá (VNĐ)
              </span>
              <span className="text-sm">
                {d.itemPrice?.toLocaleString("vi-VN")}
              </span>
            </div>

            {/* Chiết khấu */}
            <div>
              <span className="md:hidden text-xs text-gray-500 mb-1 block">
                Chiết khấu (VNĐ)
              </span>
              <Input
                type="number"
                value={d.discount}
                onChange={(e) =>
                  handleDetailChange(
                    i,
                    "discount",
                    e.target.value,
                    "number",
                    d.itemPrice * d.quantity
                  )
                }
                className="w-full md:w-24"
                min={0}
              />
            </div>

            {/* Thành tiền */}
            <div>
              <span className="md:hidden text-xs text-gray-500 mb-1 block">
                Thành tiền (VNĐ)
              </span>
              <span className="font-semibold text-gray-900">
                {(d.itemPrice * d.quantity - d.discount).toLocaleString("vi-VN")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuotationDetailTable;
