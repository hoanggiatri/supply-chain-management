import ConfirmDialog from "@/components/common/ConfirmDialog";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import DoForm from "@/components/delivery/DoForm";
import FormPageLayout from "@/components/layout/FormPageLayout";
import { Button } from "@/components/ui/button";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { createDeliveryProcess } from "@/services/delivery/DoProcessService";
import {
    getDeliveryOrderById,
    updateDeliveryOrder,
} from "@/services/delivery/DoService";
import { createReceiveTicket } from "@/services/inventory/ReceiveTicketService";
import { getPoById, updatePoStatus } from "@/services/purchasing/PoService";
import { getSoById, updateSoStatus } from "@/services/sale/SoService";
import toastrService from "@/services/toastrService";
import dayjs from "dayjs";
import { Check, CheckCircle, Package, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DoDetail = () => {
  const { doId } = useParams();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [deliveryOrder, setDeliveryOrder] = useState(null);
  const [so, setSo] = useState(null);
  const [details, setDetails] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null,
    onConfirm: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const doData = await getDeliveryOrderById(doId, token);
        setDeliveryOrder(doData);

        const soData = await getSoById(doData.soId, token);
        setSo(soData);

        setDetails(doData.deliveryOrderDetails || []);
      } catch (err) {
        toastrService.error(
          err.response?.data?.message || "Không thể tải dữ liệu đơn giao hàng!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doId, token]);

  const toLocalDateTimeString = (localDateTimeString = dayjs()) => {
    return dayjs(localDateTimeString).format("YYYY-MM-DDTHH:mm:ss");
  };

  const handleConfirm = async () => {
    const employeeName = localStorage.getItem("employeeName");
    try {
      const request = {
        createdBy: employeeName,
        status: "Chờ lấy hàng",
      };
      await updateDeliveryOrder(deliveryOrder.doId, request, token);
      setDeliveryOrder((prev) => ({
        ...prev,
        status: "Chờ lấy hàng",
        createdBy: employeeName,
      }));

      await updateSoStatus(so.soId, "Đang vận chuyển", token);
      await updatePoStatus(so.poId, "Đang vận chuyển", token);

      toastrService.success("Xác nhận đơn vận chuyển thành công!");
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi xảy ra khi xác nhận phiếu!"
      );
    }
  };

  const handlePickup = async () => {
    try {
      const fromProcess = {
        doId: deliveryOrder.doId,
        location: so.deliveryFromAddress,
        arrivalTime: toLocalDateTimeString(),
        note: "from",
      };
      await createDeliveryProcess(fromProcess, token);

      await updateDeliveryOrder(
        deliveryOrder.doId,
        { ...deliveryOrder, status: "Đang vận chuyển" },
        token
      );
      setDeliveryOrder((prev) => ({ ...prev, status: "Đang vận chuyển" }));

      toastrService.success("Lấy hàng thành công!");
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi xảy ra khi lấy hàng!"
      );
    }
  };

  const handleComplete = async () => {
    try {
      const toProcess = {
        doId: deliveryOrder.doId,
        location: so.deliveryToAddress,
        arrivalTime: toLocalDateTimeString(),
        note: "to",
      };

      await createDeliveryProcess(toProcess, token);

      await updateDeliveryOrder(
        deliveryOrder.doId,
        { ...deliveryOrder, status: "Đã hoàn thành" },
        token
      );
      setDeliveryOrder((prev) => ({ ...prev, status: "Đã hoàn thành" }));

      await updateSoStatus(so.soId, "Đã hoàn thành", token);
      await updatePoStatus(so.poId, "Chờ nhập kho", token);

      const po = await getPoById(so.poId, token);
      const employeeName = localStorage.getItem("employeeName");

      const receiveTicketRequest = {
        companyId: Number(so.customerCompanyId),
        warehouseId: Number(po.receiveWarehouseId),
        reason: "Nhập hàng mua về",
        receiveType: "Mua hàng",
        referenceCode: so.poCode,
        status: "Chờ xác nhận",
        receiveDate: new Date().toISOString(),
        createdBy: employeeName,
      };

      await createReceiveTicket(receiveTicketRequest, token);
      toastrService.success("Đã hoàn thành đơn vận chuyển!");
    } catch (error) {
      toastrService.error(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi hoàn thành đơn vận chuyển!"
      );
    }
  };

  const columns = [
    {
      accessorKey: "itemCode",
      header: createSortableHeader("Mã hàng hóa"),
      cell: ({ getValue }) => {
        const code = getValue();
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {code}
          </span>
        );
      },
    },
    {
      accessorKey: "itemName",
      header: createSortableHeader("Tên hàng hóa"),
    },
    {
      accessorKey: "quantity",
      header: createSortableHeader("Số lượng"),
    },
    {
      accessorKey: "note",
      header: createSortableHeader("Ghi chú"),
    },
  ];

  if (!deliveryOrder) return <LoadingPaper title="CHI TIẾT ĐƠN VẬN CHUYỂN" />;

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Đơn vận chuyển", path: "/dos" },
        { label: "Chi tiết" },
      ]}
      backLink="/dos"
      backLabel="Quay lại danh sách"
    >
      {/* Action buttons */}
      <div className="flex justify-end gap-3 mb-6">
        {deliveryOrder.status === "Chờ xác nhận" && (
          <Button
            variant="default"
            onClick={() =>
              setConfirmDialog({
                open: true,
                type: "confirm",
                onConfirm: handleConfirm,
              })
            }
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Check className="w-4 h-4" />
            Xác nhận
          </Button>
        )}
        {deliveryOrder.status === "Chờ lấy hàng" && (
          <Button
            variant="default"
            onClick={() =>
              setConfirmDialog({
                open: true,
                type: "pickup",
                onConfirm: handlePickup,
              })
            }
            className="gap-2 bg-orange-600 hover:bg-orange-700"
          >
            <Package className="w-4 h-4" />
            Lấy hàng
          </Button>
        )}
        {deliveryOrder.status === "Đang vận chuyển" && (
          <>
            <Button
              variant="default"
              onClick={() =>
                navigate(`/update-do-process/${deliveryOrder.doId}`)
              }
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <Truck className="w-4 h-4" />
              Thông tin vận chuyển
            </Button>
            <Button
              variant="default"
              onClick={() =>
                setConfirmDialog({
                  open: true,
                  type: "complete",
                  onConfirm: handleComplete,
                })
              }
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle className="w-4 h-4" />
              Hoàn thành
            </Button>
          </>
        )}
        {deliveryOrder.status === "Đã hoàn thành" && (
          <Button
            variant="default"
            onClick={() => navigate(`/do-process/${deliveryOrder.doId}`)}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <Truck className="w-4 h-4" />
            Thông tin vận chuyển
          </Button>
        )}
      </div>

      <DoForm deliveryOrder={deliveryOrder} />

      <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
        Danh sách hàng hóa
      </h2>

      <DataTable
        columns={columns}
        data={details}
        loading={loading}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() =>
          setConfirmDialog({ open: false, type: null, onConfirm: null })
        }
        onConfirm={confirmDialog.onConfirm || (() => {})}
        title="Xác nhận"
        message={(() => {
          if (confirmDialog.type === "confirm") {
            return "Bạn có chắc muốn xác nhận đơn vận chuyển này không?";
          }
          if (confirmDialog.type === "pickup") {
            return "Đã lấy hàng cho đơn vận chuyển này?";
          }
          return "Bạn có chắc muốn hoàn thành đơn vận chuyển này không?";
        })()}
        confirmText="Xác nhận"
        cancelText="Hủy"
      />
    </FormPageLayout>
  );
};

export default DoDetail;
