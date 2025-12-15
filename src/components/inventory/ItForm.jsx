import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PropTypes from "prop-types";

const ItForm = ({ ticket }) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Mã phiếu */}
      <div className="space-y-2">
        <Label htmlFor="ticketCode">Mã phiếu</Label>
        <Input
          id="ticketCode"
          value={ticket.ticketCode || ""}
          readOnly
          disabled
        />
      </div>

      {/* Mã tham chiếu */}
      <div className="space-y-2">
        <Label htmlFor="referenceCode">Mã tham chiếu</Label>
        <Input
          id="referenceCode"
          value={ticket.referenceCode || ""}
          readOnly
          disabled
        />
      </div>

      {/* Mã kho */}
      <div className="space-y-2">
        <Label htmlFor="warehouseCode">Mã kho</Label>
        <Input
          id="warehouseCode"
          value={ticket.warehouseCode || ""}
          readOnly
          disabled
        />
      </div>

      {/* Tên kho */}
      <div className="space-y-2">
        <Label htmlFor="warehouseName">Tên kho</Label>
        <Input
          id="warehouseName"
          value={ticket.warehouseName || ""}
          readOnly
          disabled
        />
      </div>

      {/* Ngày xuất kho */}
      <div className="space-y-2">
        <Label htmlFor="issueDate">Ngày xuất kho</Label>
        <Input
          id="issueDate"
          type="datetime-local"
          value={formatDateTimeLocal(ticket.issueDate)}
          readOnly
          disabled
        />
      </div>

      {/* Lý do */}
      <div className="space-y-2">
        <Label htmlFor="reason">Lý do</Label>
        <Input
          id="reason"
          value={ticket.reason || ""}
          readOnly
          disabled
        />
      </div>

      {/* Loại xuất kho */}
      <div className="space-y-2">
        <Label htmlFor="issueType">Loại xuất kho</Label>
        <Input
          id="issueType"
          value={ticket.issueType || ""}
          readOnly
          disabled
        />
      </div>

      {/* Trạng thái */}
      <div className="space-y-2">
        <Label htmlFor="status">Trạng thái</Label>
        <Input
          id="status"
          value={ticket.status || ""}
          readOnly
          disabled
        />
      </div>
    </div>
  );
};

ItForm.propTypes = {
  ticket: PropTypes.object.isRequired,
};

export default ItForm;
