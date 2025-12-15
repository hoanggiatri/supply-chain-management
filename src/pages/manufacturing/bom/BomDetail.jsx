/* global globalThis */
import LoadingPaper from "@/components/content-components/LoadingPaper";
import FormPageLayout from "@/components/layout/FormPageLayout";
import BomForm from "@/components/manufacturing/BomForm";
import { Button } from "@/components/ui/button";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { deleteBom, getBomByItemId } from "@/services/manufacturing/BomService";
import toastrService from "@/services/toastrService";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BomDetail = () => {
  const { itemId } = useParams();
  const [bom, setBom] = useState(null);
  const [bomDetails, setBomDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBom = async () => {
      setLoading(true);
      try {
        const data = await getBomByItemId(itemId, token);
        setBom(data);
        setBomDetails(Array.isArray(data.bomDetails) ? data.bomDetails : []);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Có lỗi khi lấy thông tin BOM!"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBom();
  }, [itemId, token]);

  const readOnlyFields = {
    bomCode: true,
    itemCode: true,
    itemName: true,
    description: true,
    status: true,
  };

  const columns = [
    {
      accessorKey: "itemCode",
      header: createSortableHeader("Mã NVL"),
      cell: ({ getValue }) => {
        const code = getValue();
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {code}
          </span>
        );
      },
    },
    {
      accessorKey: "itemName",
      header: createSortableHeader("Tên NVL"),
    },
    {
      accessorKey: "quantity",
      header: createSortableHeader("Số lượng"),
    },
    {
      accessorKey: "note",
      header: createSortableHeader("Ghi chú"),
      cell: ({ getValue }) => getValue() || "-",
    },
  ];

  const handleDelete = async () => {
    const confirmFn =
      typeof globalThis !== "undefined" &&
      typeof globalThis.confirm === "function"
        ? globalThis.confirm.bind(globalThis)
        : null;
    if (confirmFn && !confirmFn("Bạn có chắc muốn xóa BOM này không?")) {
      return;
    }

    try {
      await deleteBom(bom.bomId, token);
      toastrService.success("Xóa BOM thành công!");
      navigate("/boms");
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi xảy ra khi xóa BOM!"
      );
    }
  };

  if (!bom) {
    return <LoadingPaper title="THÔNG TIN BOM" />;
  }

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Danh sách BOM", path: "/boms" },
        { label: "Chi tiết" },
      ]}
      backLink="/boms"
      backLabel="Quay lại danh sách"
    >
      <BomForm
        bom={bom}
        onChange={() => {}}
        errors={{}}
        readOnlyFields={readOnlyFields}
        setBom={setBom}
      />

      <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
        Danh sách nguyên vật liệu
      </h2>

      <DataTable
        columns={columns}
        data={bomDetails}
        loading={loading}
      />

      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="default"
          onClick={() => navigate(`/bom/${bom.itemId}/edit`)}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Edit className="w-4 h-4" />
          Sửa
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          className="gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Xóa
        </Button>
      </div>
    </FormPageLayout>
  );
};

export default BomDetail;
