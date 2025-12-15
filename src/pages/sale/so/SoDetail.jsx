import LoadingPaper from "@/components/content-components/LoadingPaper";
import FormPageLayout from "@/components/layout/FormPageLayout";
import SoForm from "@/components/sale/SoForm";
import { Button } from "@/components/ui/button";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { getDeliveryOrderBySoId } from "@/services/delivery/DoService";
import { getPoById } from "@/services/purchasing/PoService";
import { getInvoicePdf } from "@/services/sale/InvoiceService";
import { getSoById } from "@/services/sale/SoService";
import toastrService from "@/services/toastrService";
import { FileText, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SoDetail = () => {
  const { soId } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [so, setSo] = useState(null);
  const [po, setPo] = useState(null);
  const [deliveryOrder, setDeliveryOrder] = useState(null);
  const [soDetails, setSoDetails] = useState([]);

  useEffect(() => {
    const fetchSo = async () => {
      setLoading(true);
      try {
        const soData = await getSoById(soId, token);
        setSo(soData);

        const poData = await getPoById(soData.poId, token);
        setPo(poData);

        const doData = await getDeliveryOrderBySoId(soId, token);
        setDeliveryOrder(doData);

        const details = soData.salesOrderDetails.map((d) => ({
          itemId: d.itemId,
          itemCode: d.itemCode,
          itemName: d.itemName,
          quantity: d.quantity,
          itemPrice: d.itemPrice,
          discount: d.discount,
          note: d.note,
        }));
        setSoDetails(details);
      } catch (err) {
        toastrService.error(
          err.response?.data?.message || "Không thể tải dữ liệu đơn bán hàng!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSo();
  }, [soId, token]);

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
    {
      accessorKey: "itemPrice",
      header: createSortableHeader("Đơn giá (VNĐ)"),
      cell: ({ getValue }) => getValue()?.toLocaleString("vi-VN") || "0",
    },
    {
      accessorKey: "discount",
      header: createSortableHeader("Chiết khấu"),
      cell: ({ getValue }) => getValue()?.toLocaleString("vi-VN") || "0",
    },
    {
      id: "total",
      header: () => <span className="font-medium">Thành tiền</span>,
      cell: ({ row }) => {
        const price = row.original.itemPrice || 0;
        const qty = row.original.quantity || 0;
        const discount = row.original.discount || 0;
        const total = price * qty - discount;
        return (
          <span className="font-semibold">
            {total.toLocaleString("vi-VN")}
          </span>
        );
      },
    },
  ];

  if (!so || !po) return <LoadingPaper title="CHI TIẾT ĐƠN BÁN HÀNG" />;

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Danh sách đơn bán hàng", path: "/sos" },
        { label: "Chi tiết" },
      ]}
      backLink="/sos"
      backLabel="Quay lại danh sách"
    >
      {/* Action buttons */}
      <div className="flex justify-end gap-3 mb-6">
        {so.status === "Đang vận chuyển" && deliveryOrder && (
          <Button
            variant="default"
            onClick={() => navigate(`/do-process/${deliveryOrder.doId}`)}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <Truck className="w-4 h-4" />
            Thông tin vận chuyển
          </Button>
        )}
        {so.status === "Đã hoàn thành" && (
          <>
            <Button
              variant="default"
              onClick={() => getInvoicePdf(so.soId, token)}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <FileText className="w-4 h-4" />
              Xem hóa đơn
            </Button>
            {deliveryOrder && (
              <Button
                variant="default"
                onClick={() => navigate(`/do-process/${deliveryOrder.doId}`)}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <Truck className="w-4 h-4" />
                Thông tin vận chuyển
              </Button>
            )}
          </>
        )}
      </div>

      <SoForm po={po} so={so} readOnly />

      <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
        Danh sách hàng hóa
      </h2>

      <DataTable
        columns={columns}
        data={soDetails}
        loading={loading}
      />

      {/* Summary */}
      <div className="mt-6 flex justify-end">
        <div className="w-full max-w-sm space-y-2">
          {[
            {
              label: "Tổng tiền hàng (VNĐ):",
              value: so.subTotal?.toLocaleString("vi-VN"),
            },
            { label: "Thuế (%):", value: so.taxRate },
            {
              label: "Tiền thuế (VNĐ):",
              value: so.taxAmount?.toLocaleString("vi-VN"),
            },
            {
              label: "Tổng cộng (VNĐ):",
              value: so.totalAmount?.toLocaleString("vi-VN"),
            },
          ].map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className="font-medium text-gray-700">{item.label}</span>
              <span className="font-semibold text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </FormPageLayout>
  );
};

export default SoDetail;
