import React from "react";
import { Input } from "@material-tailwind/react";

const RtForm = ({ ticket }) => {
  const formatDateTimeLocal = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="Mã phiếu"
        value={ticket.ticketCode || ""}
        readOnly
        color="blue"
        className="w-full placeholder:opacity-100"
      />
      <Input
        label="Mã tham chiếu"
        value={ticket.referenceCode || ""}
        readOnly
        color="blue"
        className="w-full placeholder:opacity-100"
      />
      <Input
        label="Mã kho"
        value={ticket.warehouseCode || ""}
        readOnly
        color="blue"
        className="w-full placeholder:opacity-100"
      />
      <Input
        label="Tên kho"
        value={ticket.warehouseName || ""}
        readOnly
        color="blue"
        className="w-full placeholder:opacity-100"
      />
      <Input
        label="Ngày nhập kho"
        type="datetime-local"
        value={formatDateTimeLocal(ticket.receiveDate)}
        readOnly
        color="blue"
        className="w-full placeholder:opacity-100"
      />
      <Input
        label="Lý do"
        value={ticket.reason || ""}
        readOnly
        color="blue"
        className="w-full placeholder:opacity-100"
      />
      <Input
        label="Loại nhập kho"
        value={ticket.receiveType || ""}
        readOnly
        color="blue"
        className="w-full placeholder:opacity-100"
      />
      <Input
        label="Trạng thái"
        value={ticket.status || ""}
        readOnly
        color="blue"
        className="w-full placeholder:opacity-100"
      />
    </div>
  );
};

export default RtForm;
