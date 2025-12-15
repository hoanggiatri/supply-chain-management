import { AddButton } from "@/components/common/ActionButtons";
import ListPageLayout from "@/components/layout/ListPageLayout";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { getAllBomsInCompany } from "@/services/manufacturing/BomService";
import toastrService from "@/services/toastrService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BomInCompany = () => {
  const [boms, setBoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchBoms = async () => {
      setLoading(true);
      try {
        const data = await getAllBomsInCompany(companyId, token);
        setBoms(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Có lỗi xảy ra khi lấy danh sách BOM!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBoms();
  }, [companyId, token]);

  const statusLabels = {
    active: "Đang sử dụng",
    inactive: "Ngừng sử dụng",
  };

  const statusColors = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-red-100 text-red-700",
  };

  const columns = [
    {
      accessorKey: "bomCode",
      header: createSortableHeader("Mã BOM"),
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
      accessorKey: "itemCode",
      header: createSortableHeader("Mã hàng hóa"),
    },
    {
      accessorKey: "itemName",
      header: createSortableHeader("Tên hàng hóa"),
    },
    {
      accessorKey: "description",
      header: createSortableHeader("Mô tả"),
    },
    {
      accessorKey: "status",
      header: createSortableHeader("Trạng thái"),
      cell: ({ getValue }) => {
        const status = getValue();
        const label = statusLabels[status] || status;
        const colorClass = statusColors[status] || "bg-gray-100 text-gray-700";

        return (
          <span
            className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${colorClass}`}
          >
            {label}
          </span>
        );
      },
    },
  ];

  return (
    <ListPageLayout
      breadcrumbs="Danh mục BOM"
      title="Danh sách BOM"
      actions={
        <AddButton
          onClick={() => navigate("/create-bom")}
          label="Thêm mới"
        />
      }
    >
      <DataTable
        columns={columns}
        data={boms}
        loading={loading}
        onRowClick={(row) => navigate(`/bom/${row.itemId}`)}
        exportFileName="Danh_sach_BOM"
        exportMapper={(row = {}) => ({
          "Mã BOM": row.bomCode || "",
          "Mã hàng hóa": row.itemCode || "",
          "Tên hàng hóa": row.itemName || "",
          "Mô tả": row.description || "",
          "Trạng thái": statusLabels[row.status] || row.status || "",
        })}
      />
    </ListPageLayout>
  );
};

export default BomInCompany;
