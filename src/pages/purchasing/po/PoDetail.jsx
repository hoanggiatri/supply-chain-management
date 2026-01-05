import LoadingPaper from "@/components/content-components/LoadingPaper";
import FormPageLayout from "@/components/layout/FormPageLayout";
import PoForm from "@/components/purchasing/PoForm";
import { Button } from "@/components/ui/button";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { getDeliveryOrderBySoId } from "@/services/delivery/DoService";
import { getPoById, updatePoStatus } from "@/services/purchasing/PoService";
import { getInvoicePdf } from "@/services/sale/InvoiceService";
import { getQuotationById } from "@/services/sale/QuotationService";
import { getSoByPoId } from "@/services/sale/SoService";
import toastrService from "@/services/toastrService";
import { FileText, Truck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PoDetail = () => {
  const { poId } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [po, setPo] = useState(null);
  const [quotation, setQuotation] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const poData = await getPoById(poId, token);
        setPo(poData);

        const quotationData = await getQuotationById(poData.quotationId, token);
        setQuotation(quotationData);
        setDetails(quotationData.quotationDetails || []);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Không thể tải chi tiết đơn mua hàng!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [poId, token]);

  const handleCancel = async () => {
    const result = await toastrService.confirm(
      "Bạn có chắc chắn muốn hủy đơn mua hàng này không?"
    );
    if (!result.isConfirmed) return;

    try {
      await updatePoStatus(po.poId, "Đã hủy", token);
      toastrService.success("Đã hủy đơn mua hàng!");

      setPo((prev) => ({
        ...prev,
        status: "Đã hủy",
      }));
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi khi hủy đơn mua hàng!"
      );
    }
  };

  const handleViewDoProcess = async () => {
    try {
      const soData = await getSoByPoId(po.poId, token);
      const doData = await getDeliveryOrderBySoId(soData.soId, token);
      navigate(`/do-process/${doData.doId}`);
    } catch (error) {
      toastrService.error("Không thể tải thông tin vận chuyển");
    }
  };

  const handleViewInvoice = async () => {
    try {
      const soData = await getSoByPoId(po.poId, token);
      await getInvoicePdf(soData.soId, token);
    } catch (error) {
      toastrService.error("Không thể tải hóa đơn");
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

  const readOnlyFields = {
    paymentMethod: true,
    receiveWarehouseId: true,
    deliveryToAddress: true,
  };

  if (loading || !po) return <LoadingPaper title="CHI TIẾT ĐƠN MUA HÀNG" />;

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Danh sách đơn mua hàng", path: "/pos" },
        { label: "Chi tiết" },
      ]}
      backLink={-1}
      backLabel="Quay lại"
    >
      {/* Action buttons */}
      <div className="flex justify-end gap-3 mb-6">
        {po.status === "Chờ xác nhận" && (
          <Button
            variant="destructive"
            onClick={handleCancel}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Hủy
          </Button>
        )}
        {(po.status === "Đang vận chuyển" || po.status === "Chờ nhập kho") && (
          <Button
            variant="default"
            onClick={handleViewDoProcess}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <Truck className="w-4 h-4" />
            Thông tin vận chuyển
          </Button>
        )}
        {po.status === "Đã hoàn thành" && (
          <>
            <Button
              variant="default"
              onClick={handleViewInvoice}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <FileText className="w-4 h-4" />
              Xem hóa đơn
            </Button>
            <Button
              variant="default"
              onClick={handleViewDoProcess}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <Truck className="w-4 h-4" />
              Thông tin vận chuyển
            </Button>
          </>
        )}
      </div>

      <PoForm
        po={po}
        quotation={quotation}
        readOnly
        setPo={() => {}}
        errors={{}}
        readOnlyFields={readOnlyFields}
      />

      <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
        Danh sách hàng hóa
      </h2>

      <DataTable
        columns={columns}
        data={details}
        loading={loading}
      />

      {/* Summary */}
      <div className="mt-6 flex justify-end">
        <div className="w-full max-w-sm space-y-2">
          {[
            {
              label: "Tổng tiền hàng (VNĐ):",
              value: po?.subTotal?.toLocaleString("vi-VN"),
            },
            { label: "Thuế (%):", value: po?.taxRate },
            {
              label: "Tiền thuế (VNĐ):",
              value: po?.taxAmount?.toLocaleString("vi-VN"),
            },
            {
              label: "Tổng cộng (VNĐ):",
              value: po?.totalAmount?.toLocaleString("vi-VN"),
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

export default PoDetail;
