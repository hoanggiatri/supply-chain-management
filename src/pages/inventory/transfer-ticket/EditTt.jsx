import FormPageLayout from "@/components/layout/FormPageLayout";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import TtDetailTable from "@/components/inventory/TtDetailTable";
import TtForm from "@/components/inventory/TtForm";
import { Button } from "@/components/ui/button";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import {
  getTransferTicketById,
  updateTransferTicket,
} from "@/services/inventory/TransferTicketService";
import toastrService from "@/services/toastrService";
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditTt = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = parseInt(localStorage.getItem("companyId"));
  const employeeName = localStorage.getItem("employeeName");

  const [ticket, setTicket] = useState(null);
  const [ticketDetails, setTicketDetails] = useState([]);
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState({ ticketDetailErrors: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketData, itemData] = await Promise.all([
          getTransferTicketById(ticketId, token),
          getAllItemsInCompany(companyId, token),
        ]);

        setTicket({
          ...ticketData,
          ticketCode: ticketData.ticketCode || "",
          reason: ticketData.reason || "",
          fromWarehouseCode: ticketData.fromWarehouseCode || "",
          fromWarehouseName: ticketData.fromWarehouseName || "",
          toWarehouseCode: ticketData.toWarehouseCode || "",
          toWarehouseName: ticketData.toWarehouseName || "",
          status: ticketData.status || "",
        });

        setTicketDetails(ticketData.transferTicketDetails || []);
        setItems(itemData || []);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
          "Có lỗi khi tải dữ liệu phiếu điều chuyển!"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ticketId, companyId, token]);

  const validateForm = () => {
    const formErrors = {};
    if (!ticket.reason?.trim()) formErrors.reason = "Lý do không được để trống";
    if (!ticket.fromWarehouseCode)
      formErrors.fromWarehouseCode = "Phải chọn kho xuất";
    if (!ticket.toWarehouseCode)
      formErrors.toWarehouseCode = "Phải chọn kho nhập";
    if (!ticket.status?.trim())
      formErrors.status = "Trạng thái không được để trống";
    return formErrors;
  };

  const validateTicketDetails = () => {
    const detailErrors = [];

    ticketDetails.forEach((detail, index) => {
      if (!detail.itemId) {
        detailErrors.push({
          index,
          field: "itemId",
          message: "Phải chọn hàng hóa",
        });
      }
      if (detail.quantity < 0) {
        detailErrors.push({ index, field: "quantity", message: ">= 0" });
      }
    });
    return detailErrors;
  };

  const readOnlyFields = {
    ticketCode: true,
    fromWarehouseCode: true,
    toWarehouseCode: true,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    const ticketDetailErrors = validateTicketDetails();

    if (Object.keys(formErrors).length > 0 || ticketDetailErrors.length > 0) {
      setErrors({ ...formErrors, ticketDetailErrors });
      return;
    }

    try {
      const request = {
        companyId: companyId,
        reason: ticket.reason,
        fromWarehouseId: parseInt(ticket.fromWarehouseId),
        toWarehouseId: parseInt(ticket.toWarehouseId),
        status: ticket.status,
        createdBy: employeeName,
        transferTicketDetails: ticketDetails.map((detail) => ({
          itemId: parseInt(detail.itemId),
          quantity: parseFloat(detail.quantity),
          note: detail.note,
        })),
      };

      await updateTransferTicket(ticket.ticketId, request, token);
      toastrService.success("Cập nhật phiếu chuyển kho thành công!");
      navigate(-1);
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Lỗi khi cập nhật phiếu chuyển kho!"
      );
    }
  };

  const handleCancel = () => {
    navigate("/transfer-tickets");
  };

  if (loading) {
    return <LoadingPaper title="CẬP NHẬT PHIẾU CHUYỂN KHO" />;
  }

  const breadcrumbItems = [
    { label: "Danh sách", path: "/transfer-tickets" },
    { label: "Chi tiết", path: `/transfer-ticket/${ticketId}` },
    { label: "Cập nhật", path: "" }
  ];

  return (
    <FormPageLayout breadcrumbItems={breadcrumbItems} backLink={`/transfer-ticket/${ticketId}`}>
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Thông tin chung</h3>
          <TtForm
            ticket={ticket}
            onChange={handleChange}
            errors={errors}
            readOnlyFields={readOnlyFields}
            setTicket={setTicket}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Danh sách hàng hóa</h3>
          <TtDetailTable
            ticketDetails={ticketDetails}
            setTicketDetails={setTicketDetails}
            items={items}
            errors={errors.ticketDetailErrors}
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
            Lưu
          </Button>
        </div>
      </div>
    </FormPageLayout>
  );
};

export default EditTt;
