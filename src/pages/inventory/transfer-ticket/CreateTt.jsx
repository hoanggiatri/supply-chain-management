import FormPageLayout from "@/components/layout/FormPageLayout";
import TtDetailTable from "@/components/inventory/TtDetailTable";
import TtForm from "@/components/inventory/TtForm";
import { Button } from "@/components/ui/button";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import { createTransferTicket } from "@/services/inventory/TransferTicketService";
import toastrService from "@/services/toastrService";
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateTt = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = parseInt(localStorage.getItem("companyId"));
  const employeeName = localStorage.getItem("employeeName");

  const [errors, setErrors] = useState({ transferDetailErrors: [] });
  const [details, setDetails] = useState([]);
  const [items, setItems] = useState([]);

  const [ticket, setTicket] = useState({
    companyId,
    reason: "",
    fromWarehouseId: "",
    toWarehouseId: "",
    fromWarehouseCode: "",
    toWarehouseCode: "",
    fromWarehouseName: "",
    toWarehouseName: "",
    status: "Chờ xác nhận",
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getAllItemsInCompany(companyId, token);
        setItems(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Lỗi khi tải danh sách hàng hóa!"
        );
      }
    };
    fetchItems();
  }, [companyId, token]);

  const validateForm = () => {
    const formErrors = {};
    if (!ticket.reason?.trim()) formErrors.reason = "Lý do không được để trống";
    if (!ticket.fromWarehouseCode)
      formErrors.fromWarehouseCode = "Chưa chọn kho xuất";
    if (!ticket.toWarehouseCode)
      formErrors.toWarehouseCode = "Chưa chọn kho nhập";
    if (ticket.fromWarehouseCode === ticket.toWarehouseCode)
      formErrors.toWarehouseCode = "Kho xuất và kho nhập không được giống nhau";
    return formErrors;
  };

  const validateDetails = () => {
    const tableErrors = [];

    details.forEach((detail, index) => {
      if (!detail.itemId) {
        tableErrors.push({
          index,
          field: "itemId",
          message: "Phải chọn hàng hóa",
        });
      }
      if (detail.quantity < 0) {
        tableErrors.push({ index, field: "quantity", message: ">=0" });
      }
    });

    return tableErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    const transferDetailErrors = validateDetails();

    if (Object.keys(formErrors).length > 0 || transferDetailErrors.length > 0) {
      setErrors({ ...formErrors, transferDetailErrors });
      return;
    }

    try {
      const request = {
        companyId: companyId,
        fromWarehouseId: parseInt(ticket.fromWarehouseId),
        toWarehouseId: parseInt(ticket.toWarehouseId),
        reason: ticket.reason,
        createdBy: employeeName,
        status: ticket.status,
        file: ticket.file,
        transferTicketDetails: details.map((detail) => ({
          itemId: parseInt(detail.itemId),
          quantity: parseFloat(detail.quantity),
          note: detail.note,
        })),
      };

      await createTransferTicket(request, token);
      toastrService.success("Tạo phiếu chuyển kho thành công!");
      navigate("/transfer-tickets");
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Lỗi khi tạo phiếu chuyển kho!"
      );
    }
  };

  const handleCancel = () => {
    navigate("/transfer-tickets");
  };

  const breadcrumbItems = [
    { label: "Danh sách", path: "/transfer-tickets" },
    { label: "Tạo phiếu chuyển", path: "" }
  ];

  return (
    <FormPageLayout breadcrumbItems={breadcrumbItems} backLink="/transfer-tickets">
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Thông tin chung</h3>
          <TtForm
            ticket={ticket}
            onChange={handleChange}
            readOnlyFields={{ status: true }}
            setTicket={setTicket}
            errors={errors}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Danh sách hàng hóa</h3>
          <TtDetailTable
            ticketDetails={details}
            setTicketDetails={setDetails}
            items={items}
            errors={errors.transferDetailErrors}
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
            Lưu phiếu
          </Button>
        </div>
      </div>
    </FormPageLayout>
  );
};

export default CreateTt;
