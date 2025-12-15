import LoadingPaper from "@/components/content-components/LoadingPaper";
import FormPageLayout from "@/components/layout/FormPageLayout";
import RfqForm from "@/components/purchasing/RfqForm";
import { Button } from "@/components/ui/button";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { getRfqById, updateRfqStatus } from "@/services/purchasing/RfqService";
import toastrService from "@/services/toastrService";
import { Eye, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const RfqDetail = () => {
  const { rfqId } = useParams();
  const [rfq, setRfq] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRfq = async () => {
      setLoading(true);
      try {
        const data = await getRfqById(rfqId, token);
        setRfq(data);
      } catch (error) {
        toastrService.error(error.response?.data?.message || "Lỗi khi tải RFQ");
      } finally {
        setLoading(false);
      }
    };
    fetchRfq();
  }, [rfqId, token]);

  const readOnlyFields = {
    rfqCode: true,
    requestedCompanyCode: true,
    needByDate: true,
    createdBy: true,
    status: true,
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
  ];

  const handleCancel = async () => {
    const result = await toastrService.confirm(
      "Bạn có chắc chắn muốn hủy yêu cầu báo giá này không?"
    );
    if (!result.isConfirmed) return;

    try {
      await updateRfqStatus(rfq.rfqId, "Đã hủy", token);
      toastrService.success("Đã hủy yêu cầu báo giá!");

      setRfq((prev) => ({
        ...prev,
        status: "Đã hủy",
      }));
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi khi hủy yêu cầu báo giá!"
      );
    }
  };

  if (!rfq) return <LoadingPaper title="THÔNG TIN YÊU CẦU BÁO GIÁ" />;

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Danh sách yêu cầu báo giá", path: "/rfqs" },
        { label: "Chi tiết" },
      ]}
      backLink="/rfqs"
      backLabel="Quay lại danh sách"
    >
      {/* Action buttons */}
      <div className="flex justify-end gap-3 mb-6">
        {rfq.status === "Chưa báo giá" && (
          <Button
            variant="destructive"
            onClick={handleCancel}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Hủy
          </Button>
        )}
        {rfq.status === "Đã báo giá" && (
          <Button
            variant="default"
            onClick={() => navigate(`/customer-quotation/${rfq.rfqId}`)}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Eye className="w-4 h-4" />
            Xem báo giá
          </Button>
        )}
      </div>

      <RfqForm
        rfq={rfq}
        onChange={() => {}}
        errors={{}}
        readOnlyFields={readOnlyFields}
        setRfq={setRfq}
      />

      <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
        Danh sách hàng hóa yêu cầu báo giá
      </h2>

      <DataTable
        columns={columns}
        data={rfq?.rfqDetails || []}
        loading={loading}
      />
    </FormPageLayout>
  );
};

export default RfqDetail;
