import BackButton from "@/components/common/BackButton";
import TtDetailTable from "@/components/inventory/TtDetailTable";
import TtForm from "@/components/inventory/TtForm";
import { Button } from "@/components/ui/button";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import { createTransferTicket } from "@/services/inventory/TransferTicketService";
import toastrService from "@/services/toastrService";
import { Card, CardBody, Typography } from "@material-tailwind/react";
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
      console.log("Request", request);

      await createTransferTicket(request, token);
      toastrService.success("Tạo phiếu chuyển kho thành công!");
      navigate("/transfer-tickets");
    } catch (error) {
      console.log(error.response);
      toastrService.error(
        error.response?.data?.message || "Lỗi khi tạo phiếu chuyển kho!"
      );
    }
  };

  const handleCancel = () => {
    navigate("/transfer-tickets");
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              TẠO PHIẾU CHUYỂN KHO
            </Typography>
            <BackButton to="/transfer-tickets" label="Quay lại danh sách" />
          </div>

          <TtForm
            ticket={ticket}
            onChange={handleChange}
            readOnlyFields={{ status: true }}
            setTicket={setTicket}
            errors={errors}
          />

          <Typography variant="h5" className="mt-6 mb-4 font-semibold">
            DANH SÁCH HÀNG HÓA:
          </Typography>

          <TtDetailTable
            ticketDetails={details}
            setTicketDetails={setDetails}
            items={items}
            errors={errors.transferDetailErrors}
          />

          <div className="mt-6 flex justify-end gap-2">
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              <Save className="w-4 h-4" />
              Lưu phiếu
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Hủy
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreateTt;
