import LoadingPaper from "@/components/content-components/LoadingPaper";
import FormPageLayout from "@/components/layout/FormPageLayout";
import SupplierRfqForm from "@/components/purchasing/SupplierRfqForm";
import { Button } from "@/components/ui/button";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { getRfqById } from "@/services/purchasing/RfqService";
import toastrService from "@/services/toastrService";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SupplierRfqDetail = () => {
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
  ];

  if (!rfq) return <LoadingPaper title="THÔNG TIN YÊU CẦU BÁO GIÁ" />;

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Yêu cầu báo giá", path: "/supplier-rfqs" },
        { label: "Chi tiết" },
      ]}
      backLink="/supplier-rfqs"
      backLabel="Quay lại danh sách"
    >
      {/* Action button */}
      <div className="flex justify-end gap-3 mb-6">
        {rfq.status === "Chưa báo giá" && (
          <Button
            variant="default"
            onClick={() => navigate(`/create-quotation/${rfqId}`)}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
            Gửi báo giá
          </Button>
        )}
      </div>

      <SupplierRfqForm rfq={rfq} />

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

export default SupplierRfqDetail;
