import LoadingPaper from "@/components/content-components/LoadingPaper";
import FormPageLayout from "@/components/layout/FormPageLayout";
import SoForm from "@/components/sale/SoForm";
import { Button } from "@/components/ui/button";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { increaseOnDemand } from "@/services/inventory/InventoryService";
import { createIssueTicket } from "@/services/inventory/IssueTicketService";
import { getPoById, updatePoStatus } from "@/services/purchasing/PoService";
import { createSo } from "@/services/sale/SoService";
import toastrService from "@/services/toastrService";
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CreateSo = () => {
  const { poId } = useParams();
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const poWarehouseId = localStorage.getItem("poWarehouseId");
  const employeeName = localStorage.getItem("employeeName");
  const companyAddress = localStorage.getItem("companyAddress");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [po, setPo] = useState(null);
  const [so, setSo] = useState({});
  const [soDetails, setSoDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const poData = await getPoById(poId, token);
        setPo(poData);

        setSo({
          companyId: poData.supplierCompanyId,
          customerCompanyId: poData.companyId,
          poId: poData.poId,
          paymentMethod: poData.paymentMethod,
          createdBy: employeeName,
          deliveryToAddress: poData.deliveryToAddress,
          deliveryFromAddress: companyAddress,
          status: "Chờ xuất kho",
        });

        const details = poData.purchaseOrderDetails.map((d) => ({
          itemId: d.supplierItemId,
          itemCode: d.supplierItemCode,
          itemName: d.supplierItemName,
          quantity: d.quantity,
          itemPrice: d.itemPrice,
          discount: d.discount,
          note: d.note,
        }));

        setSoDetails(details);
      } catch (err) {
        toastrService.error(
          err.response?.data?.message || "Không thể tải dữ liệu!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [poId, token, employeeName, companyAddress]);

  const handleSubmit = async () => {
    try {
      const request = {
        companyId: Number(so.companyId),
        customerCompanyId: Number(so.customerCompanyId),
        poId: Number(so.poId),
        paymentMethod: so.paymentMethod,
        deliveryToAddress: so.deliveryToAddress,
        deliveryFromAddress: so.deliveryFromAddress,
        createdBy: so.createdBy,
        status: so.status,
      };
      const createdSo = await createSo(request, token);
      const soCode = createdSo.soCode;

      const issueTicketRequest = {
        companyId: Number(companyId),
        warehouseId: Number(poWarehouseId),
        reason: "Xuất kho để bán hàng",
        issueType: "Bán hàng",
        referenceCode: soCode,
        status: "Chờ xác nhận",
        createdBy: employeeName,
        issueDate: new Date().toISOString(),
      };

      await createIssueTicket(issueTicketRequest, token);

      await Promise.all(
        soDetails.map((d) =>
          increaseOnDemand(
            {
              warehouseId: Number(poWarehouseId),
              itemId: Number(d.itemId),
              onDemandQuantity: parseFloat(d.quantity),
            },
            token
          )
        )
      );

      await updatePoStatus(poId, "Đã xác nhận", token);

      toastrService.success("Tạo đơn bán hàng thành công!");
      navigate("/supplier-pos");
    } catch (err) {
      toastrService.error(
        err.response?.data?.message || "Không thể tạo đơn bán hàng!"
      );
    }
  };

  const handleCancel = () => {
    navigate(-2);
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

  if (!po) return <LoadingPaper title="TẠO ĐƠN BÁN HÀNG" />;

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Đơn đặt hàng", path: "/supplier-pos" },
        { label: "Tạo đơn bán hàng" },
      ]}
      backLink="/supplier-pos"
      backLabel="Quay lại danh sách"
    >
      <SoForm so={so} setSo={setSo} po={po} />

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

      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Hủy
        </Button>
        <Button
          type="button"
          variant="default"
          onClick={handleSubmit}
          className="gap-2 bg-blue-600 hover:bg-blue-700 min-w-[160px]"
        >
          <Save className="w-4 h-4" />
          Tạo đơn bán hàng
        </Button>
      </div>
    </FormPageLayout>
  );
};

export default CreateSo;
