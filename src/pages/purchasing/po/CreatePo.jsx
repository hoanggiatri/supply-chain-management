import LoadingPaper from "@/components/content-components/LoadingPaper";
import FormPageLayout from "@/components/layout/FormPageLayout";
import PoForm from "@/components/purchasing/PoForm";
import { Button } from "@/components/ui/button";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { createPo } from "@/services/purchasing/PoService";
import { getQuotationById } from "@/services/sale/QuotationService";
import toastrService from "@/services/toastrService";
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CreatePo = () => {
  const { quotationId } = useParams();
  const token = localStorage.getItem("token");
  const employeeName = localStorage.getItem("employeeName");
  const companyAddress = localStorage.getItem("companyAddress");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [quotation, setQuotation] = useState(null);
  const [po, setPo] = useState({});
  const [quotationDetails, setQuotationDetails] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const quotationData = await getQuotationById(quotationId, token);
        setQuotation(quotationData);

        setPo({
          companyId: quotationData.requestCompanyId,
          supplierCompanyId: quotationData.companyId,
          quotationId: quotationData.quotationId,
          paymentMethod: "Ghi công nợ",
          receiveWarehouseId: "",
          createdBy: employeeName,
          deliveryToAddress: companyAddress,
          status: "Chờ xác nhận",
        });

        const details = quotationData.quotationDetails.map((d) => ({
          itemId: d.customerItemId,
          itemCode: d.customerItemCode,
          itemName: d.customerItemName,
          discount: d.discount,
          quantity: d.quantity,
          note: d.note,
          supplierItemId: d.itemId,
          supplierItemCode: d.itemCode,
          supplierItemName: d.itemName,
          itemPrice: d.itemPrice,
        }));
        setQuotationDetails(details);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Không thể tải dữ liệu!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quotationId, employeeName, companyAddress, token]);

  const validate = () => {
    const newErrors = {};
    if (!po.receiveWarehouseId)
      newErrors.receiveWarehouseId = "Chưa chọn kho nhập hàng về!";
    if (!po.deliveryToAddress.trim())
      newErrors.deliveryToAddress = "Địa chỉ giao hàng không được để trống";
    if (!po.paymentMethod)
      newErrors.paymentMethod = "Chưa chọn phương thức thanh toán";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const request = {
        companyId: Number(po.companyId),
        supplierCompanyId: Number(po.supplierCompanyId),
        quotationId: Number(po.quotationId),
        receiveWarehouseId: Number(po.receiveWarehouseId),
        paymentMethod: po.paymentMethod,
        deliveryToAddress: po.deliveryToAddress,
        createdBy: po.createdBy,
        status: po.status,
      };
      await createPo(request, token);
      toastrService.success("Tạo đơn mua hàng thành công!");
      navigate("/customer-quotations");
    } catch (err) {
      toastrService.error(
        err.response?.data?.message || "Không thể tạo đơn mua hàng!"
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
      accessorKey: "supplierItemCode",
      header: createSortableHeader("Mã hàng NCC"),
    },
    {
      accessorKey: "supplierItemName",
      header: createSortableHeader("Tên hàng NCC"),
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

  if (!quotation) return <LoadingPaper title="TẠO ĐƠN MUA HÀNG" />;

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Báo giá nhận được", path: "/customer-quotations" },
        { label: "Tạo đơn mua hàng" },
      ]}
      backLink="/customer-quotations"
      backLabel="Quay lại danh sách"
    >
      <PoForm
        po={po}
        setPo={setPo}
        quotation={quotation}
        errors={errors}
        readOnlyFields={[]}
      />

      <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
        Danh sách hàng hóa báo giá
      </h2>

      <DataTable
        columns={columns}
        data={quotationDetails}
        loading={loading}
      />

      {/* Summary */}
      <div className="mt-6 flex justify-end">
        <div className="w-full max-w-sm space-y-2">
          {[
            {
              label: "Tổng tiền hàng (VNĐ):",
              value: quotation.subTotal?.toLocaleString("vi-VN"),
            },
            { label: "Thuế (%):", value: quotation.taxRate },
            {
              label: "Tiền thuế (VNĐ):",
              value: quotation.taxAmount?.toLocaleString("vi-VN"),
            },
            {
              label: "Tổng cộng (VNĐ):",
              value: quotation.totalAmount?.toLocaleString("vi-VN"),
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
          onClick={() => navigate(-1)}
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
          Tạo đơn mua hàng
        </Button>
      </div>
    </FormPageLayout>
  );
};

export default CreatePo;
