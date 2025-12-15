import LoadingPaper from "@/components/content-components/LoadingPaper";
import FormPageLayout from "@/components/layout/FormPageLayout";
import SupplierPoForm from "@/components/purchasing/SupplierPoForm";
import { Button } from "@/components/ui/button";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { getPoById } from "@/services/purchasing/PoService";
import toastrService from "@/services/toastrService";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SupplierPoDetail = () => {
  const { poId } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [po, setPo] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const poData = await getPoById(poId, token);
        setPo(poData);
        setDetails(poData.purchaseOrderDetails || []);
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

  const handleConfirm = (type, id) => {
    navigate(`/check-inventory/${type}/${id}`);
  };

  const columns = [
    {
      accessorKey: "supplierItemCode",
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
      accessorKey: "supplierItemName",
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

  if (!po) return <LoadingPaper title="CHI TIẾT ĐƠN MUA HÀNG" />;

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Đơn đặt hàng", path: "/supplier-pos" },
        { label: "Chi tiết" },
      ]}
      backLink="/supplier-pos"
      backLabel="Quay lại danh sách"
    >
      {/* Action button */}
      <div className="flex justify-end gap-3 mb-6">
        {po.status === "Chờ xác nhận" && (
          <Button
            variant="default"
            onClick={() => handleConfirm("po", po.poId)}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Check className="w-4 h-4" />
            Xác nhận
          </Button>
        )}
      </div>

      <SupplierPoForm po={po} />

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
              value: po.subTotal?.toLocaleString("vi-VN"),
            },
            { label: "Thuế (%):", value: po.taxRate },
            {
              label: "Tiền thuế (VNĐ):",
              value: po.taxAmount?.toLocaleString("vi-VN"),
            },
            {
              label: "Tổng cộng (VNĐ):",
              value: po.totalAmount?.toLocaleString("vi-VN"),
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

export default SupplierPoDetail;
