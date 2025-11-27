import React, { useEffect, useState } from "react";
import { Typography, Card, CardBody, Button } from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTransferTicketById,
  updateTransferTicket,
} from "@/services/inventory/TransferTicketService";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import TtForm from "@/components/inventory/TtForm";
import TtDetailTable from "@/components/inventory/TtDetailTable";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import toastrService from "@/services/toastrService";
import BackButton from "@/components/common/BackButton";
import { getButtonProps } from "@/utils/buttonStyles";

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
    navigate("/transfer-ticket");
  };

  if (loading) {
    return <LoadingPaper title="CẬP NHẬT PHIẾU CHUYỂN KHO" />;
  }

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              CẬP NHẬT PHIẾU CHUYỂN KHO
            </Typography>
            <BackButton to={`/transfer-ticket/${ticketId}`} label="Quay lại" />
          </div>

          <TtForm
            ticket={ticket}
            onChange={handleChange}
            errors={errors}
            readOnlyFields={readOnlyFields}
            setTicket={setTicket}
          />

          <Typography variant="h5" className="mt-6 mb-4 font-semibold">
            DANH SÁCH HÀNG HÓA CHUYỂN KHO:
          </Typography>

          <TtDetailTable
            ticketDetails={ticketDetails}
            setTicketDetails={setTicketDetails}
            items={items}
            errors={errors.ticketDetailErrors}
          />

          <div className="mt-6 flex justify-end gap-2">
            <Button {...getButtonProps("primary")} onClick={handleSubmit}>
              Lưu
            </Button>
            <Button
              {...getButtonProps("outlinedSecondary")}
              onClick={handleCancel}
            >
              Hủy
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditTt;
